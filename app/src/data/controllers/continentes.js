import continentesJS from '../datasets/continentes.js';
const continentes = continentesJS.continentes

const continentsAPI = {
   continent(lang){
       return continentes[Math.floor(Math.random() * continentes.length)]
   }
}

export default continentsAPI