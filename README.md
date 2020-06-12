# geo
Collection of geographical and navigation related helper functions.  All functions are well documented and inputs and outputs should be straight forward.

*** in development ***

## API
### Bearings and Angles
#### getAvgOfBearings
Return average of all bearing values in array normalized for compass bearings. 

#### getBearingBetweenTwoPoints
Calculate bearing from position 1 to position 2 in degrees.  Latitude and Longitude must be in Decimal format.  i.e.  51.13342.  

If using  DMS format i.e. 35° 24' 32.22'' then run through conversion function to get Decimal format.
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
 
### Position
#### getPostionFromBearingAndDistance
Calculate a lat/lon position in decimal format point from;
  1. Existing lat/lon point in decimal format
  2. Bearing from intial point in degrees
  3. Distance travelled from intial point in KM
 
 
### Conversion Utilities

#### parseDMS
#### convertDMSToDD
#### getBoundsOfData

### getMinMaxAvgFromArray









### getIntersection
### crossTrackDistanceTo
### getMinMaxAvgFromArray
### mercator
### humanTime
### GDP_smoother
