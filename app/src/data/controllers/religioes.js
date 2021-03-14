import religioesJS from '../datasets/religioes.js';
const religioes = religioesJS.religioes

const religionsAPI = {
   religion(){
       return religioes[Math.floor(Math.random() * religioes.length)]
   }
}

export default religionsAPI