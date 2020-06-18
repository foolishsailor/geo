import loader from "./loader.js";

export default (() => {
  loader("parseAndValidateString", "parseAndValidateString");
  loader("parseAndValidateArray");
  loader("getPostionFromBearingAndDistance");
  loader("getIntersectionPoint");

  loader("validateBearings");
  loader("getAvgOfBearings");
  loader("getBngTwoPoints");
  loader("getBngDiff");
  loader("generalBearingFunctions");
})();
