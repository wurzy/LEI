import clubsJS from '../datasets/soccer_clubs.js';
const clubs = clubsJS.soccer_clubs

const soccer_clubsAPI = {
    soccer_club(lang) {
        const clubArray = clubs[Math.floor(Math.random() * clubs.length)].clubs
        return clubArray[Math.floor(Math.random() * clubArray.length)]
    },

    soccer_club_from(lang, country) {
        for (let c of clubs){
            if (c.country.toLowerCase() === country.toLowerCase()){
                    return c.clubs[Math.floor(Math.random() * c.clubs.length)]
            }
        }
    }
}

export default soccer_clubsAPI