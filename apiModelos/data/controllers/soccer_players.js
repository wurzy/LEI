const playerJS = require('../datasets/soccer_players');
const players = playerJS.soccer_players

const soccer_playerAPI = {
    soccer_player(lang, i) {
        return players[Math.floor(Math.random() * players.length)]
    },
    get(){
        return players
    }
}

module.exports = soccer_playerAPI