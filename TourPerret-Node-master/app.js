const ON_DEATH = require('death');

require('./constants');
const utils = require('./utils');
const live = require('./live');

console.log('start program');

utils.stop(true);
//utils.initGetScenario();
live.init();

const raspi = require('raspi');

ON_DEATH(function() {
    utils.close();
    console.log('end program');
    process.exit(0);
});
