import clubsJS from '../datasets/soccer_clubs.js';
const clubs = clubsJS.soccer_clubs

const soccer_clubsAPI = {
    soccer_club(lang) {
        const clubArray = clubs[Math.floor(Math.random() * clubs.length)].clubs
        return clubArray[Math.floor(Math.random() * clubArray.length)]
    },

    soccer_club_from(lang, country) {
        country = country.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        for (let c of clubs) {
            for (let i = 0; i < c.country.length; i++) {
                if (c.country[i] == country) return c.clubs[Math.floor(Math.random() * c.clubs.length)]
            }
        }
    }
}

export default soccer_clubsAPI