import religionsJS from '../datasets/religions.js';
const religions = religionsJS.religions

import _ from 'lodash'

const religionsAPI = {
    religion(lang, i, sample) {
        if (sample > -1) return _.sampleSize(religions[lang], sample)
        return religions[lang][Math.floor(Math.random() * religions[lang].length)]
    }
}

export default religionsAPI