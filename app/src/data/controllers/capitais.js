import capitalsJS from '../datasets/capitais.js';
const capitals = capitalsJS.capitais

const capitaisAPI = {
   capital(){
       return capitals[Math.floor(Math.random() * capitals.length)]
   }
}

export default capitaisAPI