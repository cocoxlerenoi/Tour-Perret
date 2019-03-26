const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = 210, pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

console.log('start');

process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(function () { process.exit(0); });
});

var c = 0;

setInterval(function() {
    c += (1 + c) % 255;
    for (var i = 0; i < NUM_LEDS; i++) {
        pixelData[i] = (c << 16) + (c << 8) + c;
    }

    ws281x.render(pixelData);
}, 1000);
