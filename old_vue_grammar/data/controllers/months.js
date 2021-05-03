import monthsJS from '../datasets/months.js';
const months = monthsJS.months

import _ from 'lodash'

const monthsAPI = {
    month(lang, i, sample) {
        if (sample > -1) return _.sampleSize(months[lang], sample)
        return months[lang][Math.floor(Math.random() * months[lang].length)]
    }
}

export default monthsAPI