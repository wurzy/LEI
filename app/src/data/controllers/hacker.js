import hackerJS from '../datasets/hacker';
const hackers = hackerJS.hackers

const hackersAPI = {
   hacker(lang){
       return hackers[Math.floor(Math.random() * hackers.length)]
   }
}

export default hackersAPI