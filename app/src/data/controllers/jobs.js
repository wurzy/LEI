import jobsJS from '../datasets/jobs';
const jobs = jobsJS.jobs

const jobsAPI = {
   job(){
       return jobs[Math.floor(Math.random() * jobs.length)]
   }
}

export default jobsAPI