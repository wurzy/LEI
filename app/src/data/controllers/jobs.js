import jobsJS from '../datasets/jobs';
const jobs = jobsJS.jobs

const jobsAPI = {
   job(lang){
       return jobs[Math.floor(Math.random() * jobs.length)]
   }
}

export default jobsAPI