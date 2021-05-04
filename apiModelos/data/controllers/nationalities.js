const nationalitiesJS = require('../datasets/nationalities.js');
const nationalities = nationalitiesJS.nationalities

const nationalitiesAPI = {
    nationality(lang, i) {
        return nationalities[lang][Math.floor(Math.random() * nationalities[lang].length)]
    },
    get(){
        return nationalities
    }
}

module.exports = nationalitiesAPI