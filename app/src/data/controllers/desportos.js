import desportosJS from '../datasets/desportos.js';
const desportos = desportosJS.desportos

const sportsAPI = {
   sport(lang){
       return desportos[Math.floor(Math.random() * desportos.length)]
   }
}

export default sportsAPI