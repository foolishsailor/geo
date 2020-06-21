/**
      Get min, max, avg of a given property from array and filters out non numbers or bad data

      @param {object} arrs
        @property {array} array - Array of racedata objects to get min,max, avg from
        @property {object} dataSource - propery of racedata object to use as basis for reducing array

      @returns {object}
        @property {number} max
        @property {number} min
        @property {number} avg

    */
const getMinMaxAvgFromArray = (newArray) => {
  //strips out bad data
  let max = newArray.reduce(function (a, b) {
    if (isNaN(a) || a === null || a === "") a = -Infinity;
    if (isNaN(b) || b === null || b === "") b = -Infinity;
    return Math.max(a, b);
  }, -Infinity);

  let min = newArray.reduce(function (a, b) {
    if (isNaN(a) || a === null || a === "") a = Infinity;
    if (isNaN(b) || b === null || b === "") b = Infinity;
    return Math.min(a, b);
  }, Infinity);

  let avg =
    newArray.reduce(function (previous, current) {
      if (isNaN(current) || current === null || current === "") return previous;
      return previous + Number(current);
    }, 0) / newArray.length;

  return { min, max, avg };
};

/**
 * getBoundsOfData
 *
 * Takes an array of geoJSON objects and returns a boundary box containeing those values
 * @param {array} data array of geoJSON object
 * @param {object} geoJSON
 * @property {number} lat
 * @property {number} lon
 *
 * @returns {object} Return object has four cornes of bounds of data set
 * @property {latMin} latMin
 * @property {latMax} latMax
 * @property {lonMin}
 * @property {lonMax}
 */
const getBoundsOfData = (data) => {
  const boundsObject = data.reduce(
    function (a, c) {
      return {
        latMin: isNaN(a.latMin) || a.latMin > c.lat ? c.lat : a.latMin,
        latMax: isNaN(a.latMax) || a.latMax < c.lat ? c.lat : a.latMax,
        lngMin: isNaN(a.lngMin) || a.lngMin > c.lng ? c.lng : a.lngMin,
        lngMax: isNaN(a.lngMax) || a.lngMax < c.lng ? c.lng : a.lngMax,
      };
    },
    {
      latMin: Infinity,
      latMax: -Infinity,
      lngMin: Infinity,
      lngMax: -Infinity,
    }
  );
};

module.exports = { getMinMaxAvgFromArray, getBoundsOfData };
