import centersJS from '../datasets/cultural_centers.js';
const centers = centersJS.cultural_centers

import _ from 'lodash'

const cultural_centersAPI = {
    cultural_center(lang, i, sample) {
        if (sample > -1) return _.sampleSize(centers[lang], sample)
        return centers[lang][Math.floor(Math.random() * centers[lang].length)]
    }
}

export default cultural_centersAPI