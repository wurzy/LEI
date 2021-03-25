import capitalsJS from '../datasets/capitals.js';
const capitals = capitalsJS.capitals

const capitalsAPI = {
    capital(lang) {
        return capitals[Math.floor(Math.random() * capitals.length)]
    }
}

export default capitalsAPI