const geo = require("../src/index");
const testValues = require("./test_defaults");

describe("Number extension", () => {
  it("toRad() | Converts degrees to radians", () => {
    expect(Number(325).toRad()).toEqual(5.672320068981571);
  });
  it("toDeg() | Converts radians to degrees", () => {
    expect(Number(5.672320068981571).toDeg()).toEqual(325);
  });
  it("toBNG() | Converts radians to bearing", () => {
    expect(Number(6.283185307179586).toBNG()).toEqual(0);
  });
  it("toDMS() | Converts decimal format GPS to human readable DMS format", () => {
    expect(testValues.decimalLat.toDMS()).toEqual("053°07'57.9\"");
  });
  it("toLat() | Converts decimal format GPS to LAT human readable DMS format", () => {
    expect(testValues.decimalLat.toLat()).toEqual("53°07'57.9\"N");
  });
  it("toLon() | Converts decimal format GPS to LON human readable DMS format", () => {
    expect(testValues.decimalLon.toLon()).toEqual("006°05'32.89\"W");
  });
});
