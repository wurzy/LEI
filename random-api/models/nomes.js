const mongoose = require('mongoose')

var nomeSchema = new mongoose.Schema({
    nome: String,
    apelido: String
});

module.exports = mongoose.model('nome', nomeSchema)