const buzzwordsJS = require('../datasets/buzzwords.js');
const buzzwords = buzzwordsJS.buzzwords

const buzzwordsAPI = {
    buzzword(lang, i) {
        return buzzwords[lang][Math.floor(Math.random() * buzzwords[lang].length)]
    }
}

module.exports = buzzwordsAPI