/**
 * validateDMSstring
 *
 * Checks parsed DMS array for any element out of bounds.  Uses regex
 * on original string to look for NS to see if item is Lat or Lon
 *
 * @param {string} dmsString - Original string position
 * @param {array} dmsArray - Array of parsed string into elements [Degrees, Minutes, Seconds]
 *  @return {null | Error } returns error if item out of bounds or malformed
 */
const validateDMSstring = (dmsString, dmsArray) => {
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

module.exports = validateDMSstring;
