import animaisJS from '../datasets/animais.js';
const animais = animaisJS.animais

const animalsAPI = {
   animal(){
       return animais[Math.floor(Math.random() * animais.length)]
   }
}

export default animalsAPI