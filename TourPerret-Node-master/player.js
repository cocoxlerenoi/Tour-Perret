var timerPlayer = null;
var timerPlayerLater = null;

function play(scenario, avancement, reprise) {
    interface.send(scenario[avancement].slice(0, 3), function() {
        stop();

        console.log('Avancement ', avancement + '/' + (scenario.length - 1), 'Reprise :', reprise);

        if (scenario.length - 1 > avancement) { // -1 à cause du début
            timerPlayerLater = setTimeout(play, scenario[avancement][3], scenario, avancement + 1, false);
            timerPlayer = setTimeout(play, scenario[avancement][3] + 50, scenario, avancement + 1, true);
        } else {
            console.log('player stop');

            utils.initGetScenario();
        }
    });
}

function stop() {
    if (isPlaying()) {
        clearTimeout(timerPlayer);
        clearTimeout(timerPlayerLater);

        timerPlayer = null;
        timerPlayerLater = null;
    }
}

function isPlaying() {
    return timerPlayer !== null || timerPlayerLater !== null;
}

module.exports = {
    play: play,
    stop: stop,
    isPlaying: isPlaying
};

const interface = require('./interface');
const utils = require('./utils');
