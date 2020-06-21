require("./utils/prototypes");
const geo_const = require("./utils/const");
const surface = require("./surface");
const measurement = require("./utils/measurement");
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
  surfaceType = "spherical",
  formatType = "DMS",
  ...rest
}) => {
  //Composition approach
  const process = pipe(
    measurement, //get measurment unit user choose and apply values
    surface(surfaceType).getDestinationPoint, //apply chosen surface type formula
    formatPoint //apply chosen format
  );

  return process({
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
  getDestinationPoint,

  mercator,
};
