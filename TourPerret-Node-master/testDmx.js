const options = {
    host: '10.7.183.210',
    refresh: false,
    sendAll: true,
    sendDelayed: false
};

const artnet = require('artnet')(options);

var colors = [];

create(0, 255, 25, true, true, true);
create(0, 255, 50, true);
create(0, 255, 50, false, true);
create(0, 255, 50, false, false, true);

test(0);

function create(min, max, step, ok1, ok2, ok3) {
    for (var i = min; i < max; i += step) {
        var c = 0;

        if (ok1) {
            c += i;
        }

        if (ok2) {
            c += i << 8
        }

        if (ok3) {
            c += i << 16;
        }
        colors.push([c, c, c]);
    }
}

function test(i) {
    setTimeout(function() {
        var colorArray = getColorsArray(colors[i]);
        artnet.set(colorArray, function (err, res) {

            console.log(colorArray, i);
            test((i + 1) % colors.length);
        });
    }, 500);
}

function getColorsArray(colorAllEtage) {
	var colors = [];

	for (var e = 0; e < 3; e++) {
	    colors.push(Math.random() * 255);
    }

    for (var i = 0; i < 12; i++) {

        for (var e = 0; e < 3; e++) {
            var colorRGB = getColorFromNumber(colorAllEtage[e]);

            for (var c = 0; c < colorRGB.length; c++) {
                colors.push(colorRGB[c]);
            }

            // Strobo = Shutter
            colors.push(255);
            // 30...119 --> 3,27s...30ms
            // colors.push(map(3270 - strobTime, 30, 3270, 30, 119);

            // Dimmer
            colors.push(255);

            // Dimmer fine
            colors.push(0);

            // CCT correction color
            colors.push(0);

            // Macro color
            // if (colorsPredefined[colorsOriginAllEtage[e]] !== null) {
            //     colors.push(colorsPredefined[colorsOriginAllEtage[e]]);
            // } else {
                colors.push(0);
            // }
            colors.push(0);
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