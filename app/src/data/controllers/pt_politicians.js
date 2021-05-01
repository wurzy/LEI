import politiciansJS from '../datasets/pt_politicians';
const politicians = politiciansJS.politicians

import _ from 'lodash'

const pt_politicianAPI = {
    pt_politician(lang, i, sample) {
        if (sample > -1) return _.sampleSize(politicians, sample)
        return politicians[Math.floor(Math.random() * politicians.length)]
    }
}

export default pt_politicianAPI