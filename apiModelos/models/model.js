const mongoose = require('mongoose')

var modelSchema = new mongoose.Schema({
    colname: {type: String, required: true},
    modelo: {type: String, required: true},
    componentes: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"user" ,required: true},
    visibilidade: {type: Boolean, required: true},
    titulo: {type: String, required: true},
    descricao: {type: String, required: true},
    dataCriacao: {type: Date, required: true}
});

module.exports = mongoose.model('model', modelSchema)