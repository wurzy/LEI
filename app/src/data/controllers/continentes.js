import continentesJS from '../datasets/continentes.js';
const continentes = continentesJS.continentes

const Continentes = {
   continente(){
       return continentes[Math.floor(Math.random() * continentes.length)]
   }
}

export default Continentes