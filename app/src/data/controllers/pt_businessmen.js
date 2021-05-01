import businessmenJS from '../datasets/pt_businessmen.js';
const businessmen = businessmenJS.pt_businessmen

import _ from 'lodash'

const businessmenAPI = {
    pt_businessman(lang, i, sample) {
        if (sample > -1) return _.sampleSize(businessmen, sample)
        return businessmen[Math.floor(Math.random() * businessmen.length)]
    }
}

export default businessmenAPI