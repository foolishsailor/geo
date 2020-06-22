const getDestinationPoint = (() => {
  const clearInputError = (e) => {
    e.target.classList.remove("input---error");
  };

  const getDestinationPoint = (e) => {
    e.preventDefault();

    const setElem = (elem) => {
      return document.querySelector(`input[name=${elem}]`);
    };

    const origin = {
      lat: setElem("gdp_origin_lat"),
      lon: setElem("gdp_origin_lon"),
    };

    const destination = {
      lat: setElem("gdp_dest_lat"),
      lon: setElem("gdp_dest_lon"),
    };

    const bearing = setElem("gdp_bearing");
    const distance = setElem("gdp_distance");

    const point = {
      lat: geo.parseDMS(origin.lat.value),
      lon: geo.parseDMS(origin.lon.value),
    };

    const destPoint = geo.getDestinationPoint({
      point,
      distance: distance.value,
      bearing: Number(bearing.value),
      formatType: "Cardinal",
    });

    destination.lat.value = destPoint.lat;
    destination.lon.value = destPoint.lon;
  };

  return {
    clearInputError,
    getDestinationPoint,
  };
})();
