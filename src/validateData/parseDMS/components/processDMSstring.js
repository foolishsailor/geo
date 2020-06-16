const processDMSstring = (dms) => {
  let deg;
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
      deg =
        dms[0].slice(0, 3) / 1 +
        dms[0].slice(3, 5) / 60 +
        dms[0].slice(5) / 3600;
      break;
    default:
      throw "Malformed Position Data";
  }

  return deg;
};

module.exports = processDMSstring;
