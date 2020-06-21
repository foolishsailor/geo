const geo_const = require("./const");

const measurement = ({ distance, ...rest }) => {
  console.log("distance", distance);
  let divisor;

  switch (true) {
    case /(NM)/i.test(distance): //nautical miles
      divisor = geo_const.MEAN_RADIUS_IN_M * geo_const.METER_TO_NM;
      break;

    case /(KM)/i.test(distance): //Kilometers
      divisor = geo_const.MEAN_RADIUS_IN_M * geo_const.METER_TO_KM;
      break;

    case /(M)/.test(distance): //Miles
      divisor = geo_const.MEAN_RADIUS_IN_M * geo_const.METER_TO_MILE;
      break;

    case /(m)/.test(distance): //meters
      divisor = geo_const.MEAN_RADIUS_IN_M;
      break;

    default:
      throw "No Measurement found";
  }

  distance = parseFloat(distance) / divisor;

  return { distance, ...rest };
};

module.exports = measurement;
