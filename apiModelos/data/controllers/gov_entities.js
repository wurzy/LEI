const entitiesJS = require('../datasets/gov_entities.js');
const entities = entitiesJS.gov_entities

const govEntitiesAPI = {
    gov_entity(lang, i) {
        return entities[Math.floor(Math.random() * entities.length)]
    },
    get(){
        return entities
    }
}

module.exports = govEntitiesAPI