require("./utils/prototypes");
const geo_const = require("./utils/const");
const surface = require("./surface");
const formatPoint = require("./utils/formatPoint");
const { pipe } = require("./utils/compose");

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
const getDestinationPoint = ({
  point,
  bearing,
  surfaceType = "Spherical",
  formatType = "DMS",
  ...rest
}) => {
  //Composition approach

  return pipe(
    surface(surfaceType).getDestinationPoint, //apply chosen surface type formula
    formatPoint(formatType) //apply chosen format
  )({
    point: {
      lat: point.lat.toRad(),
      lon: point.lon.toRad(),
    },
    bearing: Number(bearing).toRad(),
    ...rest,
  });
};

/**
    getIntersectionPoint

    Calculate intersection point between two lines/routes in lat and lon.  They are not required to overlap to calculate
   
      @property {object} trackA
        @property {number} lat
        @property {number} lon

      @property {object} trackB
        @property {number} lat
        @property {number} lon


    @return {object}
      @property {number} lat
      @property {number} lon

  */
const getIntersectionPoint = ({
  trackA,
  trackB,
  surfaceType = "Spherical",
  formatType = "DMS",
  ...rest
}) => {
  const XAsum = trackA.start.lon - trackA.end.lon,
    XBsum = trackB.start.lon - trackB.end.lon,
    YAsum = trackA.start.lat - trackA.end.lat,
    YBsum = trackB.start.lat - trackB.end.lat,
    lineDenominator = XAsum * YBsum - YAsum * XBsum;

  if (lineDenominator == 0.0) return false;

  const a =
    trackA.start.lon * trackA.end.lat - arrs.trackA.start.lat * trackA.end.lon;
  const b =
    trackB.start.lon * trackB.end.lat - trackB.start.lat * trackB.end.lon;

  const lat = (a * YBsum - b * YAsum) / lineDenominator;
  const lon = (a * XBsum - b * XAsum) / lineDenominator;

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
  getDestinationPoint,

  mercator,
};
