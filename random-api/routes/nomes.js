var express = require('express');
var router = express.Router();
var Nome = require('../controllers/nomes')

/* GET todos os nomes */
router.get('/', function(req, res, next) {
    Nome.listar()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
});

/* GET nome próprio aleatório */
router.get('/nome', function(req, res, next) {
    Nome.nome()
      .then(dados => res.status(200).jsonp(dados[0])) // aggregate retorna array
      .catch(e => res.status(500).jsonp({error: e}))
});

/* GET apelido aleatório */
router.get('/apelido', function(req, res, next) {
    Nome.apelido()
      .then(dados => res.status(200).jsonp(dados[0])) // aggregate retorna array
      .catch(e => res.status(500).jsonp({error: e}))
});

/* GET nome completo aleatório */
router.get('/nomeCompleto', function(req, res, next) {
    Nome.nomeCompleto()
      .then(dados => res.status(200).jsonp(dados[0])) // aggregate retorna array
      .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;