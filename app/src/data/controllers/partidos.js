import partidosJS from '../datasets/partidos.js';
const partidos = partidosJS.partidos

const ptPoliticalPartiesAPI = {
    pt_political_party_abbr(lang){
        return partidos[Math.floor(Math.random() * partidos.length)].sigla
    },

    pt_political_party_name(lang){
        return partidos[Math.floor(Math.random() * partidos.length)].partido
    },

    pt_political_party(lang){
        return partidos[Math.floor(Math.random() * partidos.length)] 
    }
}

export default ptPoliticalPartiesAPI