var express = require('express');
var router = express.Router();
var fs = require("fs")
/* GET home page. */


router.get('/dir/:nome', function(req, res, next) {
  fs.mkdir("../api/api/"+req.params.nome, (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    return console.log('Directory created successfully!'); 
  }); 
  return  console.error(""); 

});

router.post('/genAPI', function(req, res, next) {
  var apiname = req.body["api"]
  
  
  fs.mkdir("../../api/api/"+apiname, (err) => { 
    if (err) { 
        
        console.error(err); 
        return  res.redirect('/')
    } 
    console.log('Directory created successfully!'); 
    return   res.redirect('/')
 
  }); 
  
  console.log("err"); 
  return res.redirect('/')
 

})   

module.exports = router;
