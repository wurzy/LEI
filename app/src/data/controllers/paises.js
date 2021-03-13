import paisesJS from '../datasets/paises.js';
const paises = paisesJS.paises

const Paises = {
   pais(){
       return paises[Math.floor(Math.random() * paises.length)]
   }
}

export default Paises