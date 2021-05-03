import partiesJS from '../datasets/pt_political_parties.js';
const parties = partiesJS.parties

const ptPoliticalPartiesAPI = {
    pt_political_party_abbr(lang, i) {
        return parties[Math.floor(Math.random() * parties.length)].abbr
    },

    pt_political_party_name(lang, i) {
        return parties[Math.floor(Math.random() * parties.length)].name
    },

    pt_political_party(lang, i) {
        return parties[Math.floor(Math.random() * parties.length)] 
    }
}

export default ptPoliticalPartiesAPI