const Jimp = require("jimp");

const BlockConverter = require("./blockConverter/blockConverter");
const bConverter = new BlockConverter();

module.exports = {
    
    placePixels: async (width, height, callback) => {


        var commands = [];

        Jimp.read("test.png", async (err, img) => {
            if (err) throw err;

            img.resize(width, height);

            for (var y = 1; y <= width; y++)
            {
                for(var x = 1; x <= height; x++)
                {
                    var hexColor = img.getPixelColor(x, y);

                    var RGBcolor = Jimp.intToRGBA(hexColor);
                    
                    
                    var block = bConverter.colorToBlock([RGBcolor.r, RGBcolor.g, RGBcolor.b]);
                    

                    cmd = "/setblock " + x + " 10 " + y + " " + block;
                    commands.push(cmd);
                    
                    
                }
            }

            callback(commands);

            
        });

    }

}
