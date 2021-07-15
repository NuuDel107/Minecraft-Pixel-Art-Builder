const uuid = require("uuid");

module.exports = {
    subscribe: function(/* */) {
        var args = Array.from(arguments);
        var ws = args[0];

        args.forEach((event, index) =>
        {
            if(index == 0)
            {
                return;
            }

            ws.send(JSON.stringify({
                "header": {
                    "version": 1,                     
                    "requestId": uuid.v4(),           
                    "messageType": "commandRequest",  
                    "messagePurpose": "subscribe"     
                  },
                  "body": {
                    "eventName": event    
                  }
            }));
            
            console.log("Subscribed to event:", event);
        });

    },
    sendCommand: function(ws, cmd) {
        ws.send(JSON.stringify({

            "header": {
                "version": 1,
                "requestId": uuid.v4(),
                "messagePurpose": "commandRequest",
                "messageType": "commandRequest"
            },
            "body": {
                "version": 1,
                "commandLine": cmd,
                "origin": {
                    "type": "player"
                }
            }
            

        }));
    },
    say: function(ws, message) {
        ws.send(JSON.stringify({

            "header": {
                "version": 1,
                "requestId": uuid.v4(),
                "messagePurpose": "commandRequest",
                "messageType": "commandRequest"
            },
            "body": {
                "version": 1,
                "commandLine": '/tellraw @a {"rawtext":[{"text":"' + message + '"}]}',
                "origin": {
                    "type": "player"
                }
            }
            

        }));
    }
}