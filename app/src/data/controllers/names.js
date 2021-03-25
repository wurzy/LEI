import namesJS from '../datasets/names';
const names = namesJS.names

const namesAPI = {
    firstName(lang) {
        return names[Math.floor(Math.random() * names.length)].name
    },

    surname(lang) {
        return names[Math.floor(Math.random() * names.length)].surname
    },

    fullName(lang) { return `${this.firstName()} ${this.surname()}` }
}

export default namesAPI