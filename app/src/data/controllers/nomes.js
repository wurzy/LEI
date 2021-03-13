import nomesJS from '../datasets/nomes';
const nomes = nomesJS.nomes
const Nomes = {
    nomeProprio(){
        return nomes[Math.floor(Math.random() * nomes.length)].nome
    },

    apelido(){
        return nomes[Math.floor(Math.random() * nomes.length)].apelido
    },

    nomeCompleto(){
        return `${this.nomeProprio()} ${this.apelido()}`
    }
}

export default Nomes