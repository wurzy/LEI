import paisesJS from '../datasets/paises.js';
const paises = paisesJS.paises

const countriesAPI = {
   country(lang){
       return paises[Math.floor(Math.random() * paises.length)]
   }
}

export default countriesAPI