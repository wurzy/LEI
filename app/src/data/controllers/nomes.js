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
        return `${this.nomeProprio()} ${this.apelido()}`
    }
}

export default namesAPI