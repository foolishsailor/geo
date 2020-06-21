const {
  getIntersectionPoint,
  getDestinationPoint,
  mercator,
} = require("../src/position");

const measurement = require("../src/utils/measurement");
const { pipe } = require("../src/utils/compose");
const surface_spherical = require("../src/surface/surface_spherical");

require("../src/utils/prototypes");

const test_defaults = require("./test_defaults");

describe("getDestinationPoint()", () => {
  it("should work", () => {
    expect(
      getDestinationPoint({
        point: { lat: 51.47788, lon: -0.00147 },
        distance: "7794m",
        bearing: 300.7,
      })
    ).toEqual("51.5136°N, 000.0983°W");
  });
});
