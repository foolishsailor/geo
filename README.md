
<div style="display:flex; align-items:center; justify-content:center;"><img src="https://github.com/foolishsailor/geo/blob/master/geo_icon.png" width="100px" height="100px" alt="geo"/><h1>geo</h1></div>
<div text-align: center;">
<a href='https://coveralls.io/github/foolishsailor/geo?branch=master'><img src='https://coveralls.io/repos/github/foolishsailor/geo/badge.svg?branch=master' alt='Coverage Status' /></a> <a href="https://codeclimate.com/github/foolishsailor/geo/maintainability"><img src="https://api.codeclimate.com/v1/badges/43f78828fd45baebd63f/maintainability" /></a> <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-yellow.svg' alt='MIT License' /></a>
 
 </div>
 
 
 
 
*** in development ***

Collection of geographical and navigation related helper functions.  
Functions include:
* GPS conversion utilities
* Robust parsing tool to convert human readable GPS data and deeply nested or XML GPX data to decimal format
* Various distance calculations: Between 2 points, Time and Heading...
* Various position calculations: Intersection from two routes, Bearing and Distance...
* Handles normalizing bearings: Avg of bearings, Median Bearing, Bearing Difference...
* Number utility helpers: toRad, toDeg, toBrng...

...more



## Installation

npm install geo

 --- or ---
 
include in browser

```<script src="../dist/geo.js"></script>```

## Live Example

Insert link here to git pages 

## API
### Usage
All functions are well documented in code and inputs and outputs for each function are straightforward.  Most functions also have error trapping to check for out of range bad values and will return an error message.

### Bearings and Angles
#### getAvgOfBearings
Return average of all bearing values in array normalized for compass bearings.  

#### getBearingBetweenTwoPoints
Calculate bearing from position 1 to position 2 in degrees.  Latitude and Longitude must be in Decimal format.  i.e.  51.13342.  

If using  DMS format i.e. 35° 24' 32.22" then run through conversion function to get Decimal format.
see [parseDMS](#parsedms) below

#### getBearingDiff
Calculate normalized difference between two bearings by finding the smaller of the two angles of a circle described by the two bearings

#### addHeading
Adds and normalizes two bearings.  Inputs and outputs in degrees

#### invertHDG
Finds recirocal heading by inverting and normalizing heading.  If heading is 270 returns 90, if 360 return 180 etc.  

#### findMiddleAngle
Calculates difference in two bearings and returns median bearing between those two bearings
Effectively finds the smaller of the two angles of a circle and returns the median angle
 
### Distance
#### getDistanceCos
Calculate distance between two points in km.  This method generates more accurate distance for points close together - less than a couple km max.  

#### getDistanceHaversine
 Calculate distance between two points in km.  This method generates more accurate distance for points farther apart and incorporates the curve of the earth as part of the equation.
 
#### getDistanceFromSpeedTime
Calculate distance from speed (in kM/hour) and Time (seconds)
 
#### crossTrackDistanceTo
Returns (signed) distance in Km from a given Lat/Lon point to the nearest point on a route that is defined by start-point and end-point.  Gives option to use Haversisne calculation whcih will work with longer routes and takes into account Great Circle calcs - or Cosine distance which works better for very short distances less than a couple Km.

### Position
#### getPostionFromBearingAndDistance
Calculate a lat/lon position in decimal format point from;
  1. Existing lat/lon point in decimal format
  2. Bearing from initial point in degrees
  3. Distance travelled from intial point in KM
 
#### getIntersection
Calculate intersection point between two lines/routes in lat and lon.  The routes are not required to overlap to for the calculation to work.


### Conversion Utilities

#### parseDMS

#### getBoundsOfData

### getMinMaxAvgFromArray


### getIntersection

### getMinMaxAvgFromArray
### mercator
### humanTime
### GDP_smoother
