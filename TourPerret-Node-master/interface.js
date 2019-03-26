var interfaces = [];

function send(colors, callback) {
    var colorsConverted = utils.convertColorsArrayToArrayRGB(colors);

    if (DEBUG_OUT) {
        console.log('play ', colorsConverted, 'from ', colors);
    }

    for (var i = 0; i < interfaces.length; i++) {
        interfaces[i].send(colorsConverted, callback, colors);
    }
}

function black() {
    if (!USE_COLOR_INSTEAD_BLACK) {
        send([0, 0, 0]);
    } else {
        send([
            parseInt(((Math.random() * 255) << 16) + ((Math.random() * 255) << 8) + (Math.random() * 255)),
            parseInt(((Math.random() * 255) << 16) + ((Math.random() * 255) << 8) + (Math.random() * 255)),
            parseInt(((Math.random() * 255) << 16) + ((Math.random() * 255) << 8) + (Math.random() * 255))
        ]);
    }
}

function close() {
    for (var i = 0; i < interfaces.length; i++) {
        interfaces[i].close();
    }
}

module.exports = {
    send: send,
    black: black,
    close: close
};

const utils = require('./utils');

switch (INTERFACE) {
    case 'DMX':
        interfaces.push(require('./dmx'));
        break;

    case 'LED':
        interfaces.push(require('./led'));
        break;

    case 'WS2812':
        interfaces.push(require('./ws2812'));
        break;

    case 'LED+WS2812':
        interfaces.push(require('./led'));
        interfaces.push(require('./ws2812'));
        break;
}
