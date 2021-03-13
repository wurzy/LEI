import buzzwordsJS from '../datasets/buzzwords.js';
const buzzwords = buzzwordsJS.buzzwords

const Buzzwords = {
    buzzword(){
        return buzzwords[Math.floor(Math.random() * buzzwords.length)]
    }
}

export default Buzzwords