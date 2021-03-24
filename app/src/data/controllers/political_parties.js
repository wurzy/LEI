import politicalPartiesJS from '../datasets/political_parties';
const pparties = politicalPartiesJS.political_parties

const political_partiesAPI = {
   political_party(lang){
        var country = pparties[Math.floor(Math.random() * pparties.length)]
        return country.parties[Math.floor(Math.random() * country.parties.length)]
   },

   political_party_abbr(lang){
        var country = pparties[Math.floor(Math.random() * pparties.length)]
        return country.parties[Math.floor(Math.random() * country.parties.length)].party_abbr
   },

   political_party_name(lang){
        var country = pparties[Math.floor(Math.random() * pparties.length)]
        return country.parties[Math.floor(Math.random() * country.parties.length)].party_name
   },

   political_party_from(lang, country){
       var countries = pparties.map(r => r.country)
       var index = countries.findIndex(r => country.toLowerCase() === r.toLowerCase())

       if (index > -1) return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)]
       else return "Invalid country"
   },

   political_party_from_abbr(lang, country){
        var countries = pparties.map(r => r.country)
        var index = countries.findIndex(r => country.toLowerCase() === r.toLowerCase())

        if (index > -1) return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)].party_abbr
        else return "Invalid country"
    },
    
    political_party_from_name(lang, country){
        var countries = pparties.map(r => r.country)
        var index = countries.findIndex(r => country.toLowerCase() === r.toLowerCase())

        if (index > -1) return pparties[index].parties[Math.floor(Math.random() * pparties[index].parties.length)].party_name
        else return "Invalid country"
    }
}

export default political_partiesAPI