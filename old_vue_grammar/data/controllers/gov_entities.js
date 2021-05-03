import entitiesJS from '../datasets/gov_entities.js';
const entities = entitiesJS.gov_entities

import _ from 'lodash'

const govEntitiesAPI = {
    gov_entity(lang, i, sample) {
        if (sample > -1) return _.sampleSize(entities, sample)
        return entities[Math.floor(Math.random() * entities.length)]
    }
}

export default govEntitiesAPI