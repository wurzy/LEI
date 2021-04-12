var x = {if_2: true, demo: false}
var y = {demo: false}

const filteredArray = Object.keys(x).filter(e => !Object.keys(y).includes(e))

console.log(filteredArray)

/* var fs = require('fs')
fs.writeFile('fix.json', JSON.stringify(obj, null, 2), (err) => {
  if (err) throw err;
  console.log('Data written to file');
}); */