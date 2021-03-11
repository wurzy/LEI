var Nome = require('../models/nomes')

module.exports.listar = () => {
    return Nome
        .find()
        .exec()
}

module.exports.nome = () => {
    return Nome
        .aggregate([
            { $sample: { size: 1 } },
            { $project: {_id: 0, nome: "$nome"}}
        ])
        .exec()
}

module.exports.apelido = () => {
    return Nome
        .aggregate([
            { $sample: { size: 1 } },
            { $project: {_id: 0, apelido: "$apelido"}}
        ])
        .exec()
}

module.exports.nomeCompleto = () => {
    return Nome
        .aggregate([
            { $sample: { size: 1 } },
            { $addFields: {completo: {$concat: ["$nome", " ", "$apelido"]}}},
            { $project: {_id: 0, nome: "$completo"}}
        ])
        .exec()
}