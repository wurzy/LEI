import musiciansJS from '../datasets/musicians';
const musicians = musiciansJS.musicians

import _ from 'lodash'

const musiciansAPI = {
    musician(lang, i, sample) {
        if (sample > -1) return _.sampleSize(musicians, sample)
        return musicians[Math.floor(Math.random() * musicians.length)]
    }
}

export default musiciansAPI