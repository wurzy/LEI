import paisesJS from '../datasets/paises.js';
const paises = paisesJS.paises

const countriesAPI = {
   country(){
       return paises[Math.floor(Math.random() * paises.length)]
   }
}

export default countriesAPI