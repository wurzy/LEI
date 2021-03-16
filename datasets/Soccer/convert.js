const fs = require('fs')
const txt1 = fs.readFileSync('./de.1.clubs.txt').toString().split(/\r?\n/)
const txt2 = fs.readFileSync('./en.1.clubs.txt').toString().split(/\r?\n/)
const txt3 = fs.readFileSync('./es.1.clubs.txt').toString().split(/\r?\n/)
const txt4 = fs.readFileSync('./it.1.clubs.txt').toString().split(/\r?\n/)
const txt5 = fs.readFileSync('./pt.txt').toString().split(/\r?\n/)

var json = []

json.push(
    {
        pais: "Alemanha",
        clubes: txt1
    }, 
    {
        pais: "Inglaterra",
        clubes: txt2
    }, 
    {
        pais: "Espanha",
        clubes: txt3
    }, 
    {
        pais: "Itália",
        clubes: txt4
    }, 
    {
        pais: "Portugal",
        clubes: txt5
    }
)

fs.writeFileSync('./clubes.json',JSON.stringify(json,null,2))