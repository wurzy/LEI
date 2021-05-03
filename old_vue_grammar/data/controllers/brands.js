import brandsJS from '../datasets/brands.js';
const brands = brandsJS.brands

import _ from 'lodash'

const brandsAPI = {
    brand(lang, i, sample) {
        if (sample > -1) return _.sampleSize(brands, sample)
        return brands[Math.floor(Math.random() * brands.length)]
    }
}

export default brandsAPI