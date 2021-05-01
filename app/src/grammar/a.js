var val = [
  {data: ["Oceânia", "África", "América", "Europa", "Ásia", "Antártida"], model: {}},
  {data: [" - ", " - ", " - ", " - ", " - ", " - ", " - ", " - "], model: {}},
  {data: ["Lhama", "Esquilo", "Enguia", "Cação", "Bisão", "Frango", "Jacaré", "Tigre"], model: {}}
]

var strings = val.reduce((a, o) => (a.push(o.data), a), [])
var lengths = strings.map(x => x.length)
var product = lengths.reduce((x,y) => x*y)

var combinations = []
var n = lengths.map(x => Math.floor(Math.random() * (x - 0) + 0)).reduce((a,b) => String(a).concat(b))

//console.log(combineArrays(val.reduce((a, o) => (a.push(o.data), a), [])))

var _ = require('lodash')
console.log(_.sampleSize([1, 2, 3], 4))

//val.reduce((a, o) => (a.push(o.data), a), []).reduce((a, b) => a.map((v, i) => v + b[i]))