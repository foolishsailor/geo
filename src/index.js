const parseDMS = require("./parseDMS/index");
const {
  getAvgOfBearings,
  getBearingBetweenTwoPoints,
  getBearingDiff,
  addHeading,
  invertHDG,
  findMiddleAngle,
} = require("./bearings");
const {
  getBoundsOfData,
  getMinMaxAvgFromArray,
} = require("./utils/arrayUtils");
const {
  getDistanceCos,
  getDistanceHaversine,
  getDistanceFromSpeedTime,
  crossTrackDistanceTo,
} = require("./distance");
const {
  getIntersectionPoint,
  getDestinationPoint,
  mercator,
} = require("./position");
const { humanTime } = require("./utils/time");
const { GDP_smoother } = require("./utils/smoothing");

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
    getDestinationPoint,
    mercator,
    humanTime,
    GDP_smoother,
  };
})();
