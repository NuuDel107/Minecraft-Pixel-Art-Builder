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

    JSONSender.say(ws, "§2§lConnected to Pixel Art Builder");
    JSONSender.say(ws, "§7For more information, type §o§f!print help");

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
                    JSONSender.say(ws, "§l§6Command syntax: ");
                    JSONSender.say(ws, "§7!print §a<url> §b<width> §e<height>(optional)");
                    JSONSender.say(ws, "§l§6Examples: ");
                    JSONSender.say(ws, "!print §ahttps://www.google.com/images/srpr/logo3w.png §b100");
                    JSONSender.say(ws, "§7Prints Google's logo with a width of 100 blocks and automatic height");
                    JSONSender.say(ws, "!print §ahttps://i.pinimg.com/originals/b0/46/8c/b0468c61baa72515ada2838c236466e8.jpg §b100 §e60");
                    JSONSender.say(ws, "§7Prints Tesla's logo with a width of 100 and a height of 60 blocks");
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

                                        JSONSender.say(ws, "§7Printing...");
                                        for (let i = 0; i < commands.length; i++) {
                    
                                            JSONSender.sendCommand(ws, commands[i]);

                                            
                                            fs.writeFileSync("../log.txt", commands[i] + "\n", {flag: "a+"}); 
                                            
                                            await new Promise(resolve => setTimeout(resolve, 1));
                                            
                                        };

                                        JSONSender.say(ws, "§a§lDone!");
                                    });

                                });
                            }
                            
                            else {
                                console.log(res.headers["content-type"])
                                JSONSender.say(ws, "§cERROR§f: Image must be of type 'jpeg', 'png', 'bmp' or 'gif'");
                            }
                        }
                        else {
                            JSONSender.say(ws, "§cERROR§f: Image not found (check link spelling?)");
                        }
                    });

                }

            }
            if(message == "!erase")
            {

            }
        }
    });
});
