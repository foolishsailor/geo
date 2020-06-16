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
            error: "Latitude out of bounds",
          }
        : func(data.lat, options);
    const lon =
      Math.abs(parseFloat(data.lon)) > 180
        ? {
            error: "Longitude out of bounds",
          }
        : func(data.lon, options);

    if (!options.continueOnError) {
      if (lat.error) throw lat.error;
      if (lon.error) throw lon.error;
    }
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
