const Jimp = require("jimp");

module.exports = {
    
    getPixels: async (width, height, callback) => {


        var pixels = [];

        await Jimp.read("test.png", (err, img) => {
            if (err) throw err;

            img.resize(width, height);

            for (var y = 1; y <= width; y++)
            {
                for(var x = 1; x <= height; x++)
                {
                    var hexColor = img.getPixelColor(x, y);

                    var RGBcolor = Jimp.intToRGBA(hexColor)
                    pixels.push(RGBcolor);
                }
            }

            callback(pixels);

            
        });

    }

}
