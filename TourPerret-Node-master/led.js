const raspi = require('raspi');
const pwm = require('raspi-soft-pwm');

const leds = [
    [
        new pwm.SoftPWM('GPIO16'), // R3
        new pwm.SoftPWM('GPIO20'), // B3
        new pwm.SoftPWM('GPIO21'), // G3
    ],
    [
        new pwm.SoftPWM('GPIO13'), // R2
        new pwm.SoftPWM('GPIO19'), // G2
        new pwm.SoftPWM('GPIO26'), // B2
    ],
    [
        new pwm.SoftPWM('GPIO17'), // R1
        new pwm.SoftPWM('GPIO27'), // G1
        new pwm.SoftPWM('GPIO22'), // B1
    ],
];

console.log('Leds ready');

function send(color, callback, colorOrigin) {
    for (var etage = 0; etage < color.length; etage++) {
        for (var ledI = 0; ledI < color[etage].length - 1; ledI++) {
            var led = leds[etage][ledI];
            var colorVal = color[etage][ledI] / 255;

            led.write(colorVal);
        }
    }

    if (DEBUG_OUT_DATA) {
        console.log(color);
    }

    if (callback) {
        callback(null, true);
    }
}

function close() {
    // do something if necessary
}

module.exports = {
    send: send,
    close: close
};
