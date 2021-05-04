const centersJS = require('../datasets/cultural_centers.js');
const centers = centersJS.cultural_centers

const cultural_centersAPI = {
    cultural_center(lang, i) {
        return centers[lang][Math.floor(Math.random() * centers[lang].length)]
    },
    get(){
        return centers
    }
}

module.exports = cultural_centersAPI