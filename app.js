const fs = require("fs");

var colordata = fs.readFileSync("colors.json");

colordata = JSON.parse(colordata);

var blocks = Object.keys(colordata.blocks)

blocks.forEach(key => {
    console.log(colordata.blocks[key].R)
});