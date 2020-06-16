const {
  validateBearings,
  processPointData,
} = require("./validateData/validation");

const handleError = (message) => {
  throw { error: "Invalid Bearings", message };
};

module.exports = {
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
  getBearingBetweenTwoPoints: (start, end, decimal = 0) => {
    try {
      const [startClean, endClean] = processPointData([start, end]);

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
  getBearingDiff: (bearing1, bearing2) => {
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
  addHeading: (baseHdg, addDegrees) => {
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

    Calculates difference in two bearings and returns median bearing between those two bearings
    Effectively finds the smaller of the two angles of a cricle and returns the median angle

    @param {number} startAngle
    @param {number} endAngle

    @return {number} median bearing

  */
  findMiddleAngle: (startAngle, endAngle) => {
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
