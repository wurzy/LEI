/**
 * Transforms DSL JSON-like to JSON Dataset
 * @param {String} text 
*/
function convert(text,parser) {
    return JSON.stringify(parser.parse(text),null,2)
}

module.exports = {
    convert
}