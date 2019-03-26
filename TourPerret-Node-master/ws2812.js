const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = NUMBER_LED_OFFSET_BOTTOM + NUMBER_LED_GAP_BETWEEN_ETAGE_AND_TOP + NUMBER_LED_BLUE_TOP +
                NUMBER_LED_ETAGES[0] + NUMBER_LED_ETAGES[1] + NUMBER_LED_ETAGES[2];

var colorsData = new Uint32Array(NUM_LEDS);
var iColorsData = 0;

ws281x.init(NUM_LEDS);

console.log('WS2812 ready');

function send(color, callback, colorOrigin) {
    iColorsData = 0;

    if (colorOrigin.length === NUMBER_LED_ETAGES.length) {
        sendNormal(colorOrigin);
    } else {
        sendSpecif(colorOrigin);
    }

    if (DEBUG_OUT_DATA) {
        console.log(colorsData);
    }

    try {
        ws281x.render(colorsData);
    } catch(e) {}


    if (callback) {
        callback(null, true);
    }
}

function sendNormal(colorOrigin) {
    for (var i = 0; i < NUMBER_LED_OFFSET_BOTTOM; i++) {
        colorsData[iColorsData++] = 0;
    }

    for (var etage = 0; etage < colorOrigin.length; etage++) {
        for (var i = 0; i < NUMBER_LED_ETAGES[etage]; i++) {
            colorsData[iColorsData++] = colorOrigin[etage];
        }
    }

    for (var i = 0; i < NUMBER_LED_GAP_BETWEEN_ETAGE_AND_TOP; i++) {
        colorsData[iColorsData++] = 0;
    }

    for (var i = 0; i < NUMBER_LED_BLUE_TOP; i++) {
        colorsData[iColorsData++] = 255; // Blue
    }
}

function sendSpecif(colorOrigin) {
    if (colorOrigin.length === 2) {
        if (colorOrigin[1] < NUM_LEDS) {
            colorsData[(INVERT_ETAGES ? NUM_LEDS - colorOrigin[1] : colorOrigin[1])] = colorOrigin[0];
        } else {
            console.log('Reçu une commande pour la led ' + colorOrigin[1] + '. Il n\'y en a que ' + NUM_LEDS + ' !');
        }
    } else {
        if (colorOrigin.length > NUM_LEDS) {
            console.log('Reçu un tableau trop grand ' + colorOrigin.length + ' leds. Il n\'y en a que ' + NUM_LEDS + ' !');
        }

        for (var i = 0; i < Math.min(NUM_LEDS, colorOrigin.length); i++) {
            colorsData[(INVERT_ETAGES ? NUM_LEDS - i : i)] = colorOrigin[i];
        }
    }
}

function close() {
    ws281x.reset();
}

module.exports = {
    send: send,
    close: close
};
