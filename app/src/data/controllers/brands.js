import brandsJS from '../datasets/brands.js';
const brands = brandsJS.brands

const brandsAPI = {
    brand(lang) {
        return brands[Math.floor(Math.random() * brands.length)]
    }
}

export default brandsAPI