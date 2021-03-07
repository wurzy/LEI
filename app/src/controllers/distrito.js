var Distrito = require('../models/distrito')

module.exports.getRandom = () => {
    return Distrito
        .aggregate([{ $sample: { size: 1 } }])
}