const BlockConverter = require("./blockConverter/blockConverter");
const GetPixels = require("./image-processing/getPixels");

const bConverter = new BlockConverter();


GetPixels.getPixels(120, 120, pixels => {
    
    pixels.forEach(colors => {
        console.log(bConverter.colorToBlock([colors.r, colors.g, colors.b]))
    });
});
