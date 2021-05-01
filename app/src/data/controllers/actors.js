import actorsJS from '../datasets/actors.js';
const actors = actorsJS.actors

import _ from 'lodash'

const actorsAPI = {
    actor(lang, i, sample) {
        if (sample > -1) return _.sampleSize(actors, sample)
        return actors[Math.floor(Math.random() * actors.length)]
    }
}

export default actorsAPI