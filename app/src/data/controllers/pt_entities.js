import pt_entities from '../datasets/pt_entities.js';
const entitites = pt_entities.pt_entities

const pt_entitiesAPI = {
    pt_entity(lang) {
        var entity = entitites[Math.floor(Math.random() * entitites.length)]
        return {
            abbr: entity.sigla,
            name: entity.designacao
        }
    },
    
    pt_entity_abbr(lang) {
        return entitites[Math.floor(Math.random() * entitites.length)].sigla
    },

    pt_entity_name(lang) {
        return entitites[Math.floor(Math.random() * entitites.length)].designacao
    }
}

export default pt_entitiesAPI