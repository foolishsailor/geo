/**
    getDistanceCos

    Calculate distance between two points in km.  This method generates more accurate distance for points close together
    like within a tunr or on a race course

    @param {object} from - GPS position
      @property {number} lat
      @property {number} lon
    @param {object} to - GPS position
      @property {number} lat
      @property {number} lon
    @return {Number} - km [default]

  */
const getDistanceCos = (from, to, radius) => {
  let R = radius || geo_const.MEAN_RADIUS_IN_M / 1000; //default to earth radius in km

  let d =
    Math.acos(
      Math.sin((from.lat * Math.PI) / 180) *
        Math.sin((to.lat * Math.PI) / 180) +
        Math.cos((from.lat * Math.PI) / 180) *
          Math.cos((to.lat * Math.PI) / 180) *
          Math.cos(((to.lon - from.lon) * Math.PI) / 180)
    ) * R;
  return d;
};

/**
    getDistanceHaversine

    Calculate distance between two points.  This method generates more accurate distance for points farther apart
    and incorporates the curve of the earth as part of the equation

    @param {object} from - GPS position
      @property {number} lat
      @property {number} lon
    @param {object} to - GPS position
      @property {number} lat
      @property {number} lon
    @return {Number}

  */
const getDistanceHaversine = (from, to) => {
  let R = geo_const.MEAN_RADIUS_IN_M / 1000; // earth's mean radius in km
  let dLat = ((to.lat - from.lat) * Math.PI) / 180;
  let dLon = ((to.lon - from.lon) * Math.PI) / 180;
  from.lat = (from.lat * Math.PI) / 180;
  to.lat = (to.lat * Math.PI) / 180;

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat) *
      Math.cos(to.lat) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

/**
 * getDistanceFromSpeedTime
 *
 * Calculate distance from speed (in kM/hour) and Time (seconds)
 *
 * @param {number} speed - speed in kM/hr
 * @param {number} time - time in Seconds
 * @return {object}
 *      @property {number} distInDegree
 *      @property {number} distInFeet
 *      @property {number} distInKilometers
 *
 * */

const getDistanceFromSpeedTime = (speed, time) => {
  return {
    distInDegree: (speed * (time / geo_const.HOUR)) / geo_const.KM_IN_DEG,
    distInFeet: speed * (time / geo_const.HOUR) * geo_const.KM_TO_FEET,
    distInKilometers: speed * (time / geo_const.HOUR),
    distInNM: speed * (time / geo_const.HOUR) * geo_const.KM_TO_NM,
  };
};

/**
   * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point.
   *
   * @param   {object} lineStart - Start point of great circle path.
       @param {number} lat
       @param {number} lon
   * @param   {object} lineEnd - End point of great circle path.
       @param {number} lat
       @param {number} lon
     @param   {object} currentPoint -current location
         @param {number} lat
         @param {number} lon
   * @param   {bool} haversine - use haversine versus cosine calculation.  Cos is best for smalelr distances 
   * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
   *    *    
   */
function crossTrackDistanceTo({
  lineStart,
  lineEnd,
  currentPoint,
  haversine = false,
}) {
  let lineLength = haversine
    ? this.getDistanceHaversine(
        lineStart,
        currentPoint,
        geo_const.MEAN_RADIUS_IN_M
      ) / geo_const.MEAN_RADIUS_IN_M
    : this.getDistanceCos(lineStart, currentPoint, geo_const.MEAN_RADIUS_IN_M) /
      geo_const.MEAN_RADIUS_IN_M;

  let startToCurrent =
    this.getBearingBetweenTwoPoints(lineStart, currentPoint) * (Math.PI / 180);

  let startLineBearing =
    this.getBearingBetweenTwoPoints(lineStart, lineEnd) * (Math.PI / 180);

  let XTE = Math.asin(
    Math.sin(lineLength) * Math.sin(startToCurrent - startLineBearing)
  );

  return XTE * geo_const.MEAN_RADIUS_IN_M;
}

module.exports = {
  getDistanceCos,
  getDistanceHaversine,
  getDistanceFromSpeedTime,
  crossTrackDistanceTo,
};
