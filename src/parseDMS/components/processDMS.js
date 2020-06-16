const validateDMSstring = require("./validateDMSString");
const processDMSstring = require("./processDMSstring");

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

    let deg,
      dms = position
        .replace(/^-/, "")
        .replace(/[NSEW]/i, "") // strip off any sign or compass dir'n
        .split(/[^0-9.,]+/); // split out separate d/m/s

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
    deg = processDMSstring(dms);

    if (/^-/.test(position) || /[WS]/i.test(position)) deg = -deg; // take '-', west and south as -ve
    return deg.toFixedNumber(7);
  } catch (err) {
    if (options.continueOnError) return { error: err };
    throw err;
  }
};

module.exports = processDMS;
