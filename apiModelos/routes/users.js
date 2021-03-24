var jwt = require('jsonwebtoken');
var passport = require('passport');
var express = require('express');
var router = express.Router();

const secret = 'LEI2021_SECRET_!_HASH'

// login de utilizador
router.post('/login', passport.authenticate('login-auth'), function(req, res) {
  if (req.user.success) {
    jwt.sign({
      _id: req.user.user._id,
      email: req.user.user.email,
      dataRegisto: req.user.user.dataRegisto,
      dataUltimoAcesso: req.user.user.dataUltimoAcesso,
      sub: 'LEI2021'}, 
      secret,
      {expiresIn: "1y"},
      function(e, token) {
        if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
        else res.status(201).jsonp({token})
    })
  }
  else res.status(500).jsonp({invalidInput: req.user.invalidInput, error: req.user.message}) 
})

// registo de utilizador
router.post('/registar', passport.authenticate('signup-auth'), function(req, res) {
  /*if (req.user.success) {
    jwt.sign({
      _id: req.user.user._id,
      email: req.user.user.email,
      sub: 'LEI2021'}, 
      secret,
      {expiresIn: "1y"},
      function(e, token) {
        if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
        else res.status(201).jsonp({token})
    })
  }*/
  if (req.user.success) {
    res.status(201).jsonp(req.user.user) 
  }
  else res.status(500).jsonp({invalidInput: req.user.invalidInput, error: req.user.message}) 
})

// obter informação contida no token
router.get('/:token', function(req,res) {
  jwt.verify(req.params.token,secret,function(e,decoded){
    if(e){
      res.status(404).jsonp({error: "O token é inválido: " + e})
    }
    else res.status(200).jsonp(decoded)
  })
})

module.exports = router;
