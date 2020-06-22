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
  it("should show DMS", () => {
    expect(
      getDestinationPoint({
        point: { lat: 51.47788, lon: -0.00147 },
        distance: "7794m",
        bearing: 300.7,
      })
    ).toEqual(
      expect.objectContaining({ lat: "51°30'49.55\"N", lon: "000°05'53.81\"W" })
    );
  });
  it("should show Cardinal", () => {
    expect(
      getDestinationPoint({
        point: { lat: 51.47788, lon: -0.00147 },
        distance: "7794m",
        bearing: 300.7,
        formatType: "Cardinal",
      })
    ).toEqual(expect.objectContaining({ lat: "51.5136°N", lon: "0.0981°W" }));
  });
  it("should show Decimal", () => {
    expect(
      getDestinationPoint({
        point: { lat: 51.47788, lon: -0.00147 },
        distance: "7794m",
        bearing: 300.7,
        formatType: "Decimal",
      })
    ).toEqual(expect.objectContaining({ lat: 51.5136, lon: -0.0981 }));
  });
});
