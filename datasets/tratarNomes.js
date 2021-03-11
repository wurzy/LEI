const fs = require('fs')
const txt1 = fs.readFileSync('./Person/listaNomesVal2.txt').toString().split(/\r?\n/)
const txt2 = fs.readFileSync('./Person/FigurasPublicasPT.py').toString().split(/\r?\n/)
const txt3 = fs.readFileSync('./Person/Futebolista.py').toString().split(/\r?\n/)
const txt4 = fs.readFileSync('./Person/Pessoas - Vários.py').toString().split(/\r?\n/)
const txt5 = fs.readFileSync('./Person/Político.py').toString().split(/\r?\n/)
const txt6 = fs.readFileSync('./Person/Top100Portugueses.py').toString().split(/\r?\n/)
const txt7 = fs.readFileSync('./Person/WorldTop100PublicPeople.py').toString().split(/\r?\n/)
const txt8 = fs.readFileSync('./Person/ator.txt').toString().split(/\r?\n/)
const txt9 = fs.readFileSync('./Person/empresario_pt.txt').toString().split(/\r?\n/)
const txt10 = fs.readFileSync('./Person/escritor_estrangeiro.txt').toString().split(/\r?\n/)

var mega = txt1.concat(txt2,txt3,txt4,txt5,txt6,txt7,txt8,txt9,txt10)

var finalJSON = []
mega.forEach(nomeCompleto => {
    let [nome, ...sobrenome] = nomeCompleto.split(' ')
    sobrenome = sobrenome.join(' ')

    if(nome == "" || sobrenome == "") return

    finalJSON.push({nome: nome, sobrenome: sobrenome})
})

fs.writeFileSync('./listaNomes.json',JSON.stringify(finalJSON,null,2))