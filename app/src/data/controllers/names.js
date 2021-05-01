import namesJS from '../datasets/names';
const names = namesJS.names

import _ from 'lodash'

const namesAPI = {
    firstName(lang, i, sample) {
        if (sample > -1) return _.sampleSize(names[lang].firstnames, sample)
        return names[lang].firstnames[Math.floor(Math.random() * names[lang].firstnames.length)]
    },

    surname(lang, i, sample) {
        if (sample > -1) return _.sampleSize(names[lang].surnames, sample)
        return names[lang].surnames[Math.floor(Math.random() * names[lang].surnames.length)]
    },

    fullName(lang, i, sample) {
        if (sample > -1) {
            let fstnames = _.sampleSize(names[lang].firstnames, sample)
            let surnames = _.sampleSize(names[lang].surnames, sample)
            return fstnames.map((d, i) => d + " " + surnames[i])
        }
        return `${this.firstName(lang, i, -1)} ${this.surname(lang, i, -1)}`
    }
}

export default namesAPI