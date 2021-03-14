import partidosJS from '../datasets/partidos.js';
const partidos = partidosJS.partidos

const ptPoliticalPartiesAPI = {
    pt_political_party_abbr(){
        return partidos[Math.floor(Math.random() * partidos.length)].sigla
    },

    pt_political_party_name(){
        return partidos[Math.floor(Math.random() * partidos.length)].partido
    },

    pt_political_party(){
        return partidos[Math.floor(Math.random() * partidos.length)] 
    }
}

export default ptPoliticalPartiesAPI