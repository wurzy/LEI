import namesJS from '../datasets/names';
const names = namesJS.names

const namesAPI = {
    firstName(lang, i) {
        return names[lang].firstnames[Math.floor(Math.random() * names[lang].firstnames.length)]
    },

    surname(lang, i) {
        return names[lang].surnames[Math.floor(Math.random() * names[lang].surnames.length)]
    },

    fullName(lang, i) { return `${this.firstName(lang)} ${this.surname(lang)}` }
}

export default namesAPI