const formatPoint = (point) => {
  return { lat: point.lat.toLat(), lon: point.lon.toLon() };
};

module.exports = formatPoint;
