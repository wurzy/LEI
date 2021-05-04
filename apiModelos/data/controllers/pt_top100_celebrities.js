const top100JS = require('../datasets/pt_top100_celebrities');
const top100 = top100JS.pt_top100_celebrities

const pt_top100_celebritiesAPI = {
    pt_top100_celebrity(lang, i) {
        return top100[Math.floor(Math.random() * top100.length)]
    },
    get(){
        return top100
    }
}

module.exports = pt_top100_celebritiesAPI