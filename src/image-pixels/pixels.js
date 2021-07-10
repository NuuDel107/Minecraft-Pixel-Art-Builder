const fs = require("fs")
const Jimp = require("jimp");

const BlockConverter = require("../block-converter/blockConverter");
const bConverter = new BlockConverter();
const CommandParser = require("../command-parser/parser");

module.exports = {
    
    get: (width, height, callback) => {


        var block2D = [];
        var blocks = [];

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

                        blocks.push(block);
                    }

                    
                    
                }

                block2D.push(blocks);
                blocks = [];
            }

            fs.unlink("image.png", (err) => {
                if (err) throw err;
            })

            const commands = CommandParser.parse(block2D);

            callback(commands);

            
        });

    }

}
