const countriesJS = require('../datasets/countries.js');
const countries = countriesJS.countries

const countriesAPI = {
    country(lang, i) {
        return countries[lang][Math.floor(Math.random() * countries[lang].length)]
    },
    get(){
        return countries
    }
}

module.exports = countriesAPI