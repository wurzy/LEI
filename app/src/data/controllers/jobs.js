import jobsJS from '../datasets/jobs';
const jobs = jobsJS.jobs

const jobsAPI = {
    job(lang) {
        return jobs[lang][Math.floor(Math.random() * jobs.length)]
    }
}

export default jobsAPI