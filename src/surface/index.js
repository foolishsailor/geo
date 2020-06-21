const spherical = require("./surface_spherical");
const ellipsoidal = require("./surface_ellipsoidal");
const vicenty = require("./surface_vicenty");

module.exports = (surfaceType) => {
  switch (surfaceType) {
    case "vicenty":
      return vicenty;
    case "ellipsoidal":
      return ellipsoidal;
    default:
      return spherical;
  }
};
