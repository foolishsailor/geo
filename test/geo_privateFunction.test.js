const geoRewire = require("rewire")("../src/index");
//private functions
const checkBearings = geoRewire.__get__("_checkBearings");
const testValues = require("./test_defaults");

describe("Test private functions", () => {
  describe("_checkbearings()", () => {
    it("Returns an array length 0 if valid bearings", () => {
      expect(checkBearings(testValues.testBearings).length).toEqual(0);
    });
    it("Returns array with bad bearings", () => {
      expect(checkBearings(testValues.badBearings).length).toEqual(5);
    });
    it("Returns bad bearings", () => {
      expect(checkBearings(testValues.badBearings)).toEqual(
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
});
