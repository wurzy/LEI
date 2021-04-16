import brandsJS from '../datasets/brands.js';
const brands = brandsJS.brands

const brandsAPI = {
    brand(lang, i) {
        return brands[Math.floor(Math.random() * brands.length)]
    }
}

export default brandsAPI