import continentsJS from '../datasets/continents.js';
const continents = continentsJS.continents

const continentsAPI = {
    continent(lang, i) {
        return continents[lang][Math.floor(Math.random() * continents[lang].length)]
    }
}

export default continentsAPI