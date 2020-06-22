const geo_const = require("./const");

const measurement = (distanceString) => {
  let divisor;

  switch (true) {
    case /(NM)/i.test(distanceString): //nautical miles
      divisor = geo_const.MEAN_RADIUS_IN_M * geo_const.METER_TO_NM;
      break;

    case /(KM)/i.test(distanceString): //Kilometers
      divisor = geo_const.MEAN_RADIUS_IN_M * geo_const.METER_TO_KM;
      break;

    case /(M)/.test(distanceString): //Miles
      divisor = geo_const.MEAN_RADIUS_IN_M * geo_const.METER_TO_MILE;
      break;

    case /(m)/.test(distanceString): //meters
      divisor = geo_const.MEAN_RADIUS_IN_M;
      break;

    default:
      throw "No Measurement found";
  }

  const distance = parseFloat(distanceString) / divisor;

  return distance;
};

module.exports = measurement;
