const politicalPartiesJS = require('../datasets/political_parties');
const pparties = politicalPartiesJS.political_parties

const political_partiesAPI = {
     political_party(lang, i) {
          var country = pparties[Math.floor(Math.random() * pparties.length)]
          var party = JSON.parse(JSON.stringify(country.parties[Math.floor(Math.random() * country.parties.length)]))
          party.party_name = party.party_name[lang]
          return party
     },

     political_party_abbr(lang, i) {
          var country = pparties[Math.floor(Math.random() * pparties.length)]
          return country.parties[Math.floor(Math.random() * country.parties.length)].party_abbr
     },

     political_party_name(lang, i) {
          var country = pparties[Math.floor(Math.random() * pparties.length)]
          return country.parties[Math.floor(Math.random() * country.parties.length)].party_name[lang]
     },

     political_party_from(lang, i, country) {
          if (Array.isArray(country)) country = country[i]
          country = country.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()

          var countries = pparties.map(r => r.country)
          var index = countries.findIndex(arr => arr.includes(country))

          if (index > -1) {
               var party = pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)]
               party.party_name = party.party_name[lang]
               return party
          }
          else return "Invalid country"
     },

     political_party_from_abbr(lang, i, country) {
          if (Array.isArray(country)) country = country[i]
          country = country.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()

          var countries = pparties.map(r => r.country)
          var index = countries.findIndex(arr => arr.includes(country))

          if (index > -1) return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)].party_abbr
          else return "Invalid country"
     },
     
     political_party_from_name(lang, i, country) {
          if (Array.isArray(country)) country = country[i]
          country = country.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()

          var countries = pparties.map(r => r.country)
          var index = countries.findIndex(arr => arr.includes(country))

          if (index > -1) return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)].party_name[lang]
          else return "Invalid country"
     },
     get(){
         return pparties
     }
}

module.exports = political_partiesAPI