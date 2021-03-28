var fs = require('fs');
var arr = require('./fix.json')

var obj = {}

arr.forEach(b => {
    obj[b.country] = b.parties.map(a => a.party_name);
})

fs.writeFile('fix.json', JSON.stringify(obj, null, 2), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});