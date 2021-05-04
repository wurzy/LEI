const brandsJS = require('../datasets/brands.js');
const brands = brandsJS.brands

const brandsAPI = {
    brand(lang, i) {
        return brands[Math.floor(Math.random() * brands.length)]
    },
    get(){
        return brands
    }
}

module.exports = brandsAPI