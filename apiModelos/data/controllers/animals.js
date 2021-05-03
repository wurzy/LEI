const animalsJS = require('../datasets/animals.js');
const animals = animalsJS.animals

const animalsAPI = {
    animal(lang, i) {
        return animals[lang][Math.floor(Math.random() * animals[lang].length)]
    }
}

module.exports = animalsAPI