var fs = require("fs")

module.exports = class BlockConverter {
    constructor() {

        var colordata = fs.readFileSync("convert/colors.json");
        colordata = JSON.parse(colordata);

        this.blockColors = [];

        this.blockKeys = Object.keys(colordata.blocks);

        this.blockKeys.forEach(key => {
            this.blockColors.push(colordata.blocks[key]);
        });

        console.log(this.blockKeys)

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

        function indexOfSmallest(a) {
            var lowest = 0;
            for (var i = 1; i < a.length; i++) {
            if (a[i] < a[lowest]) lowest = i;
            }
            return lowest;
        };

        console.log(this.blockKeys[indexOfSmallest(distances)]);
    }


}