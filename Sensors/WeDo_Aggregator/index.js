var Wedo2 = require('WeDo2');
var wedo2 = new Wedo2();
var osc = require('node-osc');

var client = new osc.Client('192.168.0.2', 8001);

//wedo2.setMaxListeners(100);
process.setMaxListeners(0);



const FREQ_MIN = 0;
const FREQ_MAX = 100;
const FREQ_MID = FREQ_MIN + (FREQ_MAX - FREQ_MIN) * 0.5;

const OSC_NAMES = {
    //"0c557def6023441c8bbe25e1fa3d862b" : "/tilt",
    "42f5ca223e4448888929be12099d14af" : "/P1",
    "c9638880d4984514990a3bc2437a5310" : "/P2",
    "71fa51f135114ee9af2f78dac92ae012" : "/P3",
    "13d2e289bb134c3d80edc84a8259636d" : "/P4",
    "14bf26ee18a1403bb855e0cafa719878" : "/I1",
    "b4a102c85c9c4e95b14dc6527300ec42" : "/I2"

}

var metaData = {
    "/P2": {
        state: false,
        lastChange: new Date().getTime(),
        lastValue: 0
    },
    "/P3": {
        state: false,
        lastChange: new Date().getTime(),
        lastValue: 0

    }
}


wedo2.on('connected', function (uuid) {
    console.log('I found a WeDo with uuid: '+uuid);

    //wedo2.setDeviceName('P1', '42f5ca223e4448888929be12099d14af');
    //wedo2.setDeviceName('P2', 'c9638880d4984514990a3bc2437a5310');
    //wedo2.setDeviceName('P3', '71fa51f135114ee9af2f78dac92ae012');
    //wedo2.setDeviceName('P4', '13d2e289bb134c3d80edc84a8259636d');

   


    // Place getters and setters in here, to make sure that they are called,
    // when the object is connectged
});


wedo2.on('tiltSensor', function (x,y, port, uuid) {
    

    var oscId = OSC_NAMES[uuid];

    var x_norm = (x + 45)/ 90 ;
    var y_norm = (y + 45)/ 90 ;
    console.log("uuid","x",x_norm);
    console.log("uuid","y",y_norm);
    
    if(oscId !== "P2"){
    client.send( oscId + 'x',x_norm);
    };
    
    
    wedo2.setSound(x*100, y);
    wedo2.setLedColor(x_norm*255,y_norm*255,x_norm*255); 

    if (metaData[oscId]) {
        //console.log(Math.abs(y_norm - metaData[oscId].lastValue));
        if (Math.abs(y_norm - metaData[oscId].lastValue) >= 0.3) {
            metaData[oscId].state = true;
            metaData[oscId].lastChange = new Date().getTime();
            metaData[oscId].lastValue = y_norm;
        }
        if (metaData[oscId].state) {
            client.send( oscId + 'state',1);
            client.send( oscId + 'y',y_norm);
        }
    }  


//    client.send( name + 'x',x_norm);
//    client.send( name + 'y',y_norm);

//   wedo2.getDeviceName(function(name, uuid){

 });

wedo2.on('distanceSensor', function (distance, port, uuid) {
    console.log('distanceSensor: '+distance+' at port '+port + ' @ '+uuid);
    var d_norm = distance / 10;
    client.send( OSC_NAMES[uuid],d_norm);
    wedo2.setLedColor(d_norm*255,d_norm*255,d_norm*255);
});


setInterval(function() {
    var currentTime = new Date().getTime();
    var keys = Object.keys(metaData);
    for (var i = 0; i < keys.length; i++) {
        if (metaData[keys[i]].state && (currentTime - metaData[keys[i]].lastChange >= 2000)) {
            metaData[keys[i]].state = false;
            console.log("TURN OFF" + keys[i]);
            client.send( keys[i] + 'state',0);
        }
    }

},2000);


