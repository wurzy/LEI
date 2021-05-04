const buzzwordsJS = require('../datasets/buzzwords.js');
const buzzwords = buzzwordsJS.buzzwords

const buzzwordsAPI = {
    buzzword(lang, i) {
        return buzzwords[lang][Math.floor(Math.random() * buzzwords[lang].length)]
    },
    get(){
        return buzzwords
    }
}

module.exports = buzzwordsAPI