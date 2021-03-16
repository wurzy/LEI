import hackerJS from '../datasets/hacker';
const hackers = hackerJS.hackers

const hackersAPI = {
   hacker(){
       return hackers[Math.floor(Math.random() * hackers.length)]
   }
}

export default hackersAPI