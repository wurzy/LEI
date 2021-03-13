const fs = require('fs')
const txt1 = fs.readFileSync('./listaNomesVal2.txt').toString().split(/\r?\n/)
const txt2 = fs.readFileSync('./FigurasPublicasPT.py').toString().split(/\r?\n/)
const txt3 = fs.readFileSync('./Futebolista.py').toString().split(/\r?\n/)
const txt4 = fs.readFileSync('./Pessoas - Vários.py').toString().split(/\r?\n/)
const txt5 = fs.readFileSync('./Político.py').toString().split(/\r?\n/)
const txt6 = fs.readFileSync('./Top100Portugueses.py').toString().split(/\r?\n/)
const txt7 = fs.readFileSync('./WorldTop100PublicPeople.py').toString().split(/\r?\n/)
const txt8 = fs.readFileSync('./ator.txt').toString().split(/\r?\n/)
const txt9 = fs.readFileSync('./empresario_pt.txt').toString().split(/\r?\n/)
const txt10 = fs.readFileSync('./escritor_estrangeiro.txt').toString().split(/\r?\n/)

var mega = txt1.concat(txt2,txt3,txt4,txt5,txt6,txt7,txt8,txt9,txt10)

var finalJSON = []
mega.forEach(nomeCompleto => {
    let [nome, ...apelido] = nomeCompleto.split(' ')
    apelido = apelido.join(' ')

    if(nome == "" || apelido == "") return

    finalJSON.push({nome: nome, apelido: apelido})
})

fs.writeFileSync('./listaNomes.json',JSON.stringify(finalJSON,null,2))