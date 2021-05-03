const jobsJS = require('../datasets/jobs');
const jobs = jobsJS.jobs

const jobsAPI = {
    job(lang, i) {
        return jobs[lang][Math.floor(Math.random() * jobs.length)]
    }
}

module.exports = jobsAPI