const fs = require("fs");

const testValue = [63, 31, 24];

const colorTemplate = ["R", "G", "B"];

var colordata = fs.readFileSync("colors.json");
colordata = JSON.parse(colordata);

console.log("JSON parsed");
var blockColors = [];

var blockKeys = Object.keys(colordata.blocks);

blockKeys.forEach(key => {
    blockColors.push(colordata.blocks[key]);
});


var distances = [];

blockColors.forEach(colors => {
    
    let totalDistance = 0;

    for (let i = 0; i <= 2; i++)
    {
        totalDistance += Math.abs(colors[colorTemplate[i]] - testValue[i]);
    }
    
    distances.push(totalDistance);
    
})

function indexOfSmallest(a) {
 var lowest = 0;
 for (var i = 1; i < a.length; i++) {
  if (a[i] < a[lowest]) lowest = i;
 }
 return lowest;
}

console.log(blockKeys[indexOfSmallest(distances)])