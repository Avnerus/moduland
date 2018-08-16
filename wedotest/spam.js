var osc = require('node-osc');

var client = new osc.Client('192.168.0.2', 8000);

setInterval(function() {
    console.log("Spam");
    client.send("/spam", 0.5, function () {
        console.log("Spam");
    });
},200);
