import partidosJS from '../datasets/partidos.js';
const partidos = partidosJS.partidos

const Partidos = {
    sigla(){
        return partidos[Math.floor(Math.random() * partidos.length)].sigla
    },

    partido(){
        return partidos[Math.floor(Math.random() * partidos.length)].partido
    },

    partidoCompleto(){
        return partidos[Math.floor(Math.random() * partidos.length)] 
    }
}

export default Partidos