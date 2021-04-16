import nationalitiesJS from '../datasets/nationalities.js';
const nationalities = nationalitiesJS.nationalities

const nationalitiesAPI = {
    nationality(lang, i) {
        return nationalities[lang][Math.floor(Math.random() * nationalities[lang].length)]
    }
}

export default nationalitiesAPI