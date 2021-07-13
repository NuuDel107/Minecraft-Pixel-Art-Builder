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

    JSONSender.say(ws, "\n\n§2§lConnected to Pixel Art Builder");
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

                    const startTime = new Date();

                    const xPos = params[0];
                    const yPos = params[1];
                    const zPos = params[2];

                    let width = parseInt(params[3]);
                    let height = parseInt(params[4]);

                    const uri = params[5];

                    console.log(uri, width, height);

                    request.head(uri, (err, res, body) => {
                        if(res != undefined)
                        {
                            if (imageTypes.includes(res.headers['content-type']))
                            {

                                request(uri).pipe(fs.createWriteStream("image.png")).on("close", () => {

                                    fs.writeFileSync("../log.txt", " ");



                                    Pixels.get(ws, width, height, async block2D => {

                                        const commands = CommandParser.parse(ws, xPos, yPos, zPos, block2D);

                                        JSONSender.say(ws, "§7Printing...");
                                        for (let i = 0; i < commands.length; i++) {
                    
                                            JSONSender.sendCommand(ws, commands[i]);

                                            console.log(commands[i]);
                                            fs.writeFileSync("../log.txt", commands[i] + "\n", {flag: "a+"}); 
                                            
                                            await new Promise(resolve => setTimeout(resolve, 1));
                                            
                                        };

                                        JSONSender.say(ws, "§a§lDone!");

                                        const endTime = new Date();

                                        const execTime = new Date(endTime - startTime);

                                        const execMS = execTime.getMilliseconds();
                                        const execS = execTime.getSeconds();

                                        if(execTime.getMinutes() == 0)
                                        {
                                            JSONSender.say(ws, "§7Printing took §f" + execS + "§7 seconds and §f" + execMS + "§7 milliseconds");
                                        }
                                        else
                                        {
                                            const execM = execTime.getMinutes();
                                            JSONSender.say(ws, "§7Printing took §f" + execM + "§7 minute, §f" + execS + "§7 seconds and §f" + execMS + "§7 milliseconds");
                                        }
                                        
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
