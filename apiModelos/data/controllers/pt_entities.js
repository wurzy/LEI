const pt_entities = require('../datasets/pt_entities.js');
const entitites = pt_entities.pt_entities

const pt_entitiesAPI = {
    pt_entity(lang, i) {
        var entity = entitites[Math.floor(Math.random() * entitites.length)]
        return {
            abbr: entity.sigla,
            name: entity.designacao
        }
    },
    
    pt_entity_abbr(lang, i) {
        return entitites[Math.floor(Math.random() * entitites.length)].sigla
    },

    pt_entity_name(lang, i) {
        return entitites[Math.floor(Math.random() * entitites.length)].designacao
    },
    get(){
        return entitites
    }
}

module.exports = pt_entitiesAPI