var fs = require('fs')
var txt = fs.readFileSync('./listaNomesVal2.txt').toString().split(/\r?\n/)
var finalJSON = []
txt.forEach(nomeCompleto => {
    let [nome, ...sobrenome] = nomeCompleto.split(' ')
    sobrenome = sobrenome.join(' ')
    finalJSON.push({nome: nome, sobrenome: sobrenome})
})

fs.writeFileSync('./listaNomes.json',JSON.stringify(finalJSON,null,2))