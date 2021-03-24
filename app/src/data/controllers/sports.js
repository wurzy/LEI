import desportosJS from '../datasets/sports.js';
const desportos = desportosJS.desportos

const sportsAPI = {
   sport(lang){
       return desportos[Math.floor(Math.random() * desportos.length)]
   }
}

export default sportsAPI