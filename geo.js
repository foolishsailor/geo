var geo = (function() {
  //constants
  var KM_TO_NM = 0.539957,
    NM_TO_KM = 1.852,
    HOUR = 3600,
    KM_IN_DEG = 111.12,
    NM_IN_DEG = 60,
    NM_TO_FEET = 6076,
    KM_TO_FEET = 3280.84,
    RADIUS_IN_M = 6378137, //radius earth at equator
    MEAN_RADIUS_IM_M = 6371000; //earth mean radius

  /**
   * Inspects array of bearings and returns array of items that are not valid bearing values.
   * If all values are valid then returns an array with length 0
   * @param {array} bearings
   */
  function _checkBearings(bearings) {
    var results = [];
    bearings.forEach(function(bearing, i) {
      if (isNaN(bearing) || bearing >= 360 || bearing < 0)
        results.push({
          index: i,
          value: bearing
        });
    });

    return results;
  }

  // extend Number object with methods for converting degrees/radians

  Number.prototype.toRad = function() {
    // convert degrees to radians
    return (this * Math.PI) / 180;
  };

  Number.prototype.toDeg = function() {
    // convert radians to degrees (signed)
    return (this * 180) / Math.PI;
  };

  Number.prototype.toBrng = function() {
    // convert radians to degrees (as bearing: 0...360)
    return (this.toDeg() + 360) % 360;
  };

  Number.prototype.toDMS = function() {  // convert numeric degrees to deg/min/sec
    var d = Math.abs(this);  // (unsigned result ready for appending compass dir'n)
    d += 1/7200;  // add B= second for rounding
    var deg = Math.floor(d);
    var min = Math.floor((d-deg)*60);
    var sec = Math.floor((d-deg-min/60)*3600);
    // add leading zeros if required
    if (deg<100) deg = '0' + deg; if (deg<10) deg = '0' + deg;
    if (min<10) min = '0' + min;
    if (sec<10) sec = '0' + sec;
    return deg + '\u00B0' + min + '\u2032' + sec + '\u2033';
  }
  
  Number.prototype.toLat = function() {  // convert numeric degrees to deg/min/sec latitude
    return this.toDMS().slice(1) + (this<0 ? 'S' : 'N');  // knock off initial '0' for lat!
  }
  
  Number.prototype.toLon = function() {  // convert numeric degrees to deg/min/sec longitude
    return this.toDMS() + (this>0 ? 'E' : 'W');
  }
  
  Number.prototype.toPrecision = function(fig) {  // override toPrecision method with one which displays
    if (this == 0) return 0;                      // trailing zeros in place of exponential notation
    var scale = Math.ceil(Math.log(this)*Math.LOG10E);
    var mult = Math.pow(10, fig-scale);
    return Math.round(this*mult)/mult;
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// extend String object with method for parsing degrees or lat/long values to numeric degrees
//
// this is very flexible on formats, allowing signed decimal degrees, or deg-min-sec suffixed by
// compass direction (NSEW). A variety of separators are accepted (eg 3B: 37' 09"W) or fixed-width
// format without separators (eg 0033709W). Seconds and minutes may be omitted. (Minimal validation
// is done).

String.prototype.parseDeg = function() {
    if (!isNaN(this)) return Number(this);                 // signed decimal degrees without NSEW
  
    var degLL = this.replace(/^-/,'').replace(/[NSEW]/i,'');  // strip off any sign or compass dir'n
    var dms = degLL.split(/[^0-9.,]+/);                     // split out separate d/m/s
    for (var i in dms) if (dms[i]=='') dms.splice(i,1);    // remove empty elements (see note below)
    switch (dms.length) {                                  // convert to decimal degrees...
      case 3:                                              // interpret 3-part result as d/m/s
        var deg = dms[0]/1 + dms[1]/60 + dms[2]/3600; break;
      case 2:                                              // interpret 2-part result as d/m
        var deg = dms[0]/1 + dms[1]/60; break;
      case 1:                                              // decimal or non-separated dddmmss
        if (/[NS]/i.test(this)) degLL = '0' + degLL;       // - normalise N/S to 3-digit degrees
        var deg = dms[0].slice(0,3)/1 + dms[0].slice(3,5)/60 + dms[0].slice(5)/3600; break;
      default: return NaN;
    }
    if (/^-/.test(this) || /[WS]/i.test(this)) deg = -deg; // take '-', west and south as -ve
    return deg;
  }
  // note: whitespace at start/end will split() into empty elements (except in IE)
  

  /*--------------------------------------------------------------------------

        PUBLIC FUNCTIONS

    ---------------------------------------------------------------------------*/

  /*------------------------------------------

        COMPASS HEADING AND ANGLE FUNCTIONS

    -------------------------------------------*/

  /**
   * getAvgOfBearings
   *
   * Return average of all elements in array normalized for compass bearings.
   * Numbers must be converted to radians and then compared
   *
   * @param {array} bearings - array of bearing values
   * @returns {object}
   * @property {number} degrees - the average of bearings in degrees
   * @property {number} radians - the average of bearings in radians -
   *
   * Legitimate values are between 0 and 360 - not inclusive of 360, i.e. 359.99999
   */
  function getAvgOfBearings(bearings) {
    if (bearings.length < 2) return { error: "Less than two bearings" };

    var checkBearings = _checkBearings(bearings);
    if (checkBearings.length > 0)
      return { error: "Invalid Bearings", values: checkBearings };

    var values = bearings.reduce(
      function(a, c) {
        return {
          sinValue: (a.sinValue += Math.sin((c * Math.PI) / 180)),
          cosValue: (a.cosValue += Math.cos((c * Math.PI) / 180))
        };
      },
      { sinValue: 0, cosValue: 0 }
    );

    var bearingInRad = Math.atan2(values.sinValue, values.cosValue);
    var bearingInDeg = (bearingInRad * 180) / Math.PI;

    if (bearingInDeg <= -1) bearingInDeg += 359;

    return {
      degrees: Math.abs(Math.round(bearingInDeg * 100) / 100),
      radians: bearingInRad
    };
  }

  /**
    getBearingBetweenTwoPoints

    Calculate bearing between two positions

    @param {object} position1 - GPS position
      @property {number} lat
      @property {number} lon
    @param {object} position2 - GPS position
      @property {number} lat
      @property {number} lon
    @return {Number}

  */
  function getBearingBetweenTwoPoints(position1, position2) {
    var pos1Lat = (position1.lat * Math.PI) / 180;
    var pos2Lat = (position2.lat * Math.PI) / 180;
    var dLon = ((position2.lon - position1.lon) * Math.PI) / 180;

    var y = Math.sin(dLon) * Math.cos(pos2Lat);
    var x =
      Math.cos(pos1Lat) * Math.sin(pos2Lat) -
      Math.sin(pos1Lat) * Math.cos(pos2Lat) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  /**
    getBearingDiff

    Calculate normalized difference between two bearings

    @param {number} bearing1
    @param {number} bearing2

    @return {number}

  */
  function getBearingDiff(bearing1, bearing2) {
    return Math.min(
      bearing1 - bearing2 < 0 ? bearing1 - bearing2 + 360 : bearing1 - bearing2,
      bearing2 - bearing1 < 0 ? bearing2 - bearing1 + 360 : bearing2 - bearing1
    );
  }

  /**
    addHeading

    Adds and normalizes two bearings

    @param {number} baseHdg
    @param {number} addDegrees

    @return {number} new bearing

  */
  function addHeading(baseHdg, addDegrees) {
    hdg = baseHdg + addDegrees;
    if (hdg < 0) {
      hdg += 360;
    }
    if (hdg >= 360) {
      hdg -= 360;
    }

    return hdg;
  }

  /**
    invertHDG

    Inverts and normalizes heading

    @param {number} hdg
    @return {number} new bearing

  */
  function invertHDG(hdg) {
    hdg += 180; //quadrant orientaion
    if (hdg < 0) {
      hdg += 360;
    }
    if (hdg >= 360) {
      hdg -= 360;
    }

    return hdg;
  }

  /**
    findMiddleAngle

    Calculates difference in two bearings and returns median bearing between those two bearings
    Effectively finds the smaller of the two angles of a cricle and returns the mdedian angle

    @param {number} startAngle
    @param {number} endAngle

    @return {number} median bearing

  */
  function findMiddleAngle(startAngle, endAngle) {
    startAngle = Math.round(startAngle);
    endAngle = Math.round(endAngle);

    var bearingdiff = this.getBearingDiff(startAngle, endAngle);

    if (this.addHeading(startAngle, bearingdiff) == endAngle) {
      return this.addHeading(startAngle, bearingdiff / 2);
    } else {
      return this.addHeading(startAngle, (bearingdiff * -1) / 2);
    }
  }

  /*------------------------------------------

        GPS DATA 

    -------------------------------------------*/
  /**
    Parse Human readable GPS

    Converts GPS
  */
  function parseDMS(input) {
    //convert parsed to decimal

    var parts = [];

    if (typeof input === "string") {
      //Check input type is correct
      parts = input.split(" "); //Split string into degrees and decimal minutes and direction

      switch (parts.length) {
        case 3:
          parts[0] = parseInt(parts[0], 10); //convert to number
          parts[1] = parseFloat(parts[1], 10);
          output = this.convertDMSToDD(parts[0], parts[1], parts[2]);

          break;
        default:
          output = 0;
          break;
      }
    } else {
      output = 0;
    }

    return output;
  }

  /**
   *  convertDMSToDD
   *
   *  convert Degree, minutes to decimal (signed)
   *
   */
  function convertDMSToDD(degrees, minutes, direction) {
    var dd = degrees + minutes / 60;

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E

    dd = Math.floor((dd * 1000000000) / 100); //convert to integer - over multiply and reduce to avoid rounsing errors

    return dd;
  }

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
  function getBoundsOfData(data) {
    return data.reduce(
      function(a, c) {
        return {
          latMin: isNaN(c.latMin) || c.latMin > latMin ? latMin : c.latMin,
          latMax: isNaN(c.latMax) || c.latMax < latMax ? latMax : c.latMax,
          lonMin: isNaN(c.lonMin) || c.lonMin > lonMin ? lonMin : c.lonMin,
          lonMax: isNaN(c.lonMax) || c.lonMax < lonMax ? lonMax : c.lonMax
        };
      },
      {
        latMin: -Infinity,
        latMax: Infinity,
        lonMin: -Infinity,
        lonMax: Infinity
      }
    );
  }

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
  function getDistanceCos(from, to, radius) {
    var R = radius || MEAN_RADIUS_IM_M / 1000; //default to earth radius in km

    var d =
      Math.acos(
        Math.sin((from.lat * Math.PI) / 180) *
          Math.sin((to.lat * Math.PI) / 180) +
          Math.cos((from.lat * Math.PI) / 180) *
            Math.cos((to.lat * Math.PI) / 180) *
            Math.cos(((to.lon - from.lon) * Math.PI) / 180)
      ) * R;
    return d;
  }

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
  function getDistanceHaversine(from, to) {
    var R = MEAN_RADIUS_IM_M / 1000; // earth's mean radius in km
    var dLat = ((to.lat - from.lat) * Math.PI) / 180;
    var dLon = ((to.lon - from.lon) * Math.PI) / 180;
    from.lat = (from.lat * Math.PI) / 180;
    to.lat = (to.lat * Math.PI) / 180;

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from.lat) *
        Math.cos(to.lat) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  /**
   * getDistanceFromSpeedTime
   *
   * Calculate distance form speed (in kM/hour) and Time (seconds)
   *
   * @param {number} speed - speed in kM/hr
   * @param {number} time - time in Seconds
   * @return {object}
   *      @property {number} distInDegree
   *      @property {number} distInFeet
   *      @property {number} distInKilometers
   *
   * */

  function getDistanceFromSpeedTime(speed, time) {
    return {
      distInDegree:
        (speed * (time / geoSpatialUtils.HOUR)) / geoSpatialUtils.KM_IN_DEG,
      distInFeet:
        speed * (time / geoSpatialUtils.HOUR) * geoSpatialUtils.KM_TO_FEET,
      distInKilometers: speed * (time / geoSpatialUtils.HOUR),
      distInNM: speed * (time / geoSpatialUtils.HOUR) * geoSpatialUtils.KM_TO_NM
    };
  }

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

  function getPostionFromBearingAndDistance(waypoint, distance, bearing) {
    var position = {
      lat: waypoint.lat(),
      lng: waypoint.lng()
    };

    dist = distance / MEAN_RADIUS_IM_M / 1000;

    var brng = (Number(bearing) * Math.PI) / 180;
    var lat1 = position.lat;
    lat1 = (lat1 * Math.PI) / 180;
    var lon1 = position.lng;
    lon1 = (lon1 * Math.PI) / 180;

    var lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)
    );

    var lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
        Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2)
      );

    return {
      lat: (lat2 * 180) / Math.PI,
      lng: (lon2 * 180) / Math.PI
    };
  }

  /**
    getIntersection

    Calculate intersection between two lines in lat and lon.  They are not required to overlap to calulate

    @param {object} arrs
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
  function getIntersection(arrs) {
    var XAsum = arrs.lineA.start.lon - arrs.lineA.end.lon;
    var XBsum = arrs.lineB.start.lon - arrs.lineB.end.lon;
    var YAsum = arrs.lineA.start.lat - arrs.lineA.end.lat;
    var YBsum = arrs.lineB.start.lat - arrs.lineB.end.lat;

    var LineDenominator = XAsum * YBsum - YAsum * XBsum;
    if (LineDenominator == 0.0) return false;

    var a =
      arrs.lineA.start.lon * arrs.lineA.end.lat -
      arrs.lineA.start.lat * arrs.lineA.end.lon;
    var b =
      arrs.lineB.start.lon * arrs.lineB.end.lat -
      arrs.lineB.start.lat * arrs.lineB.end.lon;

    var lat = (a * YBsum - b * YAsum) / LineDenominator;
    var lon = (a * XBsum - b * XAsum) / LineDenominator;

    return { lat: lat, lon: lon };
  }

  /**
   * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point.
   *
   * @param   {object} lineStart - Start point of great circle path.
       @property {number} lat
       @property {number} lon
   * @param   {object} lineEnd - End point of great circle path.
       @property {number} lat
       @property {number} lon
     @param   {object} currentPoint -current location
         @property {number} lat
         @property {number} lon
   * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
   * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
   *
   * @example
   *   var pCurrent = new LatLon(53.2611, -0.7972);
   *   var p1 = new LatLon(53.3206, -1.7297);
   *   var p2 = new LatLon(53.1887,  0.1334);
   *   var d = pCurrent.crossTrackDistanceTo(p1, p2);  // -307.5 m
   */
  function crossTrackDistanceTo(lineStart, lineEnd, currentPoint, radius) {
    var R = radius === undefined ? MEAN_RADIUS_IM_M : Number(radius);

    var startLineLength = this.getDistanceCos(lineStart, currentPoint, R) / R;
    var startToCurrent =
      this.getBearingBetweenTwoPoints(lineStart, currentPoint) *
      (Math.PI / 180);
    var startLineBearing =
      this.getBearingBetweenTwoPoints(lineStart, lineEnd) * (Math.PI / 180);

    var XTE = Math.asin(
      Math.sin(startLineLength) * Math.sin(startToCurrent - startLineBearing)
    );

    return XTE * R;
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
  function getMinMaxAvgFromArray(newArray) {
    //strips out bad data
    var max = newArray.reduce(function(a, b) {
      if (isNaN(a) || a === null || a === "") a = -Infinity;
      if (isNaN(b) || b === null || b === "") b = -Infinity;
      return Math.max(a, b);
    }, -Infinity);

    var min = newArray.reduce(function(a, b) {
      if (isNaN(a) || a === null || a === "") a = Infinity;
      if (isNaN(b) || b === null || b === "") b = Infinity;
      return Math.min(a, b);
    }, Infinity);

    var avg =
      newArray.reduce(function(previous, current) {
        if (isNaN(current) || current === null || current === "")
          return previous;
        return previous + Number(current);
      }, 0) / newArray.length;

    return { min, max, avg };
  }

  /**
   * Convert lat/lon to mercator projection points
   */
  function mercator({ latitude, longitude }) {
    const MAX = 85.0511287798;
    const RADIANS = Math.PI / 180;
    var point = {};

    point.lon = RADIUS_IN_M * longitude * RADIANS;
    point.lat = Math.max(Math.min(MAX, latitude), -MAX) * RADIANS;
    point.lat = RADIUS_IN_M * Math.log(Math.tan(Math.PI / 4 + point.lat / 2));

    return point;
  }

  /*-----------------------------------------------

    TIME FUNCTIONS

---------------------------------------------------*/

  /**
   * humanTime
   *
   * Produce human readable time from milliseconds.  Automatically hide/add mins secs days etc
   *
   */
  function humanTime(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
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
  }

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
    var n_source, n_stack, n_dest, start, end, i, sig;
    var dev_sqr, max_dev_sqr, band_sqr;
    var x12, y12, d12, x13, y13, d13, x23, y23, d23;
    var F = (Math.PI / 180.0) * 0.5;
    var index = new Array(); /* aray of indexes of source points to include in the reduced line */
    var sig_start = new Array(); /* indices of start & end of working section */
    var sig_end = new Array();

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

        x12 = source[end].lon / 10000000 - source[start].lon / 10000000;
        y12 = source[end].lat / 10000000 - source[start].lat / 10000000;
        if (Math.abs(x12) > 180.0) x12 = 360.0 - Math.abs(x12);
        x12 *= Math.cos(
          F * (source[end].lat / 10000000 + source[start].lat / 10000000)
        ); /* use avg lat to reduce lon */
        d12 = x12 * x12 + y12 * y12;

        for (i = start + 1, sig = start, max_dev_sqr = -1.0; i < end; i++) {
          x13 = source[i].lon / 10000000 - source[start].lon / 10000000;
          y13 = source[i].lat / 10000000 - source[start].lat / 10000000;
          if (Math.abs(x13) > 180.0) x13 = 360.0 - Math.abs(x13);
          x13 *= Math.cos(
            F * (source[i].lat / 10000000 + source[start].lat / 10000000)
          );
          d13 = x13 * x13 + y13 * y13;

          x23 = source[i].lon / 10000000 - source[end].lon / 10000000;
          y23 = source[i].lat / 10000000 - source[end].lat / 10000000;
          if (Math.abs(x23) > 180.0) x23 = 360.0 - Math.abs(x23);
          x23 *= Math.cos(
            F * (source[i].lat / 10000000 + source[end].lat / 10000000)
          );
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
    var r = new Array();
    for (var i = 0; i < n_dest; i++) r.push(source[index[i]]);

    console.log("new array", r);
    return r;
  }

  return {
    getAvgOfBearings: getAvgOfBearings,
    getBoundsOfData: getBoundsOfData,
    getMinMaxAvgFromArray: getMinMaxAvgFromArray,
    humanTime: humanTime
  };
})();

console.log("geo", geo);
