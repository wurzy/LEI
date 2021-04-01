import pt_entities from '../datasets/pt_entities.js';
const entitites = pt_entities.pt_entities

const pt_entitiesAPI = {
    pt_entity(lang) {
        return entitites[Math.floor(Math.random() * entitites.length)].designacao
    }
}

export default pt_entitiesAPI