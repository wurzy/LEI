import mesesJS from '../datasets/meses.js';
const meses = mesesJS.meses

const monthsAPI = {
   mes(){
       return meses[Math.floor(Math.random() * meses.length)]
   }
}

export default monthsAPI