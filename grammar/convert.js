var parser = require("./parser.js")

/**
 * Transforms DSL JSON-like to JSON Dataset
 * @param {String} text 
*/
function convert(text) {
    console.log(JSON.stringify(parser.parse(text)))
    return JSON.stringify(parser.parse(text),null,2)
}

convert(`[
    {
       _id: '{{objectId()}}',
       guid: '{{guid()}}',
       boleano: '{{bool()}}',
       inteiro: '{{integer(30,70)}}',
       float_2args: '{{floating(-180.0451, 180)}}',
       float_3args: '{{floating(-180.0451, 180, 2)}}',
       float_4args: '{{floating(1000, 4000, 2, "£0,0.00")}}',
       aleatorio: '{{random("blue", null, true, false, 23, 17.56)}}',
       lorem_palavras: '{{lorem(4,"words")}}',
       lorem_frases: '{{lorem(3,"sentences")}}',
       lorem_paragrafos: '{{lorem(2,"paragraphs")}}'
    }
   ]`)

module.exports = {
    convert
}