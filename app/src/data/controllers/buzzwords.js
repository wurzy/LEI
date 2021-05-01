import buzzwordsJS from '../datasets/buzzwords.js';
const buzzwords = buzzwordsJS.buzzwords

import _ from 'lodash'

const buzzwordsAPI = {
    buzzword(lang, i, sample) {
        if (sample > -1) return _.sampleSize(buzzwords[lang], sample)
        return buzzwords[lang][Math.floor(Math.random() * buzzwords[lang].length)]
    }
}

export default buzzwordsAPI