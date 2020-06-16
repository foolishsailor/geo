require("./prototypes");

const { geo_const } = require("./const");
const parseDMS = require("./parseDMS");
const bearings = require("./bearings");

module.exports = (() => {
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

  /*-------------------------------------------------------

    DISTANCE FUNCTIONS

  --------------------------------------------------------*/

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
    getPostionFromBearingAndDistance

    Calculate lat and lon point from existing point, bearing and distance.  Inputs in KM

    @param {object} arrs -
      @property {object} waypoint
      @property {number} distance in km
      @property {number} bearing

    @return {object}
      @property {number} lat - lat derived
      @property {number} lng - lon derived

  */

  const getPostionFromBearingAndDistance = (waypoint, distance, bearing) => {
    let position = {
      lat: waypoint.lat(),
      lng: waypoint.lng(),
    };

    dist = distance / geo_const.MEAN_RADIUS_IN_M / 1000;

    let brng = (Number(bearing) * Math.PI) / 180;
    let lat1 = position.lat;
    lat1 = (lat1 * Math.PI) / 180;
    let lon1 = position.lng;
    lon1 = (lon1 * Math.PI) / 180;

    let lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)
    );

    let lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
        Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2)
      );

    return {
      lat: (lat2 * 180) / Math.PI,
      lng: (lon2 * 180) / Math.PI,
    };
  };

  /**
    getIntersection

    Calculate intersection point between two lines/routes in lat and lon.  They are not required to overlap to calulate

   
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
  const getIntersection = ({ lineA, lineB }) => {
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
      : this.getDistanceCos(
          lineStart,
          currentPoint,
          geo_const.MEAN_RADIUS_IN_M
        ) / geo_const.MEAN_RADIUS_IN_M;

    let startToCurrent =
      this.getBearingBetweenTwoPoints(lineStart, currentPoint) *
      (Math.PI / 180);

    let startLineBearing =
      this.getBearingBetweenTwoPoints(lineStart, lineEnd) * (Math.PI / 180);

    let XTE = Math.asin(
      Math.sin(lineLength) * Math.sin(startToCurrent - startLineBearing)
    );

    return XTE * geo_const.MEAN_RADIUS_IN_M;
  }

  /*------------------------------------------

        AVERAGING and AGGREGATING FUNCTIONS

    -------------------------------------------*/

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
        if (isNaN(current) || current === null || current === "")
          return previous;
        return previous + Number(current);
      }, 0) / newArray.length;

    return { min, max, avg };
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

  /*-----------------------------------------------

    TIME FUNCTIONS

---------------------------------------------------*/

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

  /*-----------------------------------------------------------------

    LINE OR COURSE SMOOTHING ALGORYTHMS

  ------------------------------------------------------------------*/
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
    band_sqr =
      (kink * 360.0) / (2.0 * Math.PI * 6378137.0); /* Now in degrees */
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

  return {
    getAvgOfBearings: bearings.getAvgOfBearings,
    getBearingBetweenTwoPoints: bearings.getBearingBetweenTwoPoints,
    getBearingDiff: bearings.getBearingDiff,
    addHeading: bearings.addHeading,
    invertHDG: bearings.invertHDG,
    findMiddleAngle: bearings.findMiddleAngle,
    parseDMS: bearings.parseDMS,
    getBoundsOfData,
    getDistanceCos,
    getDistanceHaversine,
    getDistanceFromSpeedTime,
    getPostionFromBearingAndDistance,
    getIntersection,
    crossTrackDistanceTo,
    getMinMaxAvgFromArray,
    mercator,
    humanTime,
    GDP_smoother,
  };
})();
