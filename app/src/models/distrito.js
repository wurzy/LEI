const mongoose = require('mongoose')

var distritoSchema = new mongoose.Schema({
    distrito: String
  });

module.exports = mongoose.model('distrito', distritoSchema)