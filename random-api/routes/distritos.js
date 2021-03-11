var express = require('express');
var router = express.Router();
var Distrito = require('../controllers/distrito')

/* GET toda a informação dos distritos */
router.get('/', function(req, res, next) {
  Distrito.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

/* GET distrito aleatório */
router.get('/distrito', function(req, res, next) {
  Distrito.distrito()
    .then(dados => res.status(200).jsonp(dados[0])) // aggregation retorna array
    .catch(e => res.status(500).jsonp({error: e}))
});

/* GET concelho aleatório */
router.get('/concelho', function(req, res, next) {
  Distrito.concelho()
    .then(dados => res.status(200).jsonp(dados[0])) // aggregation retorna array
    .catch(e => res.status(500).jsonp({error: e}))
});

/* GET concelho aleatório de um distrito*/
router.get('/concelho/:distrito', function(req, res, next) {
  Distrito.concelhoParametrizado(req.params.distrito)
    .then(dados => res.status(200).jsonp(dados[0])) // aggregation retorna array
    .catch(e => res.status(500).jsonp({error: e}))
});

/* GET freguesia aleatória */
router.get('/freguesia', function(req, res, next) {
  Distrito.freguesia()
    .then(dados => res.status(200).jsonp(dados[0])) // aggregation retorna array
    .catch(e => res.status(500).jsonp({error: e}))
});

/* GET freguesia aleatória de um distrito */
router.get('/freguesia/distrito/:distrito', function(req, res, next) {
  Distrito.freguesiaParametrizada(req.params.distrito, "distrito")
    .then(dados => res.status(200).jsonp(dados[0])) // aggregation retorna array
    .catch(e => res.status(500).jsonp({error: e}))
});

/* GET freguesia aleatória de um concelho*/
router.get('/freguesia/concelho/:concelho', function(req, res, next) {
  Distrito.freguesiaParametrizada(req.params.concelho, "concelho")
    .then(dados => res.status(200).jsonp(dados[0])) // aggregation retorna array
    .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;