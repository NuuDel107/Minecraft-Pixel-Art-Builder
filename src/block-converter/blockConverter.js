var fs = require("fs")

module.exports = class BlockConverter {
    constructor() {

        var colordata = fs.readFileSync("./src/block-converter/colors.json");
        colordata = JSON.parse(colordata);

        this.blockColors = [];

        this.blockKeys = Object.keys(colordata.blocks);

        this.blockKeys.forEach(key => {
            this.blockColors.push(colordata.blocks[key]);
        });

    }

    colorToBlock(RGBcolor)
    {
        var distances = [];

        this.blockColors.forEach(colors => {
            
            let totalDistance = 0;

            for (let i = 0; i <= 2; i++)
            {
                totalDistance += Math.abs(colors[i] - RGBcolor[i]);
            }
            
            distances.push(totalDistance);
            
        });

        var lowest = 0;

        for (var i = 1; i < distances.length; i++) {
            
            if (distances[i] < distances[lowest])
            {
                lowest = i;
            } 
                
        }

        return this.blockKeys[lowest];
    }


}