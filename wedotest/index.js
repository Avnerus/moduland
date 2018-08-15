var Wedo2 = require('WeDo2');
var wedo2 = new Wedo2();
var osc = require('node-osc');

var client = new osc.Client('10.100.2.91', 8000);

const FREQ_MIN = 0;
const FREQ_MAX = 100;
const FREQ_MID = FREQ_MIN + (FREQ_MAX - FREQ_MIN) * 0.5;

const OSC_NAMES = {
    "0c557def6023441c8bbe25e1fa3d862b" : "/tilt",
    "ee0961a4f11746dba00c27cf09b4d01c" : "/tilt2"
}

wedo2.on('connected', function (uuid) {
    console.log('I found a WeDo with uuid: '+uuid);
    // Place getters and setters in here, to make sure that they are called,
    // when the object is connectged
});


wedo2.on('tiltSensor', function (x,y, port, uuid) {
    //console.log('tilt sensor: '+x+'   '+y+' at port '+port +' @ '+uuid);
    var x_norm = x / 45;
    var freq = Math.floor(FREQ_MID + (x_norm * FREQ_MID));
    var addy = OSC_NAMES[uuid];
    console.log(addy);
    client.send(addy, freq / 100, function () {
    });

});
