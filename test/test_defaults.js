const defaults = {
  testBearings: [330, 334, 350, 11, 12, 18],
  badBearings: [390, 334, -250, 11, "12", 18, "bob", null, 59, 67.84],
  decimalLat: 53.132611,
  decimalLon: -6.092331,
  origin: { lat: 53.132611, lon: -6.092331 },
  destination: { lat: 32.715736, lon: -117.161087 },
  pointSimple_outOfBoundsLat: { lat: 193.132611, lon: -6.092331 },
  pointSimple_outOfBoundsLon: { lat: 63.132611, lon: -216.092331 },
};

const dmsParseErrorTest = [
  { value: "wts we tww", error: "Malformed Position Data" },
  { value: "53°67'47.9\"W", error: "DMS minutes out of bounds" },
  { value: "53°47'67.9\" W", error: "DMS seconds out of bounds" },
  { value: "53°367", error: "DMS minutes out of bounds" },

  { value: "83°67'47.9\" N", error: "DMS minutes out of bounds" },
  { value: "993°67'47.9\" W", error: "DMS degrees out of bounds" },
  { value: "WTF°67'47.9\" W", error: "Malformed Position Data" },
  { value: "93°WTF'47.9\" W", error: "Malformed Position Data" },
  { value: "93°WTF'WTF\" W", error: "Malformed Position Data" },
  { value: "xx°WTF'WTF\" W", error: "Malformed Position Data" },
];

const dmsParseSuccessTest = [
  { value: defaults.decimalLat, expected: defaults.decimalLat },
  { value: "-53°07'57.9\"", expected: -53.13275 },
  { value: "53°07'57.9\"W", expected: -53.13275 },
  { value: "53°07'57.9\" W", expected: -53.13275 },
  { value: "93 07 57.9 W", expected: -93.13275 },
  { value: "-53 07 57.9 ", expected: -53.13275 },
  { value: "W053 07 57.9 ", expected: -53.13275 },
  { value: "W053 07 ", expected: -53.1166667 },
];

const dmsParseMixedErrorSuccessTest = {};

const dmsParseFailRandomTest = [
  [
    123,
    435,
    555,
    23.223,
    "w12 32 32.33",
    { lat: "23 34' 59", lon: "114 19'84" },
  ],
  { lat: "83°37'47.9\" N", lon: "53°67'27.9\" W" },
  "-53 07 57.9 ",
  [123, 435, "w12 32 32.33", { lat: "93 34' 59", lon: "114 19'34" }],
];

const dmsParseSuccessRandomTest = [
  [123, 23.223, "w12 32 32.33", { lat: "23 34' 59", lon: "114 19'34" }],
  { lat: "83°37'47.9\" N", lon: "53°47'27.9\" W" },
  "-53 07 57.9 ",
  [113, 92.344, "w12 32 32.33", { lat: "23 34' 59", lon: "114 19'34" }],
];

const processPointDataErrorTest = [
  {
    value: defaults.pointSimple_outOfBoundsLat,
    error: "Latitude out of bounds",
  },

  {
    value: defaults.pointSimple_outOfBoundsLon,
    error: "Longitude out of bounds",
  },
  {
    value: { lat: "wts we tww", lon: defaults.decimalLon },
    error: "Malformed Position Data",
  },
];

const bearingDiffSuccessTest = [
  { value: [270, 30], expected: 120 },
  { value: [30, 270], expected: 120 },
  { value: [270, 90], expected: 180 },
];

module.exports = {
  defaults,
  dmsParseErrorTest,
  dmsParseSuccessTest,
  dmsParseSuccessRandomTest,
  dmsParseFailRandomTest,
  processPointDataErrorTest,
  bearingDiffSuccessTest,
};
