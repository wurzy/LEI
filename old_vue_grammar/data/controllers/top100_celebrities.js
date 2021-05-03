import top100JS from '../datasets/top100_celebrities';
const top100 = top100JS.top100_celebrities

import _ from 'lodash'

const top100_celebritiesAPI = {
    top100_celebrity(lang, i, sample) {
        if (sample > -1) return _.sampleSize(top100, sample)
        return top100[Math.floor(Math.random() * top100.length)]
    }
}

export default top100_celebritiesAPI