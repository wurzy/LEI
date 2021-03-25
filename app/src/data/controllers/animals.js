import animalsJS from '../datasets/animals.js';
const animals = animalsJS.animals

const animalsAPI = {
    animal(lang) {
        return animals[lang][Math.floor(Math.random() * animals[lang].length)]
    }
}

export default animalsAPI