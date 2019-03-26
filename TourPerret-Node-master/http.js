const request = require('request');

var timerGet = null;

function initGetScenario() {
    stop();
    console.log('get scenario from', URL, ' in', TIME_BETWEEN_EACH_SCENARIO);
    timerGet = setTimeout(getScenario, TIME_BETWEEN_EACH_SCENARIO);
}

function getScenario() {
    console.log('getting...');
    request(URL, function (error, response, body) {
       console.log(body);
        try {
            var scenarios = JSON.parse(body);
            console.log('scenario :',scenarios);
                if (scenarios.length > 0) {
                console.log('ok, prepare scenario ...');

                var scenario = [];

                for (var i = 0; i < scenarios.length; i++) {
                    scenario.push(BLACK_ALL_MINIMUM);

                    for (var j = 0; j < scenarios[i].length; j++) {
                        scenario.push(scenarios[i][j]);
                    }

                    scenario.push(BLACK_ALL_LONG);
                }

                stop();
                player.play(scenario, 0, false);
            } else {
                console.log('get nothing');
                initGetScenario();
            }
        } catch (e) {
            console.error('get error', e, body);
            initGetScenario();
        }
    }).auth('curious', 'perret');
}

function stop() {
    if (timerGet) {
        clearTimeout(timerGet);
        timerGet = null;

        console.log('get stop');
    }
}

module.exports = {
    initGetScenario: initGetScenario,
    getScenario: getScenario,
    stop: stop
};

const player = require('./player');
