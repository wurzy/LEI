import religioesJS from '../datasets/religioes.js';
const religioes = religioesJS.religioes

const Religioes = {
   religiao(){
       return religioes[Math.floor(Math.random() * religioes.length)]
   }
}

export default Religioes