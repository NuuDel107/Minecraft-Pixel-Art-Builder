const fs = require("fs")
const Jimp = require("jimp");

const BlockConverter = require("./blockConverter/blockConverter");
const bConverter = new BlockConverter();

module.exports = {
    
    getPixels: (width, height, callback) => {


        var commands = [];

        Jimp.read("image.png", (err, img) => {
            if (err) throw err;

            if(Number.isNaN(height))
            {
                img.resize(width, Jimp.AUTO);
            }
            else {
                img.resize(width, height);
            }

            height = img.bitmap.height;

            for (var y = 1; y <= height; y++)
            {
                for(var x = 1; x <= width; x++)
                {
                    var hexColor = img.getPixelColor(x, y);

                    var RGBcolor = Jimp.intToRGBA(hexColor);
                    
                    if(RGBcolor.a != 0)
                    {
                        var block = bConverter.colorToBlock([RGBcolor.r, RGBcolor.g, RGBcolor.b]);
                    

                        cmd = "/setblock " + x + " 3 " + y + " " + block;
                        commands.push(cmd);
                    }

                    
                    
                }
            }

            fs.unlink("image.png", (err) => {
                if (err) throw err;
            })

            callback(commands);

            
        });

    }

}
