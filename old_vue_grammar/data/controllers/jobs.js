import jobsJS from '../datasets/jobs';
const jobs = jobsJS.jobs

const jobsAPI = {
    job(lang, i) {
        return jobs[lang][Math.floor(Math.random() * jobs.length)]
    }
}

export default jobsAPI