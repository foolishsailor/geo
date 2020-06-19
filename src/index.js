const parseDMS = require("./parseDMS/index");
const {
  getAvgOfBearings,
  getBearingBetweenTwoPoints,
  getBearingDiff,
  addHeading,
  invertHDG,
  findMiddleAngle,
} = require("./bearings");
const { getBoundsOfData, getMinMaxAvgFromArray } = require("./arrayUtils");
const {
  getDistanceCos,
  getDistanceHaversine,
  getDistanceFromSpeedTime,
  crossTrackDistanceTo,
} = require("./distance");
const { getIntersectionPoint, getPosBngDist, mercator } = require("./position");
const { humanTime } = require("./time");
const { GDP_smoother } = require("./smoothing");

module.exports = (() => {
  return {
    getAvgOfBearings,
    getBearingBetweenTwoPoints,
    getBearingDiff,
    addHeading,
    invertHDG,
    findMiddleAngle,
    parseDMS,
    getBoundsOfData,
    getMinMaxAvgFromArray,
    getDistanceCos,
    getDistanceHaversine,
    getDistanceFromSpeedTime,
    crossTrackDistanceTo,
    getIntersectionPoint,
    getPosBngDist,
    mercator,
    humanTime,
    GDP_smoother,
  };
})();
