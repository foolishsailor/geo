# geo
Collection of geographical and navigation related functions

*** in development ***

## functions


### getAvgOfBearings
Return average of all bearing values in array normalized for compass bearings. 

#### Input
| Option | Type | Description  | 
| --- | --- | --- |
| **degrees** | number | Bearing value between 0 and 360 not inclusive of 360 |

#### Return Object
| Parameter | Type | Description  | 
| --- | --- | --- |
| **degrees** | number | Average bearing value in degrees |
| **radians** | number | Average bearing value in radians |


### getBearingBetweenTwoPoints
Calculate bearing from position 1 to position 2 in degrees.  Latitude and Longitude must be in Decimal format.  i.e.  51.13342.  

If using  DMS format i.e. 35° 24' 32.22'' then run through conversion function to get Decimal format.

[Convert DMS to Decimal](#parsedms)

#### Input
| Parameter | Type | Description  | 
| --- | --- | --- |
| **position1** | position object | From Position |
| **position2** | position object | To Position |

##### Position Object

| Parameter | Type | Description  | 
| --- | --- | --- |
| **lat** | number | Latitude in decimal format |
| **lon** | number | Longitude in decimal format |


### getBoundsOfData
### getMinMaxAvgFromArray
### humanTime

### getBearingDiff
### addHeading
### invertHDG
### findMiddleAngle
### parseDMS
### convertDMSToDD
### getDistanceCos
### getDistanceHaversine
### getDistanceFromSpeedTime
### getPostionFromBearingAndDistance
### getIntersection
### crossTrackDistanceTo
### getMinMaxAvgFromArray
### mercator
### humanTime
### GDP_smoother
