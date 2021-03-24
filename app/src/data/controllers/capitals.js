import capitalsJS from '../datasets/capitals.js';
const capitals = capitalsJS.capitais

const capitaisAPI = {
    capital(lang) {
        return capitals[Math.floor(Math.random() * capitals.length)]
    }
}

export default capitaisAPI