(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["geo"] = factory();
	else
		root["geo"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/arrayUtils.js":
/*!***************************!*\
  !*** ./src/arrayUtils.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./src/bearings.js":
/*!*************************!*\
  !*** ./src/bearings.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const parseDMS = __webpack_require__(/*! ./parseDMS */ "./src/parseDMS/index.js");
__webpack_require__(/*! ./prototypes */ "./src/prototypes.js");

const handleError = (message) => {
  throw { error: "Invalid Bearings", message };
};

/**
 * Inspects array of bearings and returns array of items that are not valid bearing values.
 * If all values are valid then returns an array with length 0
 * @param {array} bearings
 * @param {bool} allowString - bool that determeins is a string that parses to a number is allowed.  Default - false
 *
 * @return {array} - If there are bad bearings then returns array of objects that containe the index and value
 *  @param {number} index - Index of bad item
 *  @param {!number} value - Any value that does not parse to a number
 */
const validateBearings = (bearings, allowString) => {
  let results = [];
  bearings.forEach(function (bearing, i) {
    if (isNaN(bearing) || bearing >= 360 || bearing < 0 || bearing === null)
      return results.push({
        index: i,
        value: bearing,
      });

    if (!allowString && typeof bearing === "string")
      results.push({
        index: i,
        value: bearing,
      });
  });

  return results;
};

module.exports = {
  /*------------------------------------------

        COMPASS HEADING AND ANGLE FUNCTIONS

    -------------------------------------------*/

  validateBearings,
  /**
   * getAvgOfBearings
   *
   * Return average of all elements in array normalized for compass bearings.
   * Numbers must be converted to radians and then compared
   *
   * @param {array} bearings - array of bearing values
   * @returns {object}
   * @param {number} degrees - the average of bearings in degrees
   * @param {number} radians - the average of bearings in radians -
   *
   * Legitimate values are between 0 and 360 - not inclusive of 360, i.e. 359.99999
   */
  getAvgOfBearings: (bearings) => {
    try {
      if (bearings.length < 2) throw handleError("Less than two bearings");

      //check for malformed data
      let checkBearings = validateBearings(bearings);
      if (checkBearings.length > 0) throw checkBearings;

      let values = bearings.reduce(
        function (a, c) {
          return {
            sinValue: (a.sinValue += Math.sin(c.toRad())),
            cosValue: (a.cosValue += Math.cos(c.toRad())),
          };
        },
        { sinValue: 0, cosValue: 0 }
      );

      let bearingInRad = Math.atan2(values.sinValue, values.cosValue);
      let bearingInDeg = bearingInRad.toDeg();

      if (bearingInDeg <= -1) bearingInDeg += 359;

      return {
        degrees: Math.abs(Math.round(bearingInDeg * 100) / 100),
        radians: bearingInRad,
      };
    } catch (err) {
      handleError(err);
    }
  },

  /**
    getBearingBetweenTwoPoints

    Calculate bearing between two positions

    @param {object} start - GPS position
      @param {number} start.lat
      @param {number} start.lon
    @param {object} end - GPS position
      @param {number} end.lat
      @param {number} end.lon
    @param {number} decimal - number decimal places, default 0
    @return {Number | Error} 

  */
  getBngTwoPoints: (start, end, decimal = 0) => {
    try {
      const [startClean, endClean] = parseDMS([start, end]);

      let startLat = startClean.lat.toRad();
      let endLat = endClean.lat.toRad();
      let lonDiff = (endClean.lon - startClean.lon).toRad();

      let y = Math.sin(lonDiff) * Math.cos(endLat);
      let x =
        Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(lonDiff);

      return ((Math.atan2(y, x).toDeg() + 360) % 360).toFixedNumber(decimal);
    } catch (err) {
      throw err;
    }
  },

  /**
    getBearingDiff

    Calculate normalized difference between two bearings.  This return the smallest arc of
    two possible as use case for this will always be the smaller of two arcs

    @param {number} bearing1
    @param {number} bearing2

    @return {number}

  */
  getBngDiff: (bearing1, bearing2) => {
    if (bearing1 >= 360 || bearing1 < 0 || bearing2 >= 360 || bearing2 < 0)
      handleError("Out of bounds");

    return Math.min(
      bearing1 - bearing2 < 0 ? bearing1 - bearing2 + 360 : bearing1 - bearing2,
      bearing2 - bearing1 < 0 ? bearing2 - bearing1 + 360 : bearing2 - bearing1
    );
  },

  /**
    addHeading

    Adds and normalizes two bearings

    @param {number} baseHdg
    @param {number} addDegrees

    @return {number} new bearing

  */
  addHDG: (baseHdg, addDegrees) => {
    hdg = baseHdg + addDegrees;
    if (hdg < 0) {
      hdg += 360;
    }
    if (hdg >= 360) {
      hdg -= 360;
    }

    return hdg;
  },

  /**
    invertHDG

    Inverts and normalizes heading

    @param {number} hdg
    @return {number} new bearing

  */
  invertHDG: (hdg) => {
    hdg += 180; //quadrant orientaion
    if (hdg < 0) {
      hdg += 360;
    }
    if (hdg >= 360) {
      hdg -= 360;
    }

    return hdg;
  },

  /**
    findMiddleAngle

    Calculates difference in two bearings and returns middle bearing between those two bearings
    Effectively finds the smaller of the two angles of a cricle and returns the middle angle

    @param {number} startAngle
    @param {number} endAngle

    @return {number} median bearing

  */
  getMiddleAngle: (startAngle, endAngle) => {
    startAngle = Math.round(startAngle);
    endAngle = Math.round(endAngle);

    let bearingdiff = this.getBearingDiff(startAngle, endAngle);

    if (this.addHeading(startAngle, bearingdiff) == endAngle) {
      return this.addHeading(startAngle, bearingdiff / 2);
    } else {
      return this.addHeading(startAngle, (bearingdiff * -1) / 2);
    }
  },
};


/***/ }),

/***/ "./src/const.js":
/*!**********************!*\
  !*** ./src/const.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  KM_TO_NM: 0.539957,
  NM_TO_KM: 1.852,
  HOUR: 3600,
  KM_IN_DEG: 111.12,
  NM_IN_DEG: 60,
  NM_TO_FEET: 6076,
  KM_TO_FEET: 3280.84,
  RADIUS_IN_M: 6378137, //radius earth at equator
  MEAN_RADIUS_IN_M: 6371000, //earth mean radius
};


/***/ }),

/***/ "./src/distance.js":
/*!*************************!*\
  !*** ./src/distance.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
    getDistanceCos

    Calculate distance between two points in km.  This method generates more accurate distance for points close together
    like within a tunr or on a race course

    @param {object} from - GPS position
      @property {number} lat
      @property {number} lon
    @param {object} to - GPS position
      @property {number} lat
      @property {number} lon
    @return {Number} - km [default]

  */
const getDistanceCos = (from, to, radius) => {
  let R = radius || geo_const.MEAN_RADIUS_IN_M / 1000; //default to earth radius in km

  let d =
    Math.acos(
      Math.sin((from.lat * Math.PI) / 180) *
        Math.sin((to.lat * Math.PI) / 180) +
        Math.cos((from.lat * Math.PI) / 180) *
          Math.cos((to.lat * Math.PI) / 180) *
          Math.cos(((to.lon - from.lon) * Math.PI) / 180)
    ) * R;
  return d;
};

/**
    getDistanceHaversine

    Calculate distance between two points.  This method generates more accurate distance for points farther apart
    and incorporates the curve of the earth as part of the equation

    @param {object} from - GPS position
      @property {number} lat
      @property {number} lon
    @param {object} to - GPS position
      @property {number} lat
      @property {number} lon
    @return {Number}

  */
const getDistanceHaversine = (from, to) => {
  let R = geo_const.MEAN_RADIUS_IN_M / 1000; // earth's mean radius in km
  let dLat = ((to.lat - from.lat) * Math.PI) / 180;
  let dLon = ((to.lon - from.lon) * Math.PI) / 180;
  from.lat = (from.lat * Math.PI) / 180;
  to.lat = (to.lat * Math.PI) / 180;

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat) *
      Math.cos(to.lat) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

/**
 * getDistanceFromSpeedTime
 *
 * Calculate distance from speed (in kM/hour) and Time (seconds)
 *
 * @param {number} speed - speed in kM/hr
 * @param {number} time - time in Seconds
 * @return {object}
 *      @property {number} distInDegree
 *      @property {number} distInFeet
 *      @property {number} distInKilometers
 *
 * */

const getDistanceFromSpeedTime = (speed, time) => {
  return {
    distInDegree: (speed * (time / geo_const.HOUR)) / geo_const.KM_IN_DEG,
    distInFeet: speed * (time / geo_const.HOUR) * geo_const.KM_TO_FEET,
    distInKilometers: speed * (time / geo_const.HOUR),
    distInNM: speed * (time / geo_const.HOUR) * geo_const.KM_TO_NM,
  };
};

/**
   * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point.
   *
   * @param   {object} lineStart - Start point of great circle path.
       @param {number} lat
       @param {number} lon
   * @param   {object} lineEnd - End point of great circle path.
       @param {number} lat
       @param {number} lon
     @param   {object} currentPoint -current location
         @param {number} lat
         @param {number} lon
   * @param   {bool} haversine - use haversine versus cosine calculation.  Cos is best for smalelr distances 
   * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
   *    *    
   */
function crossTrackDistanceTo({
  lineStart,
  lineEnd,
  currentPoint,
  haversine = false,
}) {
  let lineLength = haversine
    ? this.getDistanceHaversine(
        lineStart,
        currentPoint,
        geo_const.MEAN_RADIUS_IN_M
      ) / geo_const.MEAN_RADIUS_IN_M
    : this.getDistanceCos(lineStart, currentPoint, geo_const.MEAN_RADIUS_IN_M) /
      geo_const.MEAN_RADIUS_IN_M;

  let startToCurrent =
    this.getBearingBetweenTwoPoints(lineStart, currentPoint) * (Math.PI / 180);

  let startLineBearing =
    this.getBearingBetweenTwoPoints(lineStart, lineEnd) * (Math.PI / 180);

  let XTE = Math.asin(
    Math.sin(lineLength) * Math.sin(startToCurrent - startLineBearing)
  );

  return XTE * geo_const.MEAN_RADIUS_IN_M;
}

module.exports = {
  getDistanceCos,
  getDistanceHaversine,
  getDistanceFromSpeedTime,
  crossTrackDistanceTo,
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const parseDMS = __webpack_require__(/*! ./parseDMS/index */ "./src/parseDMS/index.js");
const {
  getAvgOfBearings,
  getBearingBetweenTwoPoints,
  getBearingDiff,
  addHeading,
  invertHDG,
  findMiddleAngle,
} = __webpack_require__(/*! ./bearings */ "./src/bearings.js");
const { getBoundsOfData, getMinMaxAvgFromArray } = __webpack_require__(/*! ./arrayUtils */ "./src/arrayUtils.js");
const {
  getDistanceCos,
  getDistanceHaversine,
  getDistanceFromSpeedTime,
  crossTrackDistanceTo,
} = __webpack_require__(/*! ./distance */ "./src/distance.js");
const { getIntersectionPoint, getPosBngDist, mercator } = __webpack_require__(/*! ./position */ "./src/position.js");
const { humanTime } = __webpack_require__(/*! ./time */ "./src/time.js");
const { GDP_smoother } = __webpack_require__(/*! ./smoothing */ "./src/smoothing.js");

module.exports = (() => {
  return {
    getAvgOfBearings,
    getBearingBetweenTwoPoints,
    getBearingDiff,
    addHeading,
    invertHDG,
    findMiddleAngle,
    parseDMS,
    getBoundsOfData,
    getMinMaxAvgFromArray,
    getDistanceCos,
    getDistanceHaversine,
    getDistanceFromSpeedTime,
    crossTrackDistanceTo,
    getIntersectionPoint,
    getPosBngDist,
    mercator,
    humanTime,
    GDP_smoother,
  };
})();


/***/ }),

/***/ "./src/parseDMS/components/processDMS.js":
/*!***********************************************!*\
  !*** ./src/parseDMS/components/processDMS.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const validateDMSstring = __webpack_require__(/*! ./validateDMSString */ "./src/parseDMS/components/validateDMSString.js");
const processDMSstring = __webpack_require__(/*! ./processDMSstring */ "./src/parseDMS/components/processDMSstring.js");

const processDMS = (position, options) => {
  try {
    //Check for any illegal characters
    if (/[^0-9.,NSEW\-\s\u00B0\'\"]/i.test(position))
      throw "Malformed Position Data";

    //Check position is already a decimal and less than max longitude
    if (
      !isNaN(parseFloat(position)) &&
      isFinite(position) &&
      Math.abs(position)
    ) {
      if (Math.abs(position) > 180) throw "Position Out of Bounds";
      return Number(position);
    }

    let deg,
      dms = position
        .replace(/^-/, "")
        .replace(/[NSEW]/i, "") // strip off any sign or compass dir'n
        .split(/[^0-9.,]+/); // split out separate d/m/s

    //If find '' anywhere but at end of array then malformed data exists so throw error
    dms.forEach((e, i) => {
      if (e == "") {
        if (i < dms.length - 1) {
          throw "Malformed Position Data";
        }
        dms.splice(i, 1);
      }
    });

    validateDMSstring(position, dms);
    deg = processDMSstring(dms);

    if (/^-/.test(position) || /[WS]/i.test(position)) deg = -deg; // take '-', west and south as -ve
    return deg.toFixedNumber(7);
  } catch (err) {
    if (options.continueOnError) return { error: err };
    throw err;
  }
};

module.exports = processDMS;


/***/ }),

/***/ "./src/parseDMS/components/processDMSstring.js":
/*!*****************************************************!*\
  !*** ./src/parseDMS/components/processDMSstring.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

const processDMSstring = (dms) => {
  let deg;
  switch (
    dms.length // convert to decimal degrees...
  ) {
    case 3: // interpret 3-part result as d/m/s
      deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
      break;
    case 2: // interpret 2-part result as d/m
      deg = dms[0] / 1 + dms[1] / 60;
      break;
    case 1: // decimal or non-separated dddmmss
      deg =
        dms[0].slice(0, 3) / 1 +
        dms[0].slice(3, 5) / 60 +
        dms[0].slice(5) / 3600;
      break;
    default:
      throw "Malformed Position Data";
  }

  return deg;
};

module.exports = processDMSstring;


/***/ }),

/***/ "./src/parseDMS/components/processPointObject.js":
/*!*******************************************************!*\
  !*** ./src/parseDMS/components/processPointObject.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

const isValidGeoObject = (point) => {
  return point.hasOwnProperty("lat") && point.hasOwnProperty("lon")
    ? true
    : false;
};

const processPointObject = (data, options, func) => {
  if (isValidGeoObject) {
    const lat =
      Math.abs(parseFloat(data.lat)) > 90
        ? {
            error: "Latitude out of bounds",
          }
        : func(data.lat, options);
    const lon =
      Math.abs(parseFloat(data.lon)) > 180
        ? {
            error: "Longitude out of bounds",
          }
        : func(data.lon, options);

    if (!options.continueOnError) {
      if (lat.error) throw lat.error;
      if (lon.error) throw lon.error;
    }
    return options.flatten ? [lat, lon] : { lat, lon };
  } else {
    return options.flatten
      ? Object.keys(data).map((item) => func(data[item], options))
      : Object.keys(data).reduce((obj, item) => {
          obj[item] = func(data[item], options);
          return obj;
        }, {});
  }
};

module.exports = processPointObject;


/***/ }),

/***/ "./src/parseDMS/components/validateDMSString.js":
/*!******************************************************!*\
  !*** ./src/parseDMS/components/validateDMSString.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * validateDMSstring
 *
 * Checks parsed DMS array for any element out of bounds.  Uses regex
 * on original string to look for NS to see if item is Lat or Lon
 *
 * @param {string} dmsString - Original string position
 * @param {array} dmsArray - Array of parsed string into elements [Degrees, Minutes, Seconds]
 *  @return {null | Error } returns error if item out of bounds or malformed
 */
const validateDMSstring = (dmsString, dmsArray) => {
  //check deg boundaries
  if (Math.abs(dmsArray[0]) > 180) throw "DMS degrees out of bounds";

  if (/[NS]/i.test(dmsString) && Math.abs(dmsArray[0]) > 90)
    throw "DMS degrees out of bounds";

  switch (
    dmsArray.length // convert to decimal degrees...
  ) {
    case 3: // interpret 3-part result as d/m/s
      if (dmsArray[1] > 60) throw "DMS minutes out of bounds";

      if (dmsArray[2] > 60) throw "DMS seconds out of bounds";

    case 2: // interpret 2-part result as d/m
      if (dmsArray[1] > 60) throw "DMS minutes out of bounds";

    default:
      return;
  }
};

module.exports = validateDMSstring;


/***/ }),

/***/ "./src/parseDMS/index.js":
/*!*******************************!*\
  !*** ./src/parseDMS/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * parseDMS
 *
 * Versitle parsing of human readable GPS data into decimal format.  Handles a wide
 * variety of data entry to allow users flexibility in doing data entry.
 *
 * It can also handle deeply nested diverse data formats and return the information formated
 * into existing structure or flattened.
 *
 * Options include ability to throw error when malformed data encountered to enable use as a validation
 * on forms or to return all malfored data in seperate array to allow parsing of large data sets.
 *
 * Adapted and built from Chris Veness original script
 *  * http://www.movable-type.co.uk/scripts/latlong.htmlarses
 *
 *
 */

const processPointObject = __webpack_require__(/*! ./components/processPointObject */ "./src/parseDMS/components/processPointObject.js");
const processDMS = __webpack_require__(/*! ./components/processDMS */ "./src/parseDMS/components/processDMS.js");
__webpack_require__(/*! ../prototypes */ "./src/prototypes.js");

/**
 *  parseDMS - main parsing function
 * @param {String | Array | Object} data
 *  @param {String | Number} data.lat
 *  @param {String | Number} data.lon
 *`@param {Object} [options] -    option flags for processing data
 *  @param {bool} [strict=true] - Disallow any chars not part of normal DMS
 *  @param {bool} [flatten=false] - Keep input strcture or flatten to single array
 *  @param {bool} [returnMalformed=false] - Return second array of malformed items and their original indeox
 *  @param {bool} [keepError=false] - Keep malformed elements inSitu otherwise shows error.
 *  @param {bool} [continueOnError=false] - throw error if malformed data based on strict options settings is found
 *                                          if set to true then return error object in istu:  {"Error": err title}
 *
 */

const parseDMS = (data, options = {}) => {
  if (data == null) return null;
  //Check if string
  if (typeof data === "string" || typeof data === "number")
    return processDMS(data, options);

  //Check if Array and recursively process
  if (Array.isArray(data))
    return options.flatten
      ? data.reduce((a, c) => a.concat(parseDMS(c, options)), [])
      : data.map((item) => parseDMS(item, options));

  //Check if object with lat lon
  if (typeof data === "object") {
    return processPointObject(data, options, parseDMS);
  }

  throw {
    error: "Malformed Position Data",
    message: "Malformed Data",
  };
};

module.exports = parseDMS;


/***/ }),

/***/ "./src/position.js":
/*!*************************!*\
  !*** ./src/position.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./prototypes */ "./src/prototypes.js");
const geo_const = __webpack_require__(/*! ./const */ "./src/const.js");

/**
 * getPositionFromBearingAndDistance
 *
 * Use origin point, bearing and distance moved to calculate new position
 * @param {object} point - origin point
 *  @param {number} point.lat
 *  @param {number} point.lon
 * @param {number} distance - distance travelled
 * @param {number} bearing - direction travelled
 *
 * @return {object}
 *  @param {number} lat
 *  @param {number} lon
 */
const getPosBngDist = (point, distance, bearing) => {
  const dist = distance / geo_const.MEAN_RADIUS_IN_M;
  const brng = Number(bearing).toRad();

  const lat1 = point.lat.toRad(),
    lon1 = point.lon.toRad();

  const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)
    ),
    lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
        Math.cos(dist) -
          Math.sin(lat1) * Math.sin(lat1) * Math.cos(dist) +
          Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)
      );

  return {
    lat: lat2.toDeg(),
    lon: lon2.toDeg(),
  };
};

/**
    getIntersectionPoint

    Calculate intersection point between two lines/routes in lat and lon.  They are not required to overlap to calculate
   
      @property {object} lineA
        @property {number} lat
        @property {number} lon

      @property {object} lineB
        @property {number} lat
        @property {number} lon


    @return {object}
      @property {number} lat
      @property {number} lon

  */
const getIntersectionPoint = ({ lineA, lineB }) => {
  let XAsum = lineA.start.lon - lineA.end.lon;
  let XBsum = lineB.start.lon - lineB.end.lon;
  let YAsum = lineA.start.lat - lineA.end.lat;
  let YBsum = lineB.start.lat - lineB.end.lat;

  let lineDenominator = XAsum * YBsum - YAsum * XBsum;
  if (lineDenominator == 0.0) return false;

  let a =
    lineA.start.lon * lineA.end.lat - arrs.lineA.start.lat * lineA.end.lon;
  let b = lineB.start.lon * lineB.end.lat - lineB.start.lat * lineB.end.lon;

  let lat = (a * YBsum - b * YAsum) / lineDenominator;
  let lon = (a * XBsum - b * XAsum) / lineDenominator;

  return { lat, lon };
};

/**
 * Convert lat/lon to mercator projection points
 */
const mercator = ({ latitude, longitude }) => {
  const MAX = 85.0511287798;
  const RADIANS = Math.PI / 180;
  let point = {};

  point.lon = geo_const.RADIUS_IN_M * longitude * RADIANS;
  point.lat = Math.max(Math.min(MAX, latitude), -MAX) * RADIANS;
  point.lat =
    geo_const.RADIUS_IN_M * Math.log(Math.tan(Math.PI / 4 + point.lat / 2));

  return point;
};

module.exports = {
  getIntersectionPoint,
  getPosBngDist,
  mercator,
};


/***/ }),

/***/ "./src/prototypes.js":
/*!***************************!*\
  !*** ./src/prototypes.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const parseDMS = __webpack_require__(/*! ./parseDMS */ "./src/parseDMS/index.js");

Number.prototype.toFixedNumber = function (digits, base) {
  var pow = Math.pow(base || 10, digits);
  return Math.round(this * pow) / pow;
};

// convert degrees to radians
Number.prototype.toRad = function () {
  return (this * Math.PI) / 180;
};

// convert radians to degrees (signed)
Number.prototype.toDeg = function () {
  return (this * 180) / Math.PI;
};

// convert radians to degrees (as bearing: 0...359)
Number.prototype.toBNG = function () {
  return (this.toDeg() + 360) % 360;
};

// convert numeric degrees to human readable deg/min/sec - i.e. 41.34445 = 041°20'40"
Number.prototype.toDMS = function () {
  let decimal = Math.abs(this);
  decimal += 1 / 7200; // add to second for rounding
  let deg = Math.floor(decimal);
  let min = Math.floor((decimal - deg) * 60);
  let sec = Number(((decimal - deg - min / 60) * 3600).toFixed(2));

  // add leading zeros if required
  if (deg < 100) deg = "0" + deg;
  if (deg < 10) deg = "0" + deg;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return `${deg}\u00B0${min}\u0027${sec}\u0022`;
};

Number.prototype.toLat = function () {
  // convert numeric degrees to deg/min/sec latitude
  return this.toDMS().slice(1) + (this < 0 ? "S" : "N"); // knock off initial '0' for lat
};

Number.prototype.toLon = function () {
  // convert numeric degrees to deg/min/sec longitude
  return this.toDMS() + (this > 0 ? "E" : "W");
};

/**
 * Parses human readable DMS string into Decimal format
 *
 * See: /validation/parseDMS for attribution nad info *
 */

String.prototype.parseDMS = function () {
  return parseDMS(this);
};


/***/ }),

/***/ "./src/smoothing.js":
/*!**************************!*\
  !*** ./src/smoothing.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
  GDouglasPeucker
  Stack-based Douglas Peucker line simplification routine
   returned is a reduced google.maps.LatLng array
   After code by  Dr. Gary J. Robinson,
   Environmental Systems Science Centre,
   University of Reading, Reading, UK

   @param {array} source Input coordinates
   @param {number} kink in metres, kinks above this depth kept.  Kink depth is the height of the triangle abc where a-b and b-c are two consecutive line segments

*/

function GDP_smoother(source, kink) {
  let n_source, n_stack, n_dest, start, end, i, sig;
  let dev_sqr, max_dev_sqr, band_sqr;
  let x12, y12, d12, x13, y13, d13, x23, y23, d23;
  let F = (Math.PI / 180.0) * 0.5;
  let index = new Array(); /* aray of indexes of source points to include in the reduced line */
  let sig_start = new Array(); /* indices of start & end of working section */
  let sig_end = new Array();

  /* check for simple cases */

  if (source.length < 3) return source; /* one or two points */

  /* more complex case. initialize stack */

  n_source = source.length;
  band_sqr = (kink * 360.0) / (2.0 * Math.PI * 6378137.0); /* Now in degrees */
  band_sqr *= band_sqr;
  n_dest = 0;
  sig_start[0] = 0;
  sig_end[0] = n_source - 1;
  n_stack = 1;

  /* while the stack is not empty  ... */
  while (n_stack > 0) {
    /* ... pop the top-most entries off the stacks */

    start = sig_start[n_stack - 1];
    end = sig_end[n_stack - 1];
    n_stack--;

    if (end - start > 1) {
      /* any intermediate points ? */

      /* ... yes, so find most deviant intermediate point to
                     either side of line joining start & end points */

      x12 = source[end].lon - source[start].lon;
      y12 = source[end].lat - source[start].lat;
      if (Math.abs(x12) > 180.0) x12 = 360.0 - Math.abs(x12);
      x12 *= Math.cos(
        F * (source[end].lat + source[start].lat)
      ); /* use avg lat to reduce lon */
      d12 = x12 * x12 + y12 * y12;

      for (i = start + 1, sig = start, max_dev_sqr = -1.0; i < end; i++) {
        x13 = source[i].lon - source[start].lon;
        y13 = source[i].lat - source[start].lat;
        if (Math.abs(x13) > 180.0) x13 = 360.0 - Math.abs(x13);
        x13 *= Math.cos(F * (source[i].lat + source[start].lat));
        d13 = x13 * x13 + y13 * y13;

        x23 = source[i].lon - source[end].lon;
        y23 = source[i].lat - source[end].lat;
        if (Math.abs(x23) > 180.0) x23 = 360.0 - Math.abs(x23);
        x23 *= Math.cos(F * (source[i].lat + source[end].lat));
        d23 = x23 * x23 + y23 * y23;

        if (d13 >= d12 + d23) dev_sqr = d23;
        else if (d23 >= d12 + d13) dev_sqr = d13;
        else
          dev_sqr = ((x13 * y12 - y13 * x12) * (x13 * y12 - y13 * x12)) / d12; // solve triangle

        if (dev_sqr > max_dev_sqr) {
          sig = i;
          max_dev_sqr = dev_sqr;
        }
      }

      if (max_dev_sqr < band_sqr) {
        /* is there a sig. intermediate point ? */
        /* ... no, so transfer current start point */
        index[n_dest] = start;
        n_dest++;
      } else {
        /* ... yes, so push two sub-sections on stack for further processing */
        n_stack++;
        sig_start[n_stack - 1] = sig;
        sig_end[n_stack - 1] = end;
        n_stack++;
        sig_start[n_stack - 1] = start;
        sig_end[n_stack - 1] = sig;
      }
    } else {
      /* ... no intermediate points, so transfer current start point */
      index[n_dest] = start;
      n_dest++;
    }
  }

  /* transfer last point */
  index[n_dest] = n_source - 1;
  n_dest++;

  /* make return array */
  let r = new Array();
  for (let i = 0; i < n_dest; i++) r.push(source[index[i]]);

  return r;
}

module.exports = { GDP_smoother };


/***/ }),

/***/ "./src/time.js":
/*!*********************!*\
  !*** ./src/time.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * humanTime
 *
 * Produce human readable time from milliseconds.  Automatically hide/add mins secs days etc
 *
 */
const humanTime = (millisec) => {
  let seconds = (millisec / 1000).toFixed(0);
  let minutes = Math.floor(seconds / 60);
  let hours = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = hours >= 10 ? hours : "0" + hours;
    minutes = minutes - hours * 60;
    minutes = minutes >= 10 ? minutes : "0" + minutes;
  }

  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  if (hours != "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
};

module.exports = { humanTime };


/***/ })

/******/ });
});
//# sourceMappingURL=geo.js.map