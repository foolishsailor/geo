const { parseDMS } = require("../src/validateData/validation");
const {
  dmsParseErrorTest,
  dmsParseSuccessTest,
  dmsParseSuccessRandomTest,
  dmsParseFailRandomTest,
} = require("./test_defaults");

/**
 * parseDMS
 */

describe("parseDMS()", () => {
  describe("Succesfully parses", () => {
    dmsParseSuccessTest.forEach((item) => {
      it(`parseDMS() | Converts ${item.value}`, () => {
        expect(parseDMS(item.value)).toEqual(item.expected);
      });
    });
  });

  describe("Traps malformed data", () => {
    dmsParseErrorTest.forEach((item) => {
      it(`${item.value} || Throws error | ${item.error}`, () => {
        expect(() => {
          parseDMS(item.value);
        }).toThrow(new Error(item.error));
      });
    });
  });

  describe("Parse Simple Aray", () => {
    it("Returns array of processed data", () => {
      expect(parseDMS([34.231, 23.444, 87.234])).toEqual(
        expect.arrayContaining([34.231, 23.444, 87.234])
      );
    });
  });

  describe("Traps Errors in array of various types", () => {
    it("Returns array of processed data showing errors in original format", () => {
      expect(
        parseDMS(dmsParseFailRandomTest, { continueOnError: true })
      ).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            123,
            expect.objectContaining({ Error: "Position Out of Bounds" }),
            expect.objectContaining({ Error: "Position Out of Bounds" }),
            23.223,
            -12.5423139,
            expect.objectContaining({
              lat: 23.5830556,
              lon: {
                Error: "DMS seconds out of bounds",
              },
            }),
          ]),
          expect.objectContaining({
            lat: 83.6299722,
            lon: {
              Error: "DMS minutes out of bounds",
            },
          }),
          -53.13275,
          expect.arrayContaining([
            123,
            expect.objectContaining({ Error: "Position Out of Bounds" }),
            -12.5423139,
            expect.objectContaining({
              lat: {
                Error: "Latitude out of bounds",
              },
              lon: 114.3261111,
            }),
          ]),
        ])
      );
    });

    it("Throws Error", () => {
      expect(() => {
        parseDMS(dmsParseFailRandomTest, { continueOnError: false });
      }).toThrowError("Position Out of Bounds");
    });
  });

  describe("Parse Array of various types ", () => {
    it("Returns array of processed data in original format", () => {
      expect(
        parseDMS(dmsParseSuccessRandomTest, { continueOnError: true })
      ).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            123,
            23.223,
            -12.5423139,
            expect.objectContaining({ lat: 23.5830556, lon: 114.3261111 }),
          ]),
          expect.objectContaining({ lat: 83.6299722, lon: -53.7910833 }),
          -53.13275,
          expect.arrayContaining([
            123,
            -12.5423139,
            expect.objectContaining({ lat: 23.5830556, lon: 114.3261111 }),
          ]),
        ])
      );
    });

    it("returns array of processed data flattened", () => {
      expect(parseDMS(dmsParseSuccessRandomTest, { flatten: true })).toEqual(
        expect.arrayContaining([
          123,
          23.223,
          -12.5423139,
          23.5830556,
          114.3261111,
          83.6299722,
          -53.7910833,
          -53.13275,
          123,
          -12.5423139,
          23.5830556,
          114.3261111,
        ])
      );
    });
  });
});
