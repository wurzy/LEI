import buzzwordsJS from '../datasets/buzzwords.js';
const buzzwords = buzzwordsJS.buzzwords

const buzzwordsAPI = {
    buzzword(){
        return buzzwords[Math.floor(Math.random() * buzzwords.length)]
    }
}

export default buzzwordsAPI