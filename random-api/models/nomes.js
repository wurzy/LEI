const mongoose = require('mongoose')

var nomeSchema = new mongoose.Schema({
    nome: String,
    sobrenome: String
});

module.exports = mongoose.model('nome', nomeSchema)