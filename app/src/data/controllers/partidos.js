import partidosJS from '../datasets/partidos.js';
const partidos = partidosJS.partidos

const ptPoliticalPartiesAPI = {
    abbreviation(){
        return partidos[Math.floor(Math.random() * partidos.length)].sigla
    },

    politicalPartyName(){
        return partidos[Math.floor(Math.random() * partidos.length)].partido
    },

    politicalParty(){
        return partidos[Math.floor(Math.random() * partidos.length)] 
    }
}

export default ptPoliticalPartiesAPI