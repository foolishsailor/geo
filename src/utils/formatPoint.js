const formatPoint = (formatType) => {
  switch (formatType) {
    case "DMS":
      return (point) => {
        return {
          lat: point.lat.toDMSLat(),
          lon: point.lon.toDMSLon(),
        };
      };
    case "Cardinal":
      return (point) => ({
        lat: point.lat.toFixedNumber(4).toDLat(),
        lon: point.lon.toFixedNumber(4).toDLon(),
      });
    case "Decimal":
      return (point) => ({
        lat: point.lat.toFixedNumber(4),
        lon: point.lon.toFixedNumber(4),
      });
  }
};

module.exports = formatPoint;
