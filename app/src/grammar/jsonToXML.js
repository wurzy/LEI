function jsonToXml(obj) { return jsonToXml2(obj,0) }

function jsonToXml2(obj, depth) {
    var xml = ''

    for (var prop in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop) || (obj[prop] != null && obj[prop] == undefined)) continue

        xml += '\t'.repeat(depth) + "<" + (Array.isArray(obj) ? `elem_${parseInt(prop)+1}` : prop) + ">\n"
        if (typeof obj[prop] == "object" && obj[prop] != null) xml += jsonToXml2(obj[prop], depth+1)
        else xml += convertXMLString(obj[prop], depth+1)
        xml += '\t'.repeat(depth) + "</" + (Array.isArray(obj) ? `elem_${parseInt(prop)+1}` : prop) + ">\n"
    }

    return xml
}

function convertXMLString(input, depth) {
    var xml = '\t'.repeat(depth)
    
    if (input == null) xml += "null"
    else if (typeof input === 'string') xml += '"' + input + '"'
    else xml += input

    return xml + '\n' //not a string
}

module.exports = { jsonToXml }