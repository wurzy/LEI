import playerJS from '../datasets/soccer_players';
const players = playerJS.soccer_players

import _ from 'lodash'

const soccer_playerAPI = {
    soccer_player(lang, i, sample) {
        if (sample > -1) return _.sampleSize(players, sample)
        return players[Math.floor(Math.random() * players.length)]
    }
}

export default soccer_playerAPI