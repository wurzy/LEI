const mongoose = require('mongoose')

var distritoSchema = new mongoose.Schema({
    distrito: String,
    concelhos: [{
        concelho: String,
        freguesias: [String]
    }]
});

module.exports = mongoose.model('distrito', distritoSchema)