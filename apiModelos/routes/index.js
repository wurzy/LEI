var express = require('express');
var router = express.Router();
const fs = require("fs")
const fsEx = require('fs-extra')
/* GET home page. */


//router.get('/dir/:nome', function(req, res, next) {
//  fs.mkdir("../api/api/"+req.params.nome, (err) => { 
//    if (err) { 
//        return console.error(err); 
//    } 
//    return console.log('Directory created successfully!'); 
//  }); 
//  return  console.error(""); 
//
//});

router.post('/genAPI', function(req, res, next) {
  var apiname = req.body["api"]
  console.log("req.body :"+ apiname)
  
  //fsEx.copy('../api', '../'+apiname)
  //.then(() => console.log('folder criado com success!'))
  //.catch(err => console.error(err))

  fs.mkdir("../api/api/"+apiname, (err) => { 
    if (err) { 
      console.error(err); 
      return res.status(500).jsonp({error: err})
    } 
    console.log('Directory created successfully!'); 
    return res.status(201).jsonp({msg: "Directory created successfully!"})
  }); 
})   

module.exports = router;
