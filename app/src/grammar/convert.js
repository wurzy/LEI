/**
 * Transforms DSL JSON-like to JSON Dataset
 * @param {String} text 
*/
function convert(text,parser) {
    console.log(JSON.stringify(parser.parse(text)))
    return JSON.stringify(parser.parse(text),null,2)
}

module.exports = {
    convert
}