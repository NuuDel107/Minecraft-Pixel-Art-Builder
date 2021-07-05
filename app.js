const WebSocket = require("ws")
const fs = require("fs")

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
                fs.writeFileSync("log.txt", " ");
                Pixels.placePixels(200, 200, async commands => {
                    for (var i = 0; i < commands.length; i++) {

                        JSONSender.sendCommand(ws, commands[i]);
                        console.log(commands[i]);
                        fs.writeFileSync("log.txt", commands[i] + "\n", {flag: "a+"}); 
                        await new Promise(resolve => setTimeout(resolve, 1));
                        
                    };
                });
            }
        }
    });
});
