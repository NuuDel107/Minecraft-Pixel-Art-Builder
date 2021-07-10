const rectangleDetect = require("./rectangleDetect");

module.exports = {
    parse : function(block2D) {

        const yPos = 3;

        var commandList = [];
        var blockList = [];
        

        block2D.forEach(blockLine => {
            blockLine.forEach(block => {
                if(!blockList.includes(block)) {

                    blockList.push(block);
                };
            });
        });

        
        blockList.forEach(listBlock => {
            let mat = [];

            

            for (let i = 0; i < block2D.length; i++ )
            {
                mat.push([])

                block2D[i].forEach(block => {
                    if(block == listBlock) {

                        mat[i].push(1);
                    }
                    else {

                        mat[i].push(0);
                    }
                });
            };

            console.log(listBlock);
            console.log(mat);
            console.log("\n\n")

            var rectanglePositions = rectangleDetect.detect(mat);
            
            rectanglePositions.forEach(rectPos => {
                const cmd = ["/fill", rectPos.x1, yPos, rectPos.y1, rectPos.x2, yPos, rectPos.y2, listBlock].join(" ")

                commandList.push(cmd);
            });


        });

        return commandList;

        
    }
}