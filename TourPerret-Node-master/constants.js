const isPi = require('detect-rpi');

if (isPi()) {
    global.INTERNET_ALLOWED = false;
    global.ZERO_LED = 0;
    global.USE_WHITE = false;

    require('./constants-specif');
} else {
    global.INTERFACE = 'DMX';
    global.INTERNET_ALLOWED = false;
    global.ZERO_LED = 6;
    global.IS_REAL_TOWER = true;
    global.HAS_FIRST_THREE_WHITE_SPOTS = true;
    global.NB_SPOTS_ETAGE = 4;
    global.INVERT_ETAGES = false;
    global.USE_WHITE = false;
    global.DMX_IP = '192.168.80.145';
    // global.DMX_IP = '10.7.183.210';
}

global.USE_COLOR_INSTEAD_BLACK = false;
global.TIME_BETWEEN_EACH_SCENARIO = 10 * 1000;
global.BLACK_ALL_MINIMUM = [0, 0, 0, 25];
global.BLACK_ALL_LONG = [0, 0, 0, TIME_BETWEEN_EACH_SCENARIO];
global.URL = 'http://tour-perret.fr/api/scenarios-elec-debug/10';
global.PORT_LIVE = 2609;
global.DEBUG_OUT = true;
global.DEBUG_OUT_DATA = false;
global.ONLY_ONE_LIVE = true;
