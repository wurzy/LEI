// DSL Grammar
// ============

{
  var language = "pt" //"pt" or "en", "pt" by default
  var queue = []
  var queue_last = null

  function runSandboxCode(code) {
    /* var context = { x: 2 }
    vm.createContext(context)
    vm.runInContext(code, context)
    return context.result */
    return new Function(code)()
  }

  /* function resolveInterpolation(arr, i) {
    for (var j = 0; j < arr.length; j++) {
      if (isObject(arr[j])) {
        var value = resolveMoustaches(arr[j], i)
        arr[j] = (isObject(value)) ? JSON.stringify(value) : value
      }
    }
    return arr.join("")
  }*/

  function fillArray(api, sub_api, moustaches, args) {
    var arr = []
    for (var i = 0; i < queue_last; i++) {
      if (api == "gen") arr.push(genAPI[moustaches](...args))
      if (api == "data") arr.push(dataAPI[sub_api][moustaches](...args))
    }
    return arr
  }
}

// ----- 2. DSL Grammar -----

DSL_text
  = language value:object { return value }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
name_separator  = ws ":" ws
value_separator = ws "," ws
date_separator  = ws sep:("/" / "-" / ".") ws { return sep }

ws "whitespace" = [ \t\n\r]*

language
  = ws "<!LANGUAGE " lang:(("pt") / ("en")) ">" ws { return lang }

// ----- 3. Values -----

value
  = directive
  / false
  / null
  / true
  / object
  / array
  / number
  / string

simple_value
  = val:(false / null / true / number / string) { return val.data[0] }

false = "false" { return {model: {type: Boolean, required: true}, data: Array(queue_last).fill(false)} }
null  = "null"  { return {model: {type: String, required: false}, data: Array(queue_last).fill(null)} }
true  = "true"  { return {model: {type: Boolean, required: true}, data: Array(queue_last).fill(true)} }

// ----- 4. Objects -----

object
  = begin_object
    members:(
      head:member
      tail:(value_separator m:member { return m; })*
      {
        var result = {};

        [head].concat(tail).forEach(function(element) {
          result[element.name] = element.value;
        })

        return result;
      }
    )?
    end_object
    {
      var model = {type: {}, required: true}, values = []
      if (!queue.length) {
        for (var prop1 in members) {
          model[prop1] = members[prop1].model
          members[prop1] = members[prop1].data
        }
        values = members
      }
      else {
        for (var i = 0; i < queue_last; i++) values.push({})

        for (var prop2 in members) {
          model.type[prop2] = members[prop2].model
          var prob = "probability" in members[prop2]

          for (var j = 0; j < queue_last; j++) {
            if (!prob || (prob && members[prop2].data[j] !== null)) values[j][prop2] = members[prop2].data[j]
          }
        }
      }
      return members !== null ? {model, data: values} : {}
    }

member
  = name:key name_separator value:value_or_interpolation { return { name, value } }
  / probability / function_prop

value_or_interpolation
  = value / interpolation

// ----- 5. Arrays -----

array
  = begin_array
    arr:(
      head:value_or_interpolation
      tail:(value_separator v:value_or_interpolation { return v })*
      { return [head].concat(tail) }
    )?
    end_array
    {
      var model = {type: [], required: true}, values = []
      for (var i = 0; i < queue_last; i++) values.push([])

      for (var j = 0; j < arr.length; j++) {
        model.type.push(arr[j].model)
        for (var k = 0; k < queue_last; k++) values[k].push(arr[j].data[k])
      }

      return arr !== null ? {model, data: values} : []
    }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? {
    var num = parseFloat(text())
    return {model: {type: Number, required: true}, data: Array(queue_last).fill(num)}
  }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = decimal_point DIGIT+

int
  = integer:((zero* i:(digit1_9 DIGIT*) {return i}) / (i:zero zero* {return i})) {
    return parseInt(Array.isArray(integer) ? integer.flat().join("") : integer)
  }

minus
  = "-"

plus
  = "+"

zero
  = "0"

float_format
  = ws "\"0" int_sep:[^0-9] "0" dec_sep:[^0-9] "00" unit:[^0-9] "\"" ws { return {int_sep, dec_sep, unit} }

latitude
  = (minus / plus)?("90"(".""0"+)?/([1-8]?[0-9]("."[0-9]+)?)) { return parseFloat(text()); }

lat_interval
  = begin_array min:latitude value_separator max:latitude end_array { return {min, max} }

longitude
  = (minus / plus)?("180"(".""0"+)?/(("1"[0-7][0-9])/([1-9]?[0-9]))("."[0-9]+)?) { return parseFloat(text()); }

long_interval
  = begin_array min:longitude value_separator max:longitude end_array { return {min, max} }

// ----- 7. Strings -----

string "string"
  = quotation_mark chars:char* quotation_mark {
    var str = chars.join("")
    return { model: {type: String, required: true}, data: Array(queue_last).fill(str) }
  }

simple_api_key
  = api:(districts_key / names_key / generic_key) "(" ws ")" {
    return {
      model: {type: String, required: true}, 
      data: fillArray("data", api, text().split("(")[0], [])
    }
  }

districts_key = ("pt_district" / "pt_county" / "pt_parish") { return "districts" }
names_key = ("firstName" / "surname" / "fullName") { return "names" }
generic_key 
  = ("actor"
  / "animal"
  / "brand"
  / "buzzword"
  / "capital"
  / "car_brand"
  / "continent"
  / "cultural_center"
  / "hacker"
  / "job"
  / "musician"
  / "pt_politician"
  / "pt_public_figure"
  / "religion"
  / "soccer_player"
  / "sport"
  / "writer"
  ) { return text() + 's' }
  / ("country"
  / "gov_entity"
  / "nationality"
  / "political_party"
  / "top100_celebrity"
  / "pt_top100_celebrity"
  ) { return text().slice(0, -1) + 'ies' }
  / "pt_businessman" { return text().slice(0, -2) + 'en' }

pparty_type
  = quotation_mark arg:(("name") / ("abbr")) quotation_mark { return arg }

soccer_club_nationality
  = quotation_mark nat:(([Gg]"ermany") / ([Ee]"ngland") / ([Ss]"pain") / ([Ii]"taly") / ([Pp]"ortugal")) quotation_mark { return nat.join("") }

place_name
  = ws quotation_mark chars:([a-zA-Z][a-zA-Z\- ]*) quotation_mark ws { return chars.flat().join("").trim() }

place_label
  = ws quotation_mark label:(("district") / ("county")) quotation_mark ws { return label; }

lorem_string
  = quotation_mark word:"words" quotation_mark { return word; }
  / quotation_mark word:"sentences" quotation_mark { return word; }
  / quotation_mark word:"paragraphs" quotation_mark { return word; }

date
  = quotation_mark date:((((("0"[1-9]/"1"[0-9]/"2"[0-8])"/"("0"[1-9]/"1"[012]))/(("29"/"30"/"31")"/"("0"[13578]/"1"[02]))/(("29"/"30")"/"("0"[4,6,9]/"11")))"/"("19"/[2-9][0-9])[0-9][0-9])/("29""/""02""/"("19"/[2-9][0-9])("00"/"04"/"08"/"12"/"16"/"20"/"24"/"28"/"32"/"36"/"40"/"44"/"48"/"52"/"56"/"60"/"64"/"68"/"72"/"76"/"80"/"84"/"88"/"92"/"96"))) quotation_mark {
    var split = date.flat(2).join("").split(/\//)
    return new Date(parseInt(split[2]), parseInt(split[1]), parseInt(split[0]))
  }

date_format
  = quotation_mark format:("DD" date_separator "MM" date_separator ("AAAA" / "YYYY")) quotation_mark { return format.join(""); }
  / quotation_mark format:("MM" date_separator "DD" date_separator ("AAAA" / "YYYY")) quotation_mark { return format.join(""); }
  / quotation_mark format:(("AAAA" / "YYYY") date_separator "MM" date_separator "DD") quotation_mark { return format.join(""); }

key = chars:([_]*[a-z][a-zA-Z0-9_]*) { return chars.flat().join("") }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape = "\\"

quotation_mark = '"'
apostrophe = "'"

unescaped
  = [^\0-\x1F\x22\x5C]

// ----- 8. Moustaches -----

interpolation
  = apostrophe value:(chars:[^{']+ {return chars.join("")} / "{" curly:after_curly_bracket {return curly})* apostrophe {
    if (!value.length) return ""
    else if (value.length == 1) return value[0]
    else return { moustaches: "interpolation", data: value }
  }

after_curly_bracket
  = "{" ws value:moustaches_value ws "}}" { return value }
  / char:[^{'] { return "\x7B"+char }

moustaches_value
  = gen_moustaches / api_moustaches

gen_moustaches
  = "objectId(" ws ")" { return { model: {type: String, required: true}, data: fillArray("gen", null, "objectId", []) } }
  / "guid(" ws ")" { return { model: {type: String, required: true}, data: fillArray("gen", null, "guid", []) } }
  / "index(" ws ")" { return { model: {type: Number, required: true}, data: [...Array(queue_last).keys()] } }
  / "bool(" ws ")" { return { model: {type: Boolean, required: true}, data: fillArray("gen", null, "boolean", []) } }
  / "integer(" ws min:int ws "," ws max:int ws unit:("," quotation_mark u:. quotation_mark {return u})? ")" {
    return {
      model: { type: unit === null ? Number : String, required: true }, 
      data: fillArray("gen", null, "integer", [min, max, unit])
    }
  }
  / "floating(" ws min:number ws "," ws max:number ws others:("," ws decimals:int ws format:("," f:float_format {return f})? {return {decimals, format} })? ")" {
    if (!others) others = {decimals: null, format: null}
    return {
      model: { type: others.format === null ? Number : String, required: true }, 
      data: fillArray("gen", null, "floating", [min.data[0], max.data[0], others.decimals, others.format])
    }
  }
  / "position(" ws limits:(lat:lat_interval "," long:long_interval {return {lat, long} })? ")" {
    return {
      model: {type: String, required: true},
      data: fillArray("gen", null, "position", [!limits ? null : limits.lat, !limits ? null : limits.long])
    }
  }
  / "phone(" ws extension:(true/false)? ws ")" {
    return {
      model: {type: String, required: true},
      data: fillArray("gen", null, "phone", [extension])
    }
  }
  / "date(" ws start:date ws end:("," ws e:date ws { return e })? format:("," ws f:date_format ws { return f })? ")" {
    return {
      model: {type: String, required: true},
      data: fillArray("gen", null, "date", [start, !end ? new Date() : end, !format ? 'DD/MM/YYYY' : format])
    }
  }
  / "random(" ws values:(
      head:simple_value
      tail:(value_separator v:simple_value { return v; })*
      { return [head].concat(tail); }
    )? ")" {
      return {
        model: {any: {}, required: true},
        data: fillArray("gen", null, "random", [values])
      }
  }
  / "lorem(" ws count:int ws "," ws units:lorem_string ws ")" {
    return {
      model: {type: String, required: true},
      data: fillArray("gen", null, "lorem", [count, units])
    }
  }
  
api_moustaches
  = simple_api_key
  / "pt_county(" district:place_name ")" {
    return {
      model: {type: String, required: true},
      data: fillArray("data", "districts", "pt_countyFromDistrict", [district])
    }
  }
  / "pt_parish(" keyword:place_label "," name:place_name ")" {
    var moustaches = keyword == "county" ? "pt_parishFromCounty" : "pt_parishFromDistrict"
    return {
      model: {type: String, required: true},
      data: fillArray("data", "districts", moustaches, [name])
    }
  }
  / "pt_political_party(" ws arg:( a:pparty_type {return a} )? ")" {
    var moustaches = !arg ? "pt_political_party" : ("pt_political_party_" + arg)
    return {
      model: {
        type: arg === null ? String : {
          sigla: {type: String, required: true},
          partido: {type: String, required: true}
        },
        required: true
      },
      data: fillArray("data", "pt_political_parties", moustaches, [])
    }
  }
  / "political_party(" args:( (ws t:pparty_type ws {return [t]}) 
                            / (ws country:place_name ws type:("," ws t:pparty_type ws {return t})? {return type == null ? [country] : [country,type]}))? ")" {
    var moustaches, model = {
      type: {
        party_abbr: {type: String, required: true},
        party_name: {type: String, required: true}
      }, required: true
    }

    if (!args) moustaches = "political_party"
    if (args.length == 1) {
      if (["abbr","name"].includes(args[0])) {
        moustaches = "political_party_" + args[0]
        model.type = String
      }
      else moustaches = "political_party_from"
    } 
    else {
      moustaches = "political_party_from_" + args[1]
      model.type = String
    }

    return { model, data: fillArray("data", "political_parties", moustaches, !args ? [] : args) }
  }
  / "soccer_club(" ws arg:( a:soccer_club_nationality {return a} )? ")" {
    var moustaches = !arg ? "soccer_club" : "soccer_club_from"
    return {
      model: {type: String, required: true},
      data: fillArray("data", "soccer_clubs", moustaches, !arg ? [] : [arg])
    }
  }

// ----- 9. Diretivas -----

directive
  = repeat
  / range

repeat
  = begin_array repeat_signature ws ":" ws val:value_or_interpolation end_array {
    var num = queue.pop()
    queue_last = queue.length > 0 ? queue[queue.length-1] : null

    if (queue.length > 0) {
      val.model = {type: Array(num).fill(val.model), required: true}
      val.data = Array(num).fill(val.data)
    }
    return val
  }

repeat_signature
  = "'" ws "repeat" ws "(" ws min:int ws "," ws max:int ws ")" ws "'" {
    var num = Math.floor(Math.random() * (max - min + 1)) + min
    queue.push(num); queue_last = num
  }
  / "'" ws "repeat" ws "(" ws num:int ws ")" ws "'" {
    queue.push(num); queue_last = num
  }

range
  = "range(" ws num:int ws ")" {
    return {
      model: {type: Array(num).fill({type: Number, required: true}), required: true},
      data: Array(queue_last).fill([...Array(num).keys()])
    }
  }
  / "range(" ws init:int ws "," ws end:int ws ")" {
    var range = []

    if (init < end) { for (var i = init; i < end; i++) range.push(i) }
    else if (init > end) { for (var j = init; j > end; j--) range.push(j) }

    return {
      model: {type: Array(range.length).fill({type: Number, required: true}), required: true},
      data: Array(queue_last).fill(range)
    }
  }

probability
  = sign:("missing" / "having" {return text()}) "(" ws probability:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    var prob = parseInt(probability.join(""))/100, arr = []

    for (var i = 0; i < queue_last; i++) {
      var bool = (sign == "missing" && Math.random() > prob) || (sign == "having" && Math.random() < prob)
      arr.push(bool ? m.value.data[i] : null)
    }

    m.value.model.required = false
    return {
      name: m.name,
      value: { probability: true, model: m.value.model, data: arr }
    }
  }

function_prop
  = name:key "()" ws code:code {
    return {
      name, 
      data: {
        function: code
        /* function: "function f() " + code + "\n var result = f()" */
      }
    }
  }

code = CODE_START (not_code / code)* CODE_STOP { return text().slice(1,-1) }

not_code = (!CODE_START !CODE_STOP.)

CODE_START = "{"

CODE_STOP = "}"

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i