function stop(mustBeBlack) {
    if (mustBeBlack) {
        console.log('BLACK');
        interface.black();
    }
    player.stop();
    http.stop();
}

function close() {
    stop(true);
    interface.close();
}

function initGetScenario() {
    if (INTERNET_ALLOWED) {
        stop(true);
        http.initGetScenario();
    }
}

function convertColorsArrayToArrayRGB(colorsArray) {
    var newColorsArray = [];

    for (var i = 0; i < colorsArray.length; i++) {
        newColorsArray[(INVERT_ETAGES ? colorsArray.length - i : i)] = getColorFromNumber(colorsArray[i]);
    }

    return newColorsArray;
}

function getColorFromNumber(color) {
    var c = [
        (color & (255 << 16)) >> 16,
        (color & (255 << 8)) >> 8,
        color & 255,
        0
    ];

    for (var i = 0; i < 3; i++) {
        if (c[i] < ZERO_LED) {
            c[i] = ZERO_LED;
        }
    }

    if (USE_WHITE && c[0] >= 240 && c[1] >= 240 && c[2] >= 240) {
        c[3] = Math.round(0.25 * c[0] + 0.5 * c[1] + 0.25 * c[2]);
    } else {
        c[3] = 0;
    }

    // https://www.quora.com/What-is-the-reasoning-behind-these-three-different-formulae-to-calculate-the-brightness-from-an-RGB-image
    // Couvenable
    // c[3] = Math.round(0.25 * c[0] + 0.5 * c[1] + 0.25 * c[2]);

    return c;
}

module.exports = {
    stop: stop,
    initGetScenario: initGetScenario,
    getColorFromNumber: getColorFromNumber,
    convertColorsArrayToArrayRGB: convertColorsArrayToArrayRGB,
    close: close
};

const http = require('./http');
const interface = require('./interface');
const player = require('./player');