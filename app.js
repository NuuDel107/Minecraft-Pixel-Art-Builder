const WebSocket = require("ws")
const fs = require("fs")
const request = require("request")

const imageTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"]

const Pixels = require("./pixels");
const JSONSender = require("./jsonSender");

const wss = new WebSocket.Server({ port: 80 })


wss.on("connection", ws => {
    JSONSender.subscribe(ws, "PlayerMessage")

    ws.on("message", packet => {
        const data = JSON.parse(packet);

        if(data.body.eventName == "PlayerMessage")
        {
            const message = data.body.properties.Message;

            if(message.substring(0, 6) == "!print")
            {
                const params = message.substring(7).split(" ");

                const uri = params[0];

                var width = parseInt(params[1]);
                var height = parseInt(params[2]);

                console.log(uri, width, height);

                request.head(uri, (err, res, body) => {
                    if (imageTypes.includes(res.headers['content-type']))
                    {

                        request(uri).pipe(fs.createWriteStream("image.png")).on("close", () => {

                            fs.writeFileSync("log.txt", " ");



                            Pixels.getPixels(width, height, async commands => {
                                for (var i = 0; i < commands.length; i++) {
            
                                    JSONSender.sendCommand(ws, commands[i]);
                                    console.log(commands[i]);
            
                                    fs.writeFileSync("log.txt", commands[i] + "\n", {flag: "a+"}); 
            
                                    await new Promise(resolve => setTimeout(resolve, 1));
                                    
                                };
                            });

                        });
                    }
                    
                    else {
                        JSONSender.sendCommand(ws, "/say ERROR: Image must be of type 'jpeg', 'png', 'bmp' or 'gif'");
                    }
                });




            }
        }
    });
});
