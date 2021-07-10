const WebSocket = require("ws")
const fs = require("fs")
const request = require("request")

const imageTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"]

const Pixels = require("./src/image-pixels/pixels");
const JSONSender = require("./src/mc-server/jsonSender");

const wss = new WebSocket.Server({ port: 80 })


wss.on("connection", ws => {
    JSONSender.subscribe(ws, "PlayerMessage")

    JSONSender.say(ws, "Connected to Pixel Art Builder");
    JSONSender.say(ws, "For more information, type !print help");

    ws.on("message", packet => {
        const data = JSON.parse(packet);

        if(data.body.eventName == "PlayerMessage")
        {
            const message = data.body.properties.Message;

            if(message.substring(0, 6) == "!print")
            {
                const params = message.substring(7).split(" ");

                const uri = params[0];

                let width = parseInt(params[1]);
                let height = parseInt(params[2]);

                console.log(uri, width, height);

                request.head(uri, (err, res, body) => {
                    if(res != undefined)
                    {
                        if (imageTypes.includes(res.headers['content-type']))
                        {

                            request(uri).pipe(fs.createWriteStream("image.png")).on("close", () => {

                                fs.writeFileSync("log.txt", " ");



                                Pixels.get(width, height, async commands => {
                                    for (let i = 0; i < commands.length; i++) {
                
                                        JSONSender.sendCommand(ws, commands[i]);

                                        /* for debugging:
                                        console.log(commands[i]);
                                        fs.writeFileSync("log.txt", commands[i] + "\n", {flag: "a+"}); 
                                        */
                                        await new Promise(resolve => setTimeout(resolve, 1));
                                        
                                    };
                                });

                            });
                        }
                        
                        else {
                            JSONSender.say(ws, "ERROR: Image must be of type 'jpeg', 'png', 'bmp' or 'gif'");
                        }
                    }
                    else {
                        JSONSender.say(ws, "ERROR: Image not found (check link spelling?)");
                    }
                });

            }
        }
    });
});
