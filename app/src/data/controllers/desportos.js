import desportosJS from '../datasets/desportos.js';
const desportos = desportosJS.desportos

const sportsAPI = {
   sport(){
       return desportos[Math.floor(Math.random() * desportos.length)]
   }
}

export default sportsAPI