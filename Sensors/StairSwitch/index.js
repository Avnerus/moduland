var SerialPort = require('serialport');
var osc = require('node-osc');
var oscOut = new osc.Client('192.168.0.2', 8000);

var serialPort = new SerialPort('/dev/tty.usbmodem4346941', {
  baudRate: 9600,
  parity: 'none',
  stopBits: 1,
  dataBits: 8
});

serialPort.on("open", function () {
  console.log('serial open');
});

serialPort.on('data', function(data) {
  transfer(data);
});

function transfer(data){
  const stair = data.toString("utf-8");
  console.log(stair.charAt(0));
  oscOut.send('/stair'+stair.charAt(0), parseInt(stair.charAt(1)));
}