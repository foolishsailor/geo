const bearings = require("../src/bearings");
const { defaults, bearingDiffSuccessTest } = require("./test_defaults");

describe("getAvgOfBearings()", () => {
  it("Calculates avg bearing", () => {
    expect(bearings.getAvgOfBearings(defaults.testBearings)).toMatchObject({
      degrees: 354.91,
      radians: -0.07130099291306147,
    });
  });

  it("Throws Error || 'Less than two bearings", () => {
    expect(() => {
      bearings.getAvgOfBearings([223]);
    }).toThrowError(
      new Error({
        error: "Invalid Bearings",
        message: "Less than two bearings",
      })
    );
  });

  it("Throws Error with array of bad data and indexes", () => {
    expect(() => {
      bearings.getAvgOfBearings(defaults.badBearings);
    }).toThrowError(
      new Error({
        error: "Invalid Bearings",
        message: expect.arrayContaining([
          expect.objectContaining({ index: 0, value: 390 }),
          expect.objectContaining({ index: 2, value: -250 }),
          expect.objectContaining({ index: 4, value: "12" }),
          expect.objectContaining({ index: 6, value: "bob" }),
          expect.objectContaining({ index: 7, value: null }),
        ]),
      })
    );
  });
});

describe("getBearingBetweenTwoPoints()", () => {
  it("Returns a bearing from decimal data", () => {
    expect(
      bearings.getBearingBetweenTwoPoints(defaults.origin, defaults.destination)
    ).toEqual(306);
  });

  it("Returns a bearing from DMS data", () => {
    expect(
      bearings.getBearingBetweenTwoPoints(
        { lat: "53°07'57.9\"N", lon: defaults.decimalLon },
        defaults.destination
      )
    ).toEqual(306);
  });

  it("Returns a bearing rounded to 4 decimals", () => {
    expect(
      bearings.getBearingBetweenTwoPoints(
        defaults.origin,
        defaults.destination,
        4
      )
    ).toEqual(305.7998);
  });

  it("Throws error 'Latitude out of bounds'", () => {
    expect(() => {
      bearings.getBearingBetweenTwoPoints(
        defaults.origin,
        defaults.pointSimple_outOfBoundsLat,
        4
      );
    }).toThrowError({
      error: "GPS Position Error",
      message: "Latitude out of bounds",
    });
  });

  it("Throws error 'Longitude out of bounds'", () => {
    expect(() => {
      bearings.getBearingBetweenTwoPoints(
        defaults.origin,
        defaults.pointSimple_outOfBoundsLon,
        4
      );
    }).toThrowError({
      error: "GPS Position Error",
      message: "Longitude out of bounds",
    });
  });
});

describe("getBearingDiff", () => {
  bearingDiffSuccessTest.forEach((item) => {
    it("Adds and normalizes two bearings that equal more than 360", () => {
      expect(bearings.getBearingDiff(...item.value)).toEqual(item.expected);
    });
  });

  it("Throws Error || Out of bounds", () => {
    expect(() => {
      bearings.getBearingDiff(360, 123);
    }).toThrowError({
      error: "Invalid Bearings",
      message: "Out of bounds",
    });
  });
});
