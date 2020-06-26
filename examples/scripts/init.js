import loader from "./loader.js";

export default (() => {
  loader("parseAndValidateString", "parseAndValidateString");

  loader("getDestinationPoint", "getDestinationPoint");
  loader("getIntersectionPoint");

  loader("validateBearings");
  loader("getAvgOfBearings");
  loader("getBngTwoPoints");

  loader("generalBearingFunctions");
})();
