const getPostionFromBearingAndDistance = (waypoint, distance, bearing) => {
  let position = {
    lat: waypoint.lat(),
    lng: waypoint.lng(),
  };

  dist = distance / geo_const.MEAN_RADIUS_IN_M / 1000;

  let brng = (Number(bearing) * Math.PI) / 180;
  let lat1 = position.lat;
  lat1 = (lat1 * Math.PI) / 180;
  let lon1 = position.lng;
  lon1 = (lon1 * Math.PI) / 180;

  let lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dist) +
      Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)
  );

  let lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
      Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: (lat2 * 180) / Math.PI,
    lng: (lon2 * 180) / Math.PI,
  };
};

/**
    getIntersection

    Calculate intersection point between two lines/routes in lat and lon.  They are not required to overlap to calulate

   
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
  getPostionFromBearingAndDistance,
  mercator,
};
