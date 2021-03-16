import nomesJS from '../datasets/nomes';
const nomes = nomesJS.nomes
const namesAPI = {
    firstName(){
        return nomes[Math.floor(Math.random() * nomes.length)].nome
    },

    surname(){
        return nomes[Math.floor(Math.random() * nomes.length)].apelido
    },

    fullName(){
        return `${this.firstName()} ${this.surname()}`
    }
}

export default namesAPI