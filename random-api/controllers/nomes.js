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

module.exports.sobrenome = () => {
    return Nome
        .aggregate([
            { $sample: { size: 1 } },
            { $project: {_id: 0, sobrenome: "$sobrenome"}}
        ])
        .exec()
}

module.exports.nomeCompleto = () => {
    return Nome
        .aggregate([
            { $sample: { size: 1 } },
            { $addFields: {completo: {$concat: ["$nome", " ", "$sobrenome"]}}},
            { $project: {_id: 0, nome: "$completo"}}
        ])
        .exec()
}