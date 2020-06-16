const isValidGeoObject = (point) => {
  return point.hasOwnProperty("lat") && point.hasOwnProperty("lon")
    ? true
    : false;
};

const processPointObject = (data, options, func) => {
  if (isValidGeoObject) {
    const lat =
      Math.abs(parseFloat(data.lat)) > 90
        ? {
            Error: "Latitude out of bounds",
          }
        : func(data.lat, options);
    const lon =
      Math.abs(parseFloat(data.lon)) > 180
        ? {
            Error: "Longitude out of bounds",
          }
        : func(data.lon, options);

    return options.flatten ? [lat, lon] : { lat, lon };
  } else {
    return options.flatten
      ? Object.keys(data).map((item) => func(data[item], options))
      : Object.keys(data).reduce((obj, item) => {
          obj[item] = func(data[item], options);
          return obj;
        }, {});
  }
};

module.exports = processPointObject;
