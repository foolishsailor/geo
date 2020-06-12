const geo = require("../src/index");
const testValues = require("./test_defaults");

describe("getAvgOfBearings()", () => {
  it("calculates avg bearing", () => {
    expect(geo.getAvgOfBearings(testValues.testBearings)).toMatchObject({
      degrees: 354.91,
      radians: -0.07130099291306147,
    });
  });
});
