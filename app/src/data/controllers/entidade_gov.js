import entidadesJS from '../datasets/entidade_gov.js';
const entidades = entidadesJS.entidades_gov

const EntidadesGov = {
    sigla(){
        return entidades[Math.floor(Math.random() * entidades.length)]
    }
}

export default EntidadesGov