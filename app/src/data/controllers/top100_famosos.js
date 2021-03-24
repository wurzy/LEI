import top100JS from '../datasets/top100_famosos';
const top100 = top100JS.top100_famosos

const top100_celebritiesAPI = {
   top100_celebrity(lang){
       return top100[Math.floor(Math.random() * top100.length)]
   }
}

export default top100_celebritiesAPI