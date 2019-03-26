const io = require('socket.io')(PORT_LIVE);
const net = require('net');
const express = require('express');
            var MODE=false;
//Config USB
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM5", {AutoOpen:false,
     baudRate: 115200
});

//Config BT
const bluetooth = require('node-bluetooth');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();

var livingClient = false;
var nbClientWeb = 0;
var nbClientTCP = 0;

function init() {
    console.log('TCP live init on', PORT_LIVE + 1);

    device.listPairedDevices(console.log);

    device.findSerialPortChannel('30:AE:A4:2D:48:4A', function(channel) {
        console.log('Found RFCOMM channel for serial port on %s: ', 'ESP32', channel);
    });

    var server = net.createServer(function(socket) {
        socket.pipe(socket);

        if (clientConnected(socket)) {
            socket.on('data', function (data) {

                try {
                    send(JSON.parse(data.toString()), false);
                } catch(e) {}
            });

            socket.on('close', function () {
                clientDisconnected(socket, false);
            });

            socket.on('error', function () {
                // catch error, do nothing
            });
        } else {
            clientDisconnected(socket, true);
            socket.destroy();
        }
    });
    server.listen(PORT_LIVE + 1, '0.0.0.0');

    console.log('Web live init on', PORT_LIVE);
    io.on('connection', function (socket) {
        if (clientConnected(socket)) {
            socket.on('live', function (data) {
            });
                    socket.on('live', function (data)
                    {
                        if(data==false)
                        {
                            MODE=false;
                          //  console.log('mode :', MODE);
                        }
                        if(data==true)
                        {
                            MODE=true;
                          //  console.log('mode :', MODE);
                        }
                    //});
            if(MODE==false)
            {
                console.log('Je suis en mode Bluetooth');
                //Debut envoi Bluetooth
                bluetooth.connect('30:AE:A4:2D:48:4A',1, function(err, connection)
                {
                    if(err) return console.error(err);
                    socket.on('live', function (data)
                    {   
                        if(data==false)
                        {
                            MODE=false;
                          //  console.log('mode :', MODE);
                        }

                        connection.write( Buffer.from('\n', 'utf-8'), () => {}),
                        connection.write( Buffer.from(JSON.stringify(data), 'utf-8'), () =>
                        {
                            console.log("messsage envoye");
                        });
                    });

                });
            }
                //Fin Envoi Bluetooth
            if(MODE==true)
            {
                console.log('Je suis en mode USB');
                //Debut envoi USB
                 socket.on('live', function (data)
                    {
                        if(data==true)
                        {
                            MODE=true;
                            //console.log('mode :', MODE);
                        }
                        serialPort.write(JSON.stringify(data));
												//console.log('lecture : ',serialPort.read())
                    })


                //Fin Envoi USB
            }
						});
            socket.on('disconnect', function () {
                clientDisconnected(socket, false);
            })
        } else {
            clientDisconnected(socket, true);
            socket.disconnect();
        }
    });

    const app = express()
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET");
      next();
    });
    app.get('/color', function (req, res) {
        send([req.query[1], req.query[2], req.query[3]], false);
        res.send(true)
    })

    app.listen(80, function () {
        console.log('API live init on 80');
    })
}

function canLive() {
    return !ONLY_ONE_LIVE ||
        (ONLY_ONE_LIVE && nbClientTCP === 0 && nbClientWeb === 0 && !player.isPlaying());
}

function clientConnected(socket) {
    if (canLive()) {
        if (socket.remoteAddress === undefined) {
            nbClientWeb++;

            console.log('new client (WEB ' + socket.request.connection.remoteAddress + ') connected !');
        } else {
            nbClientTCP++;

            console.log('new client (TCP ' + socket.remoteAddress + ') connected !');
        }
        console.log(nbClientWeb + ' WEB clients connected / ' + nbClientTCP + ' TCP clients connected / Total ' + (nbClientWeb + nbClientTCP));

        utils.stop(true);

        return true;
    } else {
        return false;
    }
}

function send(data, isWeb) {

    try {
        if (!player.isPlaying()) {
        /*    if (isWeb) {
                data = data.slice(0, 3);
            }*/
            interface.send(data, function (err, res) {
                if (DEBUG_OUT) {
                    console.log('live OK', res, data);
                }

                if (err !== null) {
                    console.error('Erreur :', err);
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function clientDisconnected(socket, forced) {
    if (forced) {
        console.log('')
    }

    if (socket.remoteAddress === undefined) {
        nbClientWeb--;

        console.log('client (WEB ' + socket.request.connection.remoteAddress +') disconnected !');
    } else {
        nbClientTCP--;

        console.log('client (TCP ' + socket.remoteAddress + ') disconnected !');
    }
    console.log(nbClientWeb + ' WEB clients connected / ' + nbClientTCP + ' TCP clients connected / total ' + (nbClientWeb + nbClientTCP));

    interface.black();

    utils.initGetScenario();
}

module.exports = {
    init: init
};

const utils = require('./utils');
const interface = require('./interface');
const player = require('./player');
