const capitalsJS = require('../datasets/capitals.js');
const capitals = capitalsJS.capitals

const capitalsAPI = {
    capital(lang, i) {
        return capitals[Math.floor(Math.random() * capitals.length)]
    },
    get(){
        return capitals
    }
}

module.exports = capitalsAPI