var express = require('express');
var router = express.Router();
var fs = require("fs")
/* GET home page. */
router.get('/dir', function(req, res, next) {
  fs.mkdir("../../api/api/teste", (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    console.log('Directory created successfully!'); 
  }); 
  

});

router.post('/genAPI', (req, res) => {
  var apiname = req.body["nomeAPI"]
  
  
  fs.mkdir("/api/api/teste", (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    console.log('Directory created successfully!'); 
  }); 

  fs.writeFile('/../../helloworld.txt', 'Hello World!', function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });
  
  
  res.redirect('/alunos')

})   

module.exports = router;
