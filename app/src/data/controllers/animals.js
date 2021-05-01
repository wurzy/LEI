import animalsJS from '../datasets/animals.js';
const animals = animalsJS.animals

import _ from 'lodash'

const animalsAPI = {
    animal(lang, i, sample) {
        if (sample > -1) return _.sampleSize(animals, sample)
        return animals[Math.floor(Math.random() * animals.length)]
    }
}

export default animalsAPI