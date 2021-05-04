const continentsJS = require('../datasets/continents.js');
const continents = continentsJS.continents

const continentsAPI = {
    continent(lang, i) {
        return continents[lang][Math.floor(Math.random() * continents[lang].length)]
    },
    get(){
        return continents
    }
}

module.exports = continentsAPI