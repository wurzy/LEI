import nationalitiesJS from '../datasets/nationalities.js';
const nationalities = nationalitiesJS.nationalities

import _ from 'lodash'

const nationalitiesAPI = {
    nationality(lang, i, sample) {
        if (sample > -1) return _.sampleSize(nationalities[lang], sample)
        return nationalities[lang][Math.floor(Math.random() * nationalities[lang].length)]
    }
}

export default nationalitiesAPI