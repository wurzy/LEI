import escritoresJS from '../datasets/escritores.js';
const escritores = escritoresJS.escritores

const writersAPI = {
   writer(lang){
       return escritores[Math.floor(Math.random() * escritores.length)]
   }
}

export default writersAPI