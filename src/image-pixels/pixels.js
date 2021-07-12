const fs = require("fs")
const Jimp = require("jimp");

const BlockConverter = require("../block-converter/blockConverter");
const bConverter = new BlockConverter();
const JSONSender = require("../mc-server/jsonSender");


module.exports = {
    
    get: (ws, width, height, callback) => {


        let block2D = [];
        let blocks = [];

        JSONSender.say(ws, "§7Processing image...");

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

            for (let y = 1; y <= height; y++)
            {
                for(let x = 1; x <= width; x++)
                {
                    const hexColor = img.getPixelColor(x, y);

                    const RGBcolor = Jimp.intToRGBA(hexColor);
                    
                    if(RGBcolor.a == 0)
                    {
                        blocks.push("air");
                    }
                    
                    else 
                    {
                        const block = bConverter.colorToBlock([RGBcolor.r, RGBcolor.g, RGBcolor.b]);

                        blocks.push(block);
                    }

                    
                    
                }

                block2D.push(blocks);
                blocks = [];
            }

            fs.unlink("image.png", (err) => {
                if (err) throw err;
            })

            
            JSONSender.say(ws, "§a§lDone!");
            callback(block2D);

            
        });

    }

}
