/**
 * Transforms DSL JSON-like to JSON Dataset
 * @param {String} text 
*/
function convert(text,parser) {
    return parser.parse(text)
}

module.exports = { convert }