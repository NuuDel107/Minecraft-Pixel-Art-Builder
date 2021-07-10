const fillDetection = require("./getFill");

module.exports = {
    parse : function(block2D) {
        fillDetection.detect(block2D);
    }
}