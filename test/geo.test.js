const geo = require("../src/index");
const geoRewire = require("rewire")("../src/index");
//private functions
const checkBearings = geoRewire.__get__("_checkBearings");

const testBearings = [330, 334, 350, 11, 12, 18];
const badBearings = [390, 334, -250, 11, "12", 18, "bob", null, 59, 67.84];

console.log("this", Number(41.34445).toDMS());
describe("Test private functions", () => {
  describe("_checkbearings", () => {
    it("Returns an array length 0 if valid bearings", () => {
      expect(checkBearings(testBearings).length).toEqual(0);
    });
    it("Returns array with bad bearings", () => {
      expect(checkBearings(badBearings).length).toEqual(5);
    });
    it("Returns bad bearings", () => {
      expect(checkBearings(badBearings)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: 0, value: 390 }),
          expect.objectContaining({ index: 2, value: -250 }),
          expect.objectContaining({ index: 4, value: "12" }),
          expect.objectContaining({ index: 6, value: "bob" }),
          expect.objectContaining({ index: 7, value: null }),
        ])
      );
    });
  });

  describe("Number extension: Rad, Deg, Bearing", () => {
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
      expect(Number(41.34445).toDMS()).toEqual("041°20'40");
    });
    it("toLat() | Converts decimal format GPS to LAT human readable DMS format", () => {
      expect(Number(-41.34445).toLat()).toEqual("041°20'40S");
    });
    it("toLon() | Converts decimal format GPS to LON human readable DMS format", () => {
      expect(Number(41.34445).toLat()).toEqual("041°20'40W");
    });
  });
});

describe("getAvgOfBearings()", () => {
  it("calculates avg bearing", () => {
    expect(geo.getAvgOfBearings(testBearings)).toMatchObject({
      degrees: 354.91,
      radians: -0.07130099291306147,
    });
  });
});
