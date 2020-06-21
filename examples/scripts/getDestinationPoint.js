const getDestinationPoint = (() => {
  const clearInputError = (e) => {
    e.target.classList.remove("input---error");
  };

  const getDestinationPoint = (e) => {
    e.preventDefault();
    const origin = {
      lat: document.querySelector("input[name=gpbd_origin_lat]"),
      lon: document.querySelector("input[name=gpbd_origin_lon]"),
    };

    const destination = {
      lat: document.querySelector("input[name=gpbd_destination_lat]"),
      lon: document.querySelector("input[name=gpbd_destination_lon]"),
    };

    const bearing = document.querySelector("input[name=gpbd_bearing]");
    const distance = document.querySelector("input[name=gpbd_distance");

    const point = {
      lat: geo.parseDMS(origin.lat.value),
      lon: geo.parseDMS(origin.lon.value),
    };

    const destinationPoint = geo.getDestinationPoint({
      point: point,
      distance: distance.value,
      bearing: Number(bearing.value),
    });

    console.log("destination", destinationPoint);

    destination.lat.value = destinationPoint.lat;
    destination.lon.value = destinationPoint.lon;
  };

  return {
    clearInputError,
    getDestinationPoint,
  };
})();
