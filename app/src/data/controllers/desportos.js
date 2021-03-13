import desportosJS from '../datasets/desportos.js';
const desportos = desportosJS.desportos

const Desportos = {
   dia(){
       return desportos[Math.floor(Math.random() * desportos.length)]
   }
}

export default Desportos