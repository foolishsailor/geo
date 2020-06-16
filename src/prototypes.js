const { parseDMS } = require("./validateData/validation");

Number.prototype.toFixedNumber = function (digits, base) {
  var pow = Math.pow(base || 10, digits);
  return Math.round(this * pow) / pow;
};

// convert degrees to radians
Number.prototype.toRad = function () {
  return (this * Math.PI) / 180;
};

// convert radians to degrees (signed)
Number.prototype.toDeg = function () {
  return (this * 180) / Math.PI;
};

// convert radians to degrees (as bearing: 0...359)
Number.prototype.toBNG = function () {
  return (this.toDeg() + 360) % 360;
};

// convert numeric degrees to human readable deg/min/sec - i.e. 41.34445 = 041°20'40"
Number.prototype.toDMS = function () {
  let decimal = Math.abs(this);
  decimal += 1 / 7200; // add to second for rounding
  let deg = Math.floor(decimal);
  let min = Math.floor((decimal - deg) * 60);
  let sec = Number(((decimal - deg - min / 60) * 3600).toFixed(2));

  // add leading zeros if required
  if (deg < 100) deg = "0" + deg;
  if (deg < 10) deg = "0" + deg;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return `${deg}\u00B0${min}\u0027${sec}\u0022`;
};

Number.prototype.toLat = function () {
  // convert numeric degrees to deg/min/sec latitude
  return this.toDMS().slice(1) + (this < 0 ? "S" : "N"); // knock off initial '0' for lat
};

Number.prototype.toLon = function () {
  // convert numeric degrees to deg/min/sec longitude
  return this.toDMS() + (this > 0 ? "E" : "W");
};

/**
 * Parses human readable DMS string into Decimal format
 *
 * See: /validation/parseDMS for attribution nad info *
 */

String.prototype.parseDMS = function () {
  return parseDMS(this);
};
