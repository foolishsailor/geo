const isValidGeoObject = (point) => {
  return point.hasOwnProperty("lat") && point.hasOwnProperty("lon")
    ? true
    : false;
};

/**
 * parseDMS
 *
 * Versitle parsing of human readbale GPS data into decimal format format.  Handles awide
 * variety of data entry to allow users flexibility in doing data entry.
 *
 * It can also handle deeply nested diverse data formats and return the information formated
 * into existing structure or flattened.
 *
 * Options include ability to throw error when malformed data encountered to enable use as a validation
 * on forms or to return all malfored data in seperate array to allow parsing of large data sets.
 *
 * Adapted and built from Chris Veness original script
 *  * http://www.movable-type.co.uk/scripts/latlong.htmlarses
 *
 * FOr more detail see:  https://github.com/foolishsailor/geo
 *
 * @param {String | Array | Object} data
 *  @param {String | Number} data.lat
 *  @param {String | Number} data.lon
 *`@param {Object} [options] -    option flags for processing data
 *  @param {bool} [strict=true] - Disallow any chars not part of normal DMS
 *  @param {bool} [flatten=false] - Keep input strcture or flatten to single array
 *  @param {bool} [returnMalformed=false] - Return second array of malformed items and their original indeox
 *  @param {bool} [keepError=false] - Keep malformed elements inSitu otherwise shows error.
 *  @param {bool} [continueOnError=false] - throw error if malformed data based on strict options settings is found
 *                                          if set to true then return error object in istu:  {"Error": err title}
 *
 */

const parseDMS = (data, options = {}) => {
  if (data == null) return null;
  //Check if string
  if (typeof data === "string" || typeof data === "number")
    return processDMS(data, options);

  //Check if Array and recursively process
  if (Array.isArray(data))
    return options.flatten
      ? data.reduce((a, c) => a.concat(parseDMS(c, options)), [])
      : data.map((item) => parseDMS(item, options));
  //

  //Check if object with lat lon
  if (typeof data === "object") {
    if (isValidGeoObject) {
      const lat =
        Math.abs(parseFloat(data.lat)) > 90
          ? {
              Error: "Latitude out of bounds",
            }
          : parseDMS(data.lat, options);
      const lon =
        Math.abs(parseFloat(data.lon)) > 180
          ? {
              Error: "Longitude out of bounds",
            }
          : parseDMS(data.lon, options);

      return options.flatten ? [lat, lon] : { lat, lon };
    } else {
      return options.flatten
        ? Object.keys(data).map((item) => parseDMS(data[item], options))
        : Object.keys(data).reduce((obj, item) => {
            obj[item] = parseDMS(data[item], options);
            return obj;
          }, {});
    }
  }

  throw {
    error: "Malformed Position Data",
    message: "Malformed Data",
  };
};

const processDMS = (position, options) => {
  try {
    //Check for any illegal characters
    if (/[^0-9.,NSEW\-\s\u00B0\'\"]/i.test(position))
      throw "Malformed Position Data";

    //Check position is already a decimal and less than max longitude
    if (
      !isNaN(parseFloat(position)) &&
      isFinite(position) &&
      Math.abs(position)
    ) {
      if (Math.abs(position) > 180) throw "Position Out of Bounds";

      return Number(position);
    }

    let deg;
    let degLL = position.replace(/^-/, "").replace(/[NSEW]/i, ""); // strip off any sign or compass dir'n

    //console.log("degll", degLL);
    let dms = degLL.split(/[^0-9.,]+/); // split out separate d/m/s

    //If find '' anywhere but at end of array then malformed data exists so throw error
    dms.forEach((e, i) => {
      if (e == "") {
        if (i < dms.length - 1) {
          throw "Malformed Position Data";
        }
        dms.splice(i, 1);
      }
    });

    validateDMSstring(position, dms);

    switch (
      dms.length // convert to decimal degrees...
    ) {
      case 3: // interpret 3-part result as d/m/s
        deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
        break;
      case 2: // interpret 2-part result as d/m
        deg = dms[0] / 1 + dms[1] / 60;
        break;
      case 1: // decimal or non-separated dddmmss
        if (/[NS]/i.test(position)) degLL = "0" + degLL; // - normalise N/S to 3-digit degrees
        deg =
          dms[0].slice(0, 3) / 1 +
          dms[0].slice(3, 5) / 60 +
          dms[0].slice(5) / 3600;
        break;
      default:
        throw "Malformed Position Data";
    }

    if (/^-/.test(position) || /[WS]/i.test(position)) deg = -deg; // take '-', west and south as -ve
    return deg.toFixedNumber(7);
  } catch (err) {
    if (options.continueOnError) return { Error: err };
    throw err;
  }
};

module.exports = {
  parseDMS,
};
