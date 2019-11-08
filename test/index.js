//tests

function geoJSONtestValues (){
    var geoJSON = [],
        lat = [rndGen(-90, 90), rndGen(-90, 90)],
        lon = [rndGen(-180, 180), rndGen(-180, 180)],
        latMin = Math.min(lat),
        latMax = Math.max(lat),
        lonMin = Math.min(lon),
        lonMax = Math.max(lon),
        counter = 100000;

    function rndGen(min, max){
        return Math.floor(Math.random() * (max-min + 1) + min);
    };

    for(var i=0; i < counter; i++){
        geoJSON.push({
            lat:rndGen(latMin, latMax),
            lon:rndGen(lonMin, lonMax)
        })
    }

    return {
        latMaxExpected: latMax,
        latMinExpected: latMin,
        lonMaxExpected: lonMax,
        lonMinExpected: lonMin,
        geoJSON: geoJSON

    }
};

console.log('geoJSON test',geoJSONtestValues())

console.log('*************************************');
console.log('              TESTS                  ')
console.log('*************************************');
console.log('GetAvg Bearing | [330,334,350,11,12,18]');
console.log(`Result: ${JSON.stringify(geo.getAvgOfBearings([330,334,350,11,12,18]))}`);
console.log(`Assert: {degrees: 354.91, radians: -0.07130099291306147`);
console.log('GetAvg Bearing | ["qwe",365,11,12,-18]');
console.log(`Result: ${JSON.stringify(geo.getAvgOfBearings(['qwe',365,11,12,-18]))}`);
console.log(`Assert: {"error":"Invalid Bearings","values":[{"index":0,"value":"qwe"},{"index":1,"value":365},{"index":4,"value":-18}]}`);
console.log('GetAvg Bearing | [329]');
console.log(`Result: ${JSON.stringify(geo.getAvgOfBearings([329]))}`);
console.log(`Assert: {"error":"Less than two Bearings"}`);

console.log('*************************************');