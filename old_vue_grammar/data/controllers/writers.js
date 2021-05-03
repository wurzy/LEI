import writersJS from '../datasets/writers.js';
const writers = writersJS.writers

import _ from 'lodash'

const writersAPI = {
    writer(lang, i, sample) {
        if (sample > -1) return _.sampleSize(writers, sample)
        return writers[Math.floor(Math.random() * writers.length)]
    }
}

export default writersAPI