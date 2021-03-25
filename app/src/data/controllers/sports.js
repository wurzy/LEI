import sportsJS from '../datasets/sports.js';
const sports = sportsJS.sports

const sportsAPI = {
    sport(lang) {
        return sports[lang][Math.floor(Math.random() * sports[lang].length)]
    }
}

export default sportsAPI