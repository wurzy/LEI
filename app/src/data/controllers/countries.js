import countriesJS from '../datasets/countries.js';
const countries = countriesJS.countries

const countriesAPI = {
    country(lang) {
        return countries[lang][Math.floor(Math.random() * countries[lang].length)]
    }
}

export default countriesAPI