const fs = require('fs')
const txt = fs.readFileSync('./marcas.txt').toString().split(/\r?\n/)
const txt2 = fs.readFileSync('./carros.txt').toString().split(/\r?\n/)

var finalJSON = {}
var array = []
txt.forEach(m => {
    if(m == "") return
    array.push(m)
})
finalJSON["marcas"] = array

fs.writeFileSync('./marcas.json',JSON.stringify(finalJSON,null,2))

finalJSON = {}
array = []
txt2.forEach(m => {
    if(m == "") return
    array.push(m)
})
finalJSON["carros"] = array

fs.writeFileSync('./carros.json',JSON.stringify(finalJSON,null,2))