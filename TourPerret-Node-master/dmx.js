const artnet = require('artnet')({
    host: DMX_IP,
    refresh: false,
    sendAll: true,
    sendDelayed: false
});

console.log('DMX ready');

// const colorsPredefined = {
//     16715776 : 15, // #FF4600 = R 255 G 16 B0 W 0 = lee filter 19
//     16733184 : 25, // #FFBE55 = R 255 G 84 B 0 W 0 = lee filter 20
//     16723970 : 35, // #FF6E46 = R 255 G 48 B 2 W 0 = lee filter 25
//     16723970 : 35, // #FFF500 = R 255 G 135 B 0 W 0 = lee filter 101
//     16723970 : 35, // #FFDC00 = R 255 G 130 B 0 W 0 = lee filter 104
//     16723970 : 35, // #F00032 = R 255 G 0 B 0 W 0 = lee filter 106
//     16723970 : 35, // #FF8CBE = R 255 G 0 B 0 W 97 = lee filter 111
//     16723970 : 35, // #FF0064 = R 255 G 3 B 3 W 8 = lee filter 113
//     16723970 : 35, // #00E1EB = R 0 G 250 B 52 W 40 = lee filter 118
//     16723970 : 35, // #78FA6E = R 115 G 255 B 0 W 19 = lee filter 122
//     16723970 : 35, // #BE009B = R 255 G 0 B 55 W 0 = lee filter 126
//     16723970 : 35, // #BE009B = R 232 G 197 B 49 W 37 = lee filter 137
//     16723970 : 35, // #BE009B = R 30 G 255 B 0 W 0 = lee filter 139
//     16723970 : 35, // #FCB98C = R 163 G 63 B 2 W 7 = lee filter 147
//     16723970 : 35, // #FFD5CF = R 255 G 110 B 0 W 76 = lee filter 154
//     16723970 : 35, // #5000AA = R 35 G 45 B 255 W 0 = lee filter 181
// };

function send(color, callback, colorOrigin) {
    color = getColorsArray(color, colorOrigin);

    artnet.set(color, function (err, res) {
        if (DEBUG_OUT_DATA) {
            console.log('DMX res :', res, 'color : ', color);
        }

        if (callback) {
            callback(err, res);
        }
    });
}

function getColorsArray(colors, colorsOrigin) {
    var colorsDMX = [];

    if (HAS_FIRST_THREE_WHITE_SPOTS) {
        for (var etage = 0; etage < colors.length; etage++) {
            colorsDMX.push(colors[etage][3]);
            // colorsDMX.push(0);
        }
    }

    for (var etage = 0; etage < colors.length; etage++) {
        for (var i = 0; i < NB_SPOTS_ETAGE; i++) {
            var colorRGB = colors[etage];

            // R, G, B, White
            for (var c = 0; c < 4; c++) {
                colorsDMX.push(colorRGB[c]);
            }

            if (IS_REAL_TOWER) {
                // Strobo = Shutter
                colorsDMX.push(255);
                // 30...119 --> 3,27s...30ms
                // colorsDMX.push(map(3270 - strobTime, 30, 3270, 30, 119);

                // Dimmer   255 = allumé
                colorsDMX.push(255);

                // Dimmer fine
                colorsDMX.push(0);

                // CCT correction color
                colorsDMX.push(0);

                // Macro color
                // if (colorsPredefined[colorsOrigin[etage]] !== null) {
                //     colorsDMX.push(colorsPredefined[colorsOrigin[etage]]);
                // } else {
                    colorsDMX.push(0);
                // }

                // Function & technic
                colorsDMX.push(0);
            }
        }
    }

    return colorsDMX;
}

function close() {
    artnet.close();
}

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

module.exports = {
    send: send,
    close: close
};
