import nomesJS from '../datasets/nomes';
const nomes = nomesJS.nomes
const namesAPI = {
    firstName(lang){
        return nomes[Math.floor(Math.random() * nomes.length)].nome
    },

    surname(lang){
        return nomes[Math.floor(Math.random() * nomes.length)].apelido
    },

    fullName(lang){
        return `${this.firstName()} ${this.surname()}`
    }
}

export default namesAPI