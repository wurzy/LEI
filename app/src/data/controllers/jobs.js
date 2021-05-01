import jobsJS from '../datasets/jobs';
const jobs = jobsJS.jobs

import _ from 'lodash'

const jobsAPI = {
    job(lang, i, sample) {
        if (sample > -1) return _.sampleSize(jobs[lang], sample)
        return jobs[lang][Math.floor(Math.random() * jobs[lang].length)]
    }
}

export default jobsAPI