import countriesJS from '../datasets/countries.js';
const countries = countriesJS.countries

import _ from 'lodash'

const countriesAPI = {
    country(lang, i, sample) {
        if (sample > -1) return _.sampleSize(countries[lang], sample)
        return countries[lang][Math.floor(Math.random() * countries[lang].length)]
    }
}

export default countriesAPI