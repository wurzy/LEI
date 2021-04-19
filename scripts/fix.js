var x = {if_2: true, demo: false}
var y = {demo: false}


var data = require('./dataset.json')
var id = 1
data.ligações.forEach(l => {
  let o = l.origem, de = l.destino, di = l.distância
  delete l.origem
  delete l.destino
  delete l.distância
  l.origem = o
  l.destino = de
  l.distância = di
})

var fs = require('fs')
fs.writeFile('dataset.json', JSON.stringify(data, null, 2), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});