import hackerJS from '../datasets/hackers';
const hackers = hackerJS.hackers

import _ from 'lodash'

const hackersAPI = {
    hacker(lang, i, sample) {
        if (sample > -1) return _.sampleSize(hackers, sample)
        return hackers[Math.floor(Math.random() * hackers.length)]
    }
}

export default hackersAPI