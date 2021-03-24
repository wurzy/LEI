import top100JS from '../datasets/top100_portugueses';
const top100 = top100JS.top100_portugueses

const pt_top100_celebritiesAPI = {
   pt_top100_celebrity(lang){
       return top100[Math.floor(Math.random() * top100.length)]
   }
}

export default pt_top100_celebritiesAPI