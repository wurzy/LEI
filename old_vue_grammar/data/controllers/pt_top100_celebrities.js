import top100JS from '../datasets/pt_top100_celebrities';
const top100 = top100JS.pt_top100_celebrities

import _ from 'lodash'

const pt_top100_celebritiesAPI = {
    pt_top100_celebrity(lang, i, sample) {
        if (sample > -1) return _.sampleSize(top100, sample)
        return top100[Math.floor(Math.random() * top100.length)]
    }
}

export default pt_top100_celebritiesAPI