const top100JS = require('../datasets/top100_celebrities');
const top100 = top100JS.top100_celebrities

const top100_celebritiesAPI = {
    top100_celebrity(lang, i) {
        return top100[Math.floor(Math.random() * top100.length)]
    },
    get(){
        return top100
    }
}

module.exports = top100_celebritiesAPI