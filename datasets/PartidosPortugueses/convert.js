const fs = require('fs')
const txt = fs.readFileSync('./partidos.py').toString().split(/\r?\n/)

var finalJSON = []
txt.forEach(p => {
    let [sigla, partido] = p.split(':')

    if(sigla == "" || partido == "") return

    finalJSON.push({sigla: sigla, partido: partido})
})

fs.writeFileSync('./partidos.json',JSON.stringify(finalJSON,null,2))