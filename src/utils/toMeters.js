const geo_const = require("./const");

const measurement = (distanceString) => {
  const distance = parseFloat(distanceString);

  switch (true) {
    case /(NM)/i.test(distanceString): //nautical miles
      return distance / geo_const.METER_TO_NM;

    case /(KM)/i.test(distanceString): //Kilometers
      return distance / geo_const.METER_TO_KM;

    case /(M)/.test(distanceString): //Miles
      return distance / geo_const.METER_TO_MILE;

    case /(m)/.test(distanceString): //meters
      return distance;

    default:
      throw "No Measurement found";
  }
};

module.exports = measurement;
