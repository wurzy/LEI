import centersJS from '../datasets/cultural_centers.js';
const centers = centersJS.cultural_centers

const cultural_centersAPI = {
    cultural_center(lang, i) {
        return centers[lang][Math.floor(Math.random() * centers[lang].length)]
    }
}

export default cultural_centersAPI