const rectangleDetect = require("./rectangleDetect");
const JSONSender = require("../mc-server/jsonSender");

module.exports = {
    parse : function(ws, block2D) {

        const yPos = 3;

        var commandList = [];
        var blockList = [];
        
        JSONSender.say(ws, "§7Parsing commands...")

        block2D.forEach(blockLine => {
            blockLine.forEach(block => {
                if(!blockList.includes(block)) {

                    blockList.push(block);
                };
            });
        });

        const blockListLength = blockList.length;

        var blockCounter = 0;
        var lastPercentLog = 0;

        blockList.forEach(listBlock => {

            if(listBlock == "air")
            {
                return;
            }
            
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

            const percentage = (100 * blockCounter) / blockListLength;
            
            if(percentage >= lastPercentLog + 10)
            {
                lastPercentLog += 10;
                if(lastPercentLog <= 30)
                {
                    JSONSender.say(ws, "§c" + lastPercentLog + "% done");
                    
                }
                else if(lastPercentLog <= 60)
                {
                    JSONSender.say(ws, "§e" + lastPercentLog + "% done");
                    
                }
                else if(lastPercentLog <= 90)
                {
                    JSONSender.say(ws, "§a" + lastPercentLog + "% done");
                    
                }
                
                
            }
            

            blockCounter++;
            
            
            rectanglePositions.forEach(rectPos => {
                const cmd = ["/fill", rectPos.x1, yPos, rectPos.y1, rectPos.x2, yPos, rectPos.y2, listBlock].join(" ")

                commandList.push(cmd);
            });


        });

        JSONSender.say(ws, "§a§l100% done!");

        return commandList;

        
    }
}