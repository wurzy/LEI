import weekdaysJS from '../datasets/weekdays.js';
const weekdays = weekdaysJS.weekdays

import _ from 'lodash'

const weekdaysAPI = {
    weekday(lang, i, sample) {
        if (sample > -1) return _.sampleSize(weekdays[lang], sample)
        return weekdays[lang][Math.floor(Math.random() * weekdays[lang].length)]
    }
}

export default weekdaysAPI