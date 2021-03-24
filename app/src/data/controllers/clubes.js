import clubesJS from '../datasets/clubes.js';
const clubs = clubesJS.clubes

const soccer_clubsAPI = {
   soccer_club(lang){
       const clubArray = clubs[Math.floor(Math.random() * clubs.length)].clubes
       return clubArray[Math.floor(Math.random() * clubArray.length)]
   },

   soccer_club_from(lang, country){
       for (let c of clubs){
           if (c.pais.toLowerCase() === country.toLowerCase()){
                return c.clubes[Math.floor(Math.random() * c.clubes.length)]
           }
       }
   }
}

export default soccer_clubsAPI