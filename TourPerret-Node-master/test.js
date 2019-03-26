const raspi = require('raspi');
const pwm = require('raspi-soft-pwm');

console.log('start');
var ledI = 0;
var etageI = 0;

raspi.init(() => {
    leds = [
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

    setInterval(function () {
        console.log(etageI, ledI);

        for (var i = 0; i < 3; i++) {
            for (var ii = 0; ii < 3; ii++) {
                leds[i][ii].write(0);
            }
        }

        leds[etageI][ledI].write(0.1);

        ledI++;
        if (ledI == 3) {
            ledI = 0;
            etageI++;
        }

        if (etageI == 3) {
            etageI = 0;
        }
    }, 1000);
});
