const {
  validateBearings,
  processPointData,
} = require("../src/validateData/validation");
const { defaults, processPointDataErrorTest } = require("./test_defaults");

describe("Test validation functions", () => {
  /**
   * validateBearings
   */
  describe("validateBearings()", () => {
    it("Returns an array length 0 if valid bearings", () => {
      expect(validateBearings(defaults.testBearings).length).toEqual(0);
    });
    it("Returns array with bad bearings", () => {
      expect(validateBearings(defaults.badBearings).length).toEqual(5);
    });
    it("Returns bad bearings", () => {
      expect(validateBearings(defaults.badBearings)).toEqual(
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

  /**
   * processPointData
   */
  describe("processPointData()", () => {
    processPointDataErrorTest.forEach((item) => {
      it(`${item.value} || Throws error | ${item.error}`, () => {
        expect(() => {
          processPointData(item.value);
        }).toThrowError(new Error(item.error));
      });
    });

    it("Returns 2 Decimal Formateed items converted in Decimal Format", () => {
      expect(processPointData([defaults.origin, defaults.origin])).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ lat: 53.132611, lon: -6.092331 }),
          expect.objectContaining({ lat: 53.132611, lon: -6.092331 }),
        ])
      );
    });
  });
});
