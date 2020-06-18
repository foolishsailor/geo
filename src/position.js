require("./prototypes");

/**
 * getPositionFromBearingAndDistance
 *
 * Use origin point, bearing and distance moved to calculate new position
 * @param {object} point - origin point
 *  @param {number} point.lat
 *  @param {number} point.lon
 * @param {number} distance - distance travelled
 * @param {number} bearing - direction travelled
 *
 * @return {object}
 *  @param {number} lat
 *  @param {number} lon
 */
const getPosFromBngAndDist = (point, distance, bearing) => {
  dist = distance / geo_const.MEAN_RADIUS_IN_M / 1000;

  let brng = Number(bearing).toRad(),
    lat1 = point.lat.toRad(),
    lon1 = position.lng.toRad(),
    lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)
    ),
    lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
        Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2)
      );

  return {
    lat: lat2.toDeg(),
    lon: lon2.toDeg(),
  };
};

/**
    getIntersectionPoint

    Calculate intersection point between two lines/routes in lat and lon.  They are not required to overlap to calculate
   
      @property {object} lineA
        @property {number} lat
        @property {number} lon

      @property {object} lineB
        @property {number} lat
        @property {number} lon


    @return {object}
      @property {number} lat
      @property {number} lon

  */
const getIntersectionPoint = ({ lineA, lineB }) => {
  let XAsum = lineA.start.lon - lineA.end.lon;
  let XBsum = lineB.start.lon - lineB.end.lon;
  let YAsum = lineA.start.lat - lineA.end.lat;
  let YBsum = lineB.start.lat - lineB.end.lat;

  let lineDenominator = XAsum * YBsum - YAsum * XBsum;
  if (lineDenominator == 0.0) return false;

  let a =
    lineA.start.lon * lineA.end.lat - arrs.lineA.start.lat * lineA.end.lon;
  let b = lineB.start.lon * lineB.end.lat - lineB.start.lat * lineB.end.lon;

  let lat = (a * YBsum - b * YAsum) / lineDenominator;
  let lon = (a * XBsum - b * XAsum) / lineDenominator;

  return { lat, lon };
};

/**
 * Convert lat/lon to mercator projection points
 */
const mercator = ({ latitude, longitude }) => {
  const MAX = 85.0511287798;
  const RADIANS = Math.PI / 180;
  let point = {};

  point.lon = geo_const.RADIUS_IN_M * longitude * RADIANS;
  point.lat = Math.max(Math.min(MAX, latitude), -MAX) * RADIANS;
  point.lat =
    geo_const.RADIUS_IN_M * Math.log(Math.tan(Math.PI / 4 + point.lat / 2));

  return point;
};

module.exports = {
  getIntersectionPoint,
  getPosFromBngAndDist,
  mercator,
};
