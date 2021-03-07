const mongoose = require('mongoose')

var concelhoSchema = new mongoose.Schema({
    concelho: String
  });

module.exports = mongoose.model('concelho', concelhoSchema)