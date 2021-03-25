import entitiesJS from '../datasets/gov_entities.js';
const entities = entitiesJS.gov_entities

const govEntitiesAPI = {
    gov_entity(lang) {
        return entities[Math.floor(Math.random() * entities.length)]
    }
}

export default govEntitiesAPI