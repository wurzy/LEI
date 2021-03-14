import continentesJS from '../datasets/continentes.js';
const continentes = continentesJS.continentes

const continentsAPI = {
   continent(){
       return continentes[Math.floor(Math.random() * continentes.length)]
   }
}

export default continentsAPI