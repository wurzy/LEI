var x = {if_2: true, demo: false}
var y = {demo: false}


var chunkDifferent = (arr, sizes) => {
  sizes = sizes.map((sum => value => sum += value)(0))
  sizes.unshift(0)
  
  var chunks = []
  for (var i = 0; i < sizes.length - 1; i++) chunks.push(arr.slice(sizes[i], sizes[i+1]))
  return chunks
}

console.log(parseInt("-00009"))

"ola.x"
"['ola'].x"
"['ola']['x']"

/* var fs = require('fs')
fs.writeFile('fix.json', JSON.stringify(obj, null, 2), (err) => {
  if (err) throw err;
  console.log('Data written to file');
}); */