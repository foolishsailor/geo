require("../prototypes");
const { parseDMS } = require("./parseDMS");

/**
 * Inspects array of bearings and returns array of items that are not valid bearing values.
 * If all values are valid then returns an array with length 0
 * @param {array} bearings
 * @param {bool} allowString - bool that determeins is a string that parses to a number is allowed.  Default - false
 *
 * @return {array} - If there are bad bearings then returns array of objects that containe the index and value
 *  @param {number} index - Index of bad item
 *  @param {!number} value - Any value that does not parse to a number
 */
validateBearings = (bearings, allowString) => {
  let results = [];
  bearings.forEach(function (bearing, i) {
    if (isNaN(bearing) || bearing >= 360 || bearing < 0 || bearing === null)
      return results.push({
        index: i,
        value: bearing,
      });

    if (!allowString && typeof bearing === "string")
      results.push({
        index: i,
        value: bearing,
      });
  });

  return results;
};

/**
 * processPointData
 *
 * Checks all items in array for valid formated Position
 * @param {Object[]} positions - array of Position Objects
 *  @param {number} positions[].lat
 *  @param {number} positions[].lon
 * @return {array} - Returns array of parsed data converted to DMS
 *
 */
processPointData = (positions) => {
  try {
    //check if array
    if (!Array.isArray(positions)) positions = new Array(positions);

    let returnArray = [];

    for (let i = 0; i < positions.length; i++) {
      let point = positions[i];

      //check if out of bounds
      point.lat = parseDMS(point.lat);

      if (Math.abs(point.lat) > 90)
        throw {
          error: "GPS Position Error",
          message: "Latitude out of bounds",
        };

      point.lon = parseDMS(point.lon);
      if (Math.abs(point.lon) > 180)
        throw {
          error: "GPS Position Error",
          message: "Longitude out of bounds",
        };

      returnArray.push(point);
    }

    return returnArray;
  } catch (err) {
    throw err;
  }
};

/**
 * testPositionStringRanges
 *
 * Checks parsed DMS array for any element out of bounds.  Uses regex
 * on original string to look for NS to see if item is Lat or Lon
 *
 * @param {string} dmsString - Original string position
 * @param {array} dmsArray - Array of parsed string into elements [Degrees, Minutes, Seconds]
 *  @return {null | Error } returns error if item out of bounds or malformed
 */
validateDMSstring = (dmsString, dmsArray) => {
  //check deg boundaries
  if (Math.abs(dmsArray[0]) > 180) throw "DMS degrees out of bounds";

  if (/[NS]/i.test(dmsString) && Math.abs(dmsArray[0]) > 90)
    throw "DMS degrees out of bounds";

  switch (
    dmsArray.length // convert to decimal degrees...
  ) {
    case 3: // interpret 3-part result as d/m/s
      if (dmsArray[1] > 60) throw "DMS minutes out of bounds";

      if (dmsArray[2] > 60) throw "DMS seconds out of bounds";

    case 2: // interpret 2-part result as d/m
      if (dmsArray[1] > 60) throw "DMS minutes out of bounds";

    default:
      return;
  }
};

module.exports = {
  validateBearings,
  processPointData,
  validateDMSstring,
  parseDMS,
};
