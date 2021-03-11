var Distrito = require('../models/distrito')

module.exports.listar = () => {
    return Distrito
        .find()
        .exec()
}

module.exports.freguesia = () => {
    return Distrito
        .aggregate([
            { $unwind: "$concelhos" },
            { $unwind: "$concelhos.freguesias" },
            { $sample: { size: 1 } },
            { $project: {_id: 0, freguesia: "$concelhos.freguesias"}}
        ])
        .exec()
}

module.exports.freguesiaParametrizada = (nome, tipo) => {
    if (tipo == "distrito") {
        return Distrito
            .aggregate([
                { $match: {distrito: nome}},
                { $unwind: "$concelhos" },
                { $unwind: "$concelhos.freguesias" },
                { $sample: { size: 1 } },
                { $project: {_id: 0, freguesia: "$concelhos.freguesias"}}
            ])
            .exec()
    }
    else if (tipo == "concelho") {
        return Distrito
            .aggregate([
                { $unwind: "$concelhos" },
                { $match: {"concelhos.concelho": nome}},
                { $unwind: "$concelhos.freguesias" },
                { $sample: { size: 1 } },
                { $project: {_id: 0, freguesia: "$concelhos.freguesias"}}
            ])
            .exec()
    }
    else return [{}]
}

module.exports.concelho = () => {
    return Distrito
        .aggregate([
            { $unwind: "$concelhos" },
            { $sample: { size: 1 } },
            { $project: {_id: 0, concelho: "$concelhos.concelho"}}
        ])
        .exec()
}

module.exports.concelhoParametrizado = (distrito) => {
    return Distrito
        .aggregate([
            { $match: {distrito: distrito}},
            { $unwind: "$concelhos" },
            { $sample: { size: 1 } },
            { $project: {_id: 0, concelho: "$concelhos.concelho"}}
        ])
        .exec()
}

module.exports.distrito = () => {
    return Distrito
        .aggregate([
            { $sample: { size: 1 } },
            { $project: {_id: 0, distrito: "$distrito"}}
        ])
        .exec()
}
