const {
  getIntersectionPoint,
  getDestinationPoint,
  mercator,
} = require("../src/position");

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

  it("should show Correct", () => {
    expect(
      getDestinationPoint({
        point: { lat: 50.06632, lon: -5.71475 },
        distance: "969954.166m",
        bearing: 9.1418775,
        formatType: "Decimal",
        surfaceType: "Ellipsoidal",
      })
    ).toEqual(expect.objectContaining({ lat: 58.644, lon: -3.0701 }));
  });
});
