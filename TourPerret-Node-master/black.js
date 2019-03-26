const options = {
    host: '192.168.80.145',
    refresh: false,
    sendAll: true,
    sendDelayed: false
};

const artnet = require('artnet')(options);

const BLACK_ALL = [0, 0, 0, 25];

artnet.set(getColorsArray(BLACK_ALL_MINIMUM), function(err, res) {
    artnet.close();
});

function getColorsArray(colorAllEtage) {
	var colors = [];

    for (var e = 0; e < 3; e++) {
        var colorRGB = getColorFromNumber(colorAllEtage[e]);

        for (var c = 0; c < colorRGB.length; c++) {
            colors.push(colorRGB[c]);
        }
    }

    return colors;
}

function getColorFromNumber(color) {
    var c = [
        (color & (255 << 16)) >> 16,
        (color & (255 << 8)) >> 8,
        color & 255,
        0
    ];

    return c;
}