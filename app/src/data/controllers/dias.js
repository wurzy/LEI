import diasJS from '../datasets/dias.js';
const dias = diasJS.dias

const Dias = {
   dia(){
       return dias[Math.floor(Math.random() * dias.length)]
   }
}

export default Dias