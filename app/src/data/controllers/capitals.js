import capitalsJS from '../datasets/capitals.js';
const capitals = capitalsJS.capitals

import _ from 'lodash'

const capitalsAPI = {
    capital(lang, i, sample) {
        if (sample > -1) return _.sampleSize(capitals, sample)
        return capitals[Math.floor(Math.random() * capitals.length)]
    }
}

export default capitalsAPI