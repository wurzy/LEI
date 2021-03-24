import religioesJS from '../datasets/religions.js';
const religioes = religioesJS.religioes

const religionsAPI = {
   religion(lang){
       return religioes[Math.floor(Math.random() * religioes.length)]
   }
}

export default religionsAPI