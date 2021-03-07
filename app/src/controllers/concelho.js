var Concelho = require('../models/concelho')

module.exports.getRandom = () => {
    return Concelho
        .aggregate([{ $sample: { size: 1 } }])
}