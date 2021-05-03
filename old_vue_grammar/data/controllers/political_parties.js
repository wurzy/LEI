import politicalPartiesJS from '../datasets/political_parties';
const pparties = politicalPartiesJS.political_parties

import _ from 'lodash'

function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

const political_partiesAPI = {
     political_party(lang, i, sample) {
          var parties = pparties.map(x => x.parties).flat()
          if (sample > -1) return _.sampleSize(pparties, sample).map(x => x.party_name = x.party_name[lang])
          
          var party = parties[Math.floor(Math.random() * parties.length)]
          party.party_name = party.party_name[lang]
          return party
     },

     political_party_abbr(lang, i, sample) {
          var parties = pparties.map(x => x.parties).flat()
          if (sample > -1) return _.sampleSize(pparties, sample).map(x => x.party_abbr)
          return parties[Math.floor(Math.random() * parties.length)].party_abbr
     },

     political_party_name(lang, i, sample) {
          var parties = pparties.map(x => x.parties).flat()
          if (sample > -1) return _.sampleSize(pparties, sample).map(x => x.party_name)
          return parties[Math.floor(Math.random() * parties.length)].party_name[lang]
     },

     political_party_from(lang, i, sample, country) {
          if (Array.isArray(country)) country = (sample > -1) ? country.map(x => normalize(x)) : normalize(country[i])
          else country = normalize(country)

          let countries = pparties.map(r => r.country)
          
          if (Array.isArray(country)) return country.map(c => {
               let index = countries.findIndex(arr => arr.includes(c))
               if (index > -1) {
                    let party = pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)]
                    party.party_name = party.party_name[lang]
                    return party
               }
          })
          else {
               let index = countries.findIndex(arr => arr.includes(country))
               if (index > -1) {
                    let parties = pparties[index].parties
                    if (sample > -1) return _.sampleSize(parties, sample).map(x => x.party_name = x.party_name[lang])

                    let party = parties[Math.floor(Math.random() * parties.length)]
                    party.party_name = party.party_name[lang]
                    return party
               }
          }
     },

     political_party_from_abbr(lang, i, sample, country) {
          if (Array.isArray(country)) country = (sample > -1) ? country.map(x => normalize(x)) : normalize(country[i])
          else country = normalize(country)

          var countries = pparties.map(r => r.country)
          
          if (Array.isArray(country)) return country.map(c => {
               let index = countries.findIndex(arr => arr.includes(c))
               if (index > -1)
                    return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)].party_abbr
          })
          else {
               let index = countries.findIndex(arr => arr.includes(country))
               if (index > -1) {
                    let parties = pparties[index].parties
                    if (sample > -1) return _.sampleSize(parties, sample).map(x => x.party_abbr)
                    return parties[Math.floor(Math.random() * parties.length)].party_abbr
               }
          }
     },
     
     political_party_from_name(lang, i, sample, country) {
          if (Array.isArray(country)) country = (sample > -1) ? country.map(x => normalize(x)) : normalize(country[i])
          else country = normalize(country)

          var countries = pparties.map(r => r.country)
          
          if (Array.isArray(country)) return country.map(c => {
               let index = countries.findIndex(arr => arr.includes(c))
               if (index > -1)
                    return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)].party_name[lang]
          })
          else {
               let index = countries.findIndex(arr => arr.includes(country))
               if (index > -1) {
                    let parties = pparties[index].parties
                    if (sample > -1) return _.sampleSize(parties, sample).map(x => x.party_name[lang])
                    return parties[Math.floor(Math.random() * parties.length)].party_name[lang]
               }
          }
     }
}

export default political_partiesAPI