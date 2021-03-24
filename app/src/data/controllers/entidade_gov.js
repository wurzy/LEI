import entidadesJS from '../datasets/entidade_gov.js';
const entidades = entidadesJS.entidades_gov

const govEntitiesAPI = {
    gov_entity(lang){
        return entidades[Math.floor(Math.random() * entidades.length)]
    }
}

export default govEntitiesAPI