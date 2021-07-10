const fs = require("fs")
const Jimp = require("jimp");

const BlockConverter = require("../block-converter/blockConverter");
const bConverter = new BlockConverter();


module.exports = {
    
    get: (width, height, callback) => {


        let block2D = [];
        let blocks = [];

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
                    
                    if(RGBcolor.a != 0)
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

            

            callback(block2D);

            
        });

    }

}
