const entitiesJS = require('../datasets/gov_entities.js');
const entities = entitiesJS.gov_entities

const govEntitiesAPI = {
    gov_entity(lang, i) {
        return entities[Math.floor(Math.random() * entities.length)]
    }
}

module.exports = govEntitiesAPI