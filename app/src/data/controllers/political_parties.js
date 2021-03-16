import politicalPartiesJS from '../datasets/political_parties';
const pparties = politicalPartiesJS.political_parties

const political_partiesAPI = {
   political_party(){
       return pparties[Math.floor(Math.random() * pparties.length)]
   },

   political_party_abbreviation(){
       return pparties[Math.floor(Math.random() * pparties.length)].party_abbr
   },

   political_party_name(){
       return pparties[Math.floor(Math.random() * pparties.length)].party_name
   },

   political_party_from(country){
       var aux = pparties[Math.floor(Math.random() * pparties.length)]
       while (aux.country!=country){
           aux = pparties[Math.floor(Math.random() * pparties.length)]
       }
       return aux
   },

   political_party_abbreviation_from(country){
       var aux = pparties[Math.floor(Math.random() * pparties.length)]
       while (aux.country!=country){
           aux = pparties[Math.floor(Math.random() * pparties.length)]
       }
       return aux.party_abbr
    },
    
    political_party_name_from(country){
      var aux = pparties[Math.floor(Math.random() * pparties.length)]
      while (aux.country!=country){
          aux = pparties[Math.floor(Math.random() * pparties.length)]
      }
      return aux.party_name
    }
}

export default political_partiesAPI