import sportsJS from '../datasets/sports.js';
const sports = sportsJS.sports

import _ from 'lodash'

const sportsAPI = {
    sport(lang, i, sample) {
        if (sample > -1) return _.sampleSize(sports[lang], sample)
        return sports[lang][Math.floor(Math.random() * sports[lang].length)]
    }
}

export default sportsAPI