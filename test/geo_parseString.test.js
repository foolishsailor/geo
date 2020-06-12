const geo = require("../src/index");
const testValues = require("./test_defaults");

describe("String Extension successfuly Parses", () => {
  describe("Succesfully parses", () => {
    it("parseDMS() | Converts decimal to decimal", () => {
      expect(testValues.decimalLat.toString().parseDMS()).toEqual(
        testValues.decimalLat
      );
    });
    it("parseDMS() | Converts ' -53°07'57.9\" '  to decimal", () => {
      expect("-53°07'57.9\"".parseDMS()).toEqual(-53.13275);
    });
    it("parseDMS() | Converts ' 53°07'57.9\"W '  to decimal", () => {
      expect("53°07'57.9\"W".parseDMS()).toEqual(-53.13275);
    });
    it("parseDMS() | Converts ' 53°07'57.9\" W ' to decimal", () => {
      expect("53°07'57.9\" W".parseDMS()).toEqual(-53.13275);
    });
    it("parseDMS() | Converts ' 93 07 57.9  W ' to decimal", () => {
      expect("93 07 57.9 W".parseDMS()).toEqual(-93.13275);
    });
    it("parseDMS() | Converts ' -53 07 57.9 '   to decimal", () => {
      expect("-53 07 57.9 ".parseDMS()).toEqual(-53.13275);
    });
    it("parseDMS() | Converts ' W053 07 57.9 '  to decimal", () => {
      expect("W053 07 57.9 ".parseDMS()).toEqual(-53.13275);
    });
    it("parseDMS() | Converts ' W053 07  '      to decimal", () => {
      expect("W053 07 ".parseDMS()).toEqual(-53.1166667);
    });
  });

  describe("Traps malformed data", () => {
    it("parseDMS() | Returns NaN '53°67'47.9\" W' to decimal", () => {
      expect("53°67'47.9\"W".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN '53°47'67.9\" W' to decimal", () => {
      expect("53°47'67.9\"W".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN '53°367' to decimal", () => {
      expect("53°367".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN '93°67'47.9\" N' to decimal", () => {
      expect("93°67'47.9\"N".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN '993°67'47.9\" W' to decimal", () => {
      expect("993°67'47.9\"W".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN 'WTF°67'47.9\" W' to decimal", () => {
      expect("WTF°67'47.9\"W".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN '93°WTF'47.9\" W' to decimal", () => {
      expect("93°67'47.9\"W".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN '93°WTF'WTF\" W' to decimal", () => {
      expect("93°67'47.9\"W".parseDMS()).toEqual(NaN);
    });
    it("parseDMS() | Returns NaN 'xx°WTF'WTF\" W' to decimal", () => {
      expect("93°67'47.9\"W".parseDMS()).toEqual(NaN);
    });
  });
});
