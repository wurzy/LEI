var Freguesia = require('../models/freguesia')

module.exports.getRandom = () => {
    return Freguesia
        .aggregate([{ $sample: { size: 1 } }])
}