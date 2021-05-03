const sportsJS =  require('../datasets/sports.js');
const sports = sportsJS.sports

const sportsAPI = {
    sport(lang, i) {
        return sports[lang][Math.floor(Math.random() * sports[lang].length)]
    }
}

module.exports = sportsAPI