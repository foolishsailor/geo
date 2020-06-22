import segmentedControl from "./components/segmentedControl.js";

const getDestinationPoint = (() => {
  let gdp_output_format = "Decimal";
  let gdp_surface_type = "Spherical";

  const clearInputError = (e) => {
    e.target.classList.remove("input---error");
  };

  const selectOutputFormat = (e) => {
    if (typeof e.target.value !== "undefined")
      gdp_output_format = e.target.value;
  };

  const selectSurfaceType = (e) => {
    if (typeof e.target.value !== "undefined")
      gdp_surface_type = e.target.value;
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
      formatType: gdp_output_format,
      surfaceType: gdp_surface_type,
    });

    destination.lat.value = destPoint.lat;
    destination.lon.value = destPoint.lon;
  };

  const init = () => {
    const gdp_outputFormat_items = ["Decimal", "Cardinal", "DMS"];
    segmentedControl("gdp_outputFormat", gdp_outputFormat_items);

    const gdp_surfaceModel_items = ["Spherical", "Ellipsoidal"];
    segmentedControl("gdp_surfaceModel", gdp_surfaceModel_items);

    [
      ["getDestination", getDestinationPoint],
      ["gdp_outputFormat", selectOutputFormat],
      ["gdp_surfaceModel", selectSurfaceType],
    ].forEach((item) =>
      document.getElementById(item[0]).addEventListener("click", item[1])
    );
  };

  init();

  return {
    clearInputError,
    getDestinationPoint,
  };
})();

export default getDestinationPoint;
