const mongoose = require('mongoose')

var freguesiaSchema = new mongoose.Schema({
    freguesia: String
  });

module.exports = mongoose.model('freguesia', freguesiaSchema)