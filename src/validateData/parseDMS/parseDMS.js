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
 */

const processPointObject = require("./components/processPointObject");
const processDMS = require("../parseDMS/components/processDMS");

/**
 *  parseDMS - main parsing function
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
    return processPointObject(data, options, parseDMS);
  }

  throw {
    error: "Malformed Position Data",
    message: "Malformed Data",
  };
};

module.exports = {
  parseDMS,
};
