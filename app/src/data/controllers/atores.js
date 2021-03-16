import atoresJS from '../datasets/atores.js';
const atores = atoresJS.atores

const atoresAPI = {
   actor(){
       return atores[Math.floor(Math.random() * atores.length)]
   }
}

export default atoresAPI