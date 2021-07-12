const WebSocket = require("ws")
const fs = require("fs")
const request = require("request")

const Pixels = require("./image-pixels/pixels");
const JSONSender = require("./mc-server/jsonSender");
const CommandParser = require("./command-parser/parser");

const imageTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const PORT = 80;
const wss = new WebSocket.Server({ port: PORT });

console.log("Listening on port", PORT);


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

                if(params[0] == "help")
                {
                    JSONSender.say(ws, "Command syntax: ");
                    JSONSender.say(ws, "!print (image url) (width) (height)*");
                    JSONSender.say(ws, "Examples: ");
                    JSONSender.say(ws, "!print https://www.google.com/images/srpr/logo3w.png 100");
                    JSONSender.say(ws, "!print https://i.pinimg.com/originals/b0/46/8c/b0468c61baa72515ada2838c236466e8.jpg 69 69");
                }
                else {

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

                                    fs.writeFileSync("../log.txt", " ");



                                    Pixels.get(ws, width, height, async block2D => {

                                        const commands = CommandParser.parse(ws, block2D);

                                        JSONSender.say(ws, "Printing...");
                                        for (let i = 0; i < commands.length; i++) {
                    
                                            JSONSender.sendCommand(ws, commands[i]);

                                            
                                            fs.writeFileSync("../log.txt", commands[i] + "\n", {flag: "a+"}); 
                                            
                                            await new Promise(resolve => setTimeout(resolve, 1));
                                            
                                        };

                                        JSONSender.say(ws, "Done!");
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
        }
    });
});
