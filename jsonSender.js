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

    }
}