import centrosJS from '../datasets/centro_cultural.js';
const centros = centrosJS.centros_culturais

const cultural_centersAPI = {
   cultural_center(lang){
       return centros[Math.floor(Math.random() * centros.length)]
   }
}

export default cultural_centersAPI