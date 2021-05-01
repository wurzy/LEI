import continentsJS from '../datasets/continents.js';
const continents = continentsJS.continents

import _ from 'lodash'

const continentsAPI = {
    continent(lang, i, sample) {
        if (sample > -1) return _.sampleSize(continents[lang], sample)
        return continents[lang][Math.floor(Math.random() * continents[lang].length)]
    }
}

export default continentsAPI