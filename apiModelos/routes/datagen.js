const express = require('express');
const router = express.Router();
const parser = require('../grammar/parser')
const xml = require('../grammar/jsonToXML')

// POST front-end route para obter a informação toda
router.post('/', function(req,res){
    console.log(req.body)
    let model = req.body 
    try {
        data = parser.parse(model)
        res.status(201).jsonp({...data})
    } catch (err) {
        res.status(404).jsonp(err)
    }
})

// POST para uso em aplicações
router.post('/json', function(req,res){
    let model = req.body 
    try {
        data = parser.parse(model)
        res.status(201).jsonp(data.dataModel.data)
    } catch (err) {
        res.status(404).jsonp(err)
    }
})

// POST para uso em aplicações
router.post('/xml', function(req,res){
    let model = req.body 
    try {
        data = parser.parse(model)
        xmlData = xml.jsonToXml(data.dataModel.data)
        res.status(201)
        res.type('application/xml')
        res.write(xmlData)
        res.end()
    } catch (err) {
        console.log(err)
        res.status(404).jsonp(err)
    }
})
/*
// POST para uso em aplicações
router.post('/csv', function(req,res){
    let model = req.body 
    try {
        data = parser.parse(model)
        res.status(201).jsonp(data.dataModel.data)
    } catch (err) {
        res.status(404).jsonp(err)
    }
})
*/
module.exports = router;