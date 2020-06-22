const spherical = require("./surface_spherical");
const ellipsoidal = require("./surface_ellipsoidal");

module.exports = (surfaceType) => {
  console.log("trigger", surfaceType);
  return surfaceType === "Ellipsoidal" ? ellipsoidal : spherical;
};
