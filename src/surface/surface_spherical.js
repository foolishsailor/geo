const toMeters = require("../utils/toMeters");
const geo_const = require("../utils/const");
require("../utils/prototypes");

/**
 * Formula for calculations using simple trigonometry to calculate based on spherical surface model
 *
 */

/** getDestinationPoint
 * Spherical formula for calulating destination point based on distance and bearing.
 * All inputs in radians
 * @param {object} point - origin point
 * @param {number} distance - distance/ radius from previous function in composition
 * @param {number} bearing - direction traveled in radians
 * */
const getDestinationPoint = ({ point, distance, bearing }) => {
  const lat1 = point.lat;
  const lon1 = point.lon;

  distance = toMeters(distance) / geo_const.MEAN_RADIUS_IN_M;

  return {
    lat: Math.asin(
      Math.sin(lat1) * Math.cos(distance) +
        Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)
    ).toDeg(),
    lon: (
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1),
        Math.cos(distance) -
          Math.sin(lat1) * Math.sin(lat1) * Math.cos(distance) +
          Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)
      )
    ).toDeg(),
  };
};

module.exports = { getDestinationPoint };
