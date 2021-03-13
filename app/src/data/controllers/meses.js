import mesesJS from '../datasets/meses.js';
const meses = mesesJS.meses

const Meses = {
   mes(){
       return meses[Math.floor(Math.random() * meses.length)]
   }
}

export default Meses