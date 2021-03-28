// DSL Grammar
// ============

{
  var language = "pt" //"pt" or "en", "pt" by default
  var components = []

  var queue = []
  var queue_prod = null

  function trimArg(arg, marks) {
    if (arg[0] == '"') {
      arg = arg.split("\"")[1].trim()
      return (marks ? `"${arg}"` : arg)
    }
    return arg
  }

  function getApiPath(key, args) {
    var path = ""
    var join = args.join(",")

    if (key in genAPI) {
      if (key == "floating" && args.length == 4) {
        args[3] = trimArg(args[3], true)
        join = args.join(",")
      }
      if (key == "random") join = '[' + join + ']'
      path = "genAPI." + key
    }
    else if (key == "political_party") {
      if (args.length == 1) {
        var arg0 = !args[0].length ? "" : trimArg(args[0], false)
        if (["abbr","name"].includes(arg0)) { key += "_" + arg0; join = "" }
        else {
          key += (!args[0].length ? "" : "_from");
          join = trimArg(args[0], true)
        }
      }
      else {
        key += "_from_" + trimArg(args[1], false)
        join = trimArg(args[0], true)
      }
      path = "dataAPI.political_parties." + key
    }
    else if (['pt_district','pt_county','pt_parish'].includes(key)) {
      if (args[0].length > 0) {
        if (key == "pt_county") { key += "FromDistrict"; join = trimArg(args[0], true) }
        else {
          var from = trimArg(args[0], false)
          key += "From" + from.charAt(0).toUpperCase() + from.slice(1)
          join = trimArg(args[1], true)
        }
      }
      path = "dataAPI.pt_districts." + key
    }
    else if (key == "soccer_club") {
      path = "dataAPI.soccer_clubs." + key + (!args[0].length ? "" : "_from")
      if (args[0].length > 0) join = trimArg(args[0], true)
    }
    else if (['firstName','surname','fullName'].includes(key)) path = "dataAPI.names." + key
    else if (key[key.length-1] == 'y' && key != "day") path = `dataAPI.${key.slice(0,-1)+'ies'}.${key}`
    else if (key.slice(key.length-3) == "man") path = `dataAPI.${key.slice(0,-2)+'en'}.${key}`
    else path = `dataAPI.${key+'s'}.${key}`

    return {path, args: join}
  }

  function fillArray(api, sub_api, moustaches, args) {
    var arr = []
    for (var i = 0; i < queue_prod; i++) {
      if (api == "gen") arr.push(genAPI[moustaches](...args))
      if (api == "data") arr.push(dataAPI[sub_api][moustaches](language, ...args))
    }
    return arr
  }

  var chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
}

// ----- 2. DSL Grammar -----

DSL_text = language value:object { return {dataModel: value, components} }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
name_separator  = ws ":" ws
value_separator = ws "," ws
date_separator  = ws sep:("/" / "-" / ".") ws { return sep }

ws "whitespace" = [ \t\n\r]*

language = ws "<!LANGUAGE " lang:("pt" / "en") ">" ws { language = lang }

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

false = "false" { return {model: {type: "boolean", required: true}, data: Array(queue_prod).fill(false)} }
null  = "null"  { return {model: {type: "string", required: false, default: null}, data: Array(queue_prod).fill(null)} }
true  = "true"  { return {model: {type: "boolean", required: true}, data: Array(queue_prod).fill(true)} }

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
      var values = [], model = {}
      var dataModel = !queue.length ? {} : {component: true}
      
      if (!queue.length) {
        for (let p in members) {
          model[p] = {
            kind: "collectionType",
            collectionName: p + 's',
            info: {name: p},
            options: {"draftAndPublish": true},
            attributes: members[p].model.attributes
          }
          members[p] = members[p].data
        }
        values = members
      }
      else {
        model.attributes = {}
        for (let i = 0; i < queue_prod; i++) values.push({})

        for (let p in members) {
          model.attributes[p] = members[p].model
          var prob = "probability" in members[p]

          for (let i = 0; i < queue_prod; i++) {
            if ((prob && members[p].data[i] !== null) || (!prob && !("function" in members[p])))
              values[i][p] = members[p].data[i]
          }
        }

        Object.keys(members).filter(key => "function" in members[key]).forEach(p => {
          for (let i = 0; i < queue_prod; i++)
            values[i][p] = members[p].function({genAPI, dataAPI, local: values[i]})
        })
      }
      
      dataModel.data = values
      dataModel.model = model
      return members !== null ? dataModel : {}
    }

member
  = name:key name_separator value:value_or_interpolation {
    if ("component" in value) {
      if (queue.length > 0) {
        value.model.collectionName = "components_" + name  + "s"
        value.model.info = {name}
        value.model.options = {"draftAndPublish": true}

        components.push(lodash.cloneDeep(value.model))
        value.model = { "type": "component", "repeatable": false, "component": "UID_" }
      }

      delete value.component
    }
    return { name, value }
  }
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
      for (let i = 0; i < queue_prod; i++) values.push([])

      for (let j = 0; j < arr.length; j++) {
        model.type.push(arr[j].model)
        for (let k = 0; k < queue_prod; k++) values[k].push(arr[j].data[k])
      }

      //criar modelo e dar push para components

      return arr !== null ? {model, data: values} : []
    }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? {
    var num = parseFloat(text())
    return {model: {type: !(num%1) ? "integer" : "float", required: true}, data: Array(queue_prod).fill(num)}
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
  = ws quotation_mark ws f:("0" int_sep:[^0-9] "0" dec_sep:[^0-9] "00" unit:[^0-9] { return text() }) ws quotation_mark ws { return f }

latitude
  = (minus / plus)?("90"(".""0"+)?/([1-8]?[0-9]("."[0-9]+)?)) { return parseFloat(text()); }

lat_interval
  = begin_array min:latitude value_separator max:latitude end_array { return [min, max] }

longitude
  = (minus / plus)?("180"(".""0"+)?/(("1"[0-7][0-9])/([1-9]?[0-9]))("."[0-9]+)?) { return parseFloat(text()); }

long_interval
  = begin_array min:longitude value_separator max:longitude end_array { return [min, max] }

// ----- 7. Strings -----

string "string"
  = quotation_mark chars:char* quotation_mark {
    var str = chars.join("")
    return { model: {type: "string", required: true}, data: Array(queue_prod).fill(str) }
  }

simple_api_key
  = api:(districts_key / names_key / generic_key) "(" ws ")" {
    return {
      model: {type: "string", required: true}, 
      data: fillArray("data", api, text().split("(")[0], [])
    }
  }

districts_key = ("pt_district" / "pt_county" / "pt_parish") { return "pt_districts" }
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
  / "day"
  / "hacker"
  / "job"
  / "month"
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
  / "top100_celebrity"
  / "pt_top100_celebrity"
  ) { return text().slice(0, -1) + 'ies' }
  / "pt_businessman" { return text().slice(0, -2) + 'en' }

pparty_type
  = ws quotation_mark ws arg:(("name") / ("abbr")) ws quotation_mark ws { return arg }

soccer_club_nationality
  = ws quotation_mark ws nat:(([Gg]"ermany") / ([Ee]"ngland") / ([Ss]"pain") / ([Ii]"taly") / ([Pp]"ortugal")) ws quotation_mark ws { return nat.join("") }

place_name
  = ws quotation_mark chars:[^"]* quotation_mark ws { return chars.flat().join("").trim() }

place_label
  = ws quotation_mark ws label:(("district") / ("county")) ws quotation_mark ws { return label }

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

key = chars:([a-zA-Z_][a-zA-Z0-9_]*) { return chars.flat().join("") }

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

interpolation = apostrophe val:(moustaches / not_moustaches)* apostrophe {
  var model = { type: "string", required: true }, data

  if (!val.length) data = Array(queue_prod).fill("")
  else if (val.length == 1) { model = val[0].model; data = val[0].data }
  else {
    val.forEach(obj => { if ("objectType" in obj && obj.objectType) obj.data = obj.data.map(el => JSON.stringify(el)) })
    data = val.reduce((a, o) => (a.push(o.data), a), []).reduce((a, b) => a.map((v, i) => v + b[i]))
  }

  return { model, data }
}

moustaches = moustaches_start ws v:moustaches_value ws moustaches_stop { return v }

not_moustaches = (!(moustaches_start / "'").)+ {
  return { model: {type: "string", required: true}, data: Array(queue_prod).fill(text()) }
}

moustaches_start = "{{"
moustaches_stop = "}}"

moustaches_value
  = gen_moustaches / api_moustaches

gen_moustaches
  = "objectId(" ws ")" { return { model: {type: "string", required: true}, data: fillArray("gen", null, "objectId", []) } }
  / "guid(" ws ")" { return { model: {type: "string", required: true}, data: fillArray("gen", null, "guid", []) } }
  / "boolean(" ws ")" { return { model: {type: "boolean", required: true}, data: fillArray("gen", null, "boolean", []) } }
  / "index(" ws ")" {
    var queue_last = queue[queue.length-1]
    return {
      model: {type: "integer", required: true},
      data: Array(queue_prod/queue_last).fill([...Array(queue_last).keys()]).flat()
    }
  }
  / "integer(" ws min:int ws "," ws max:int ws unit:("," quotation_mark u:. quotation_mark {return u})? ")" {
    return {
      model: { type: unit === null ? "integer" : "string", required: true }, 
      data: fillArray("gen", null, "integer", [min, max, unit])
    }
  }
  / "floating(" ws min:number ws "," ws max:number ws others:("," ws decimals:int ws format:("," f:float_format {return f})? {return {decimals, format} })? ")" {
    if (!others) others = {decimals: null, format: null}
    return {
      model: { type: others.format === null ? "float" : "string", required: true }, 
      data: fillArray("gen", null, "floating", [min.data[0], max.data[0], others.decimals, others.format])
    }
  }
  / "position(" ws limits:(lat:lat_interval "," long:long_interval {return {lat, long} })? ")" {
    return {
      model: {type: "string", required: true},
      data: fillArray("gen", null, "position", [!limits ? null : limits.lat, !limits ? null : limits.long])
    }
  }
  / "phone(" ws extension:(true/false)? ws ")" {
    return {
      model: {type: "string", required: true},
      data: fillArray("gen", null, "phone", [extension])
    }
  }
  / "date(" ws start:date ws end:("," ws e:date ws { return e })? format:("," ws f:date_format ws { return f })? ")" {
    return {
      model: {type: "string", required: true},
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
      model: {type: "string", required: true},
      data: fillArray("gen", null, "lorem", [count, units])
    }
  }
  
api_moustaches
  = simple_api_key
  / "pt_county(" district:place_name ")" {
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "pt_districts", "pt_countyFromDistrict", [district])
    }
  }
  / "pt_parish(" keyword:place_label "," name:place_name ")" {
    var moustaches = keyword == "county" ? "pt_parishFromCounty" : "pt_parishFromDistrict"
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "pt_districts", moustaches, [name])
    }
  }
  / "pt_political_party(" ws arg:pparty_type? ")" {
    var moustaches = !arg ? "pt_political_party" : ("pt_political_party_" + arg)
    return {
      objectType: arg === null,
      model: {
        type: arg !== null ? "string" : {
          sigla: {type: "string", required: true},
          partido: {type: "string", required: true}
        },
        required: true
      },
      data: fillArray("data", "pt_political_parties", moustaches, [])
    }
  }
  / "political_party(" ws args:( t:pparty_type {return [t]}
                            / (country:place_name type:("," t:pparty_type {return t})? {return type == null ? [country] : [country,type]}))? ")" {
    var objectType = true, moustaches, model = {
      type: {
        party_abbr: {type: "string", required: true},
        party_name: {type: "string", required: true}
      }, required: true
    }

    if (!args) moustaches = "political_party"
    else if (args.length == 1) {
      if (["abbr","name"].includes(args[0])) {
        moustaches = "political_party_" + args[0]
        model.type = "string"
        objectType = false
      }
      else moustaches = "political_party_from"
    } 
    else {
      moustaches = "political_party_from_" + args[1]
      model.type = "string"
      objectType = false
    }

    return { objectType, model, data: fillArray("data", "political_parties", moustaches, !args ? [] : args) }
  }
  / "soccer_club(" ws arg:soccer_club_nationality? ")" {
    var moustaches = !arg ? "soccer_club" : "soccer_club_from"
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "soccer_clubs", moustaches, !arg ? [] : [arg])
    }
  }

// ----- 9. Diretivas -----

directive
  = repeat
  / range

repeat
  = begin_array repeat_signature ws ":" ws val:value_or_interpolation end_array {
    if (queue.length > 1) {
      val.model = {type: Array(num).fill(val.model), required: true}
      val.data = chunk(val.data, queue[queue.length-1])
    }
    
    var num = queue.pop()
    queue_prod = !queue.length ? null : (queue_prod/num)
    return val
  }

repeat_signature
  = "'" ws "repeat" ws "(" ws min:int ws "," ws max:int ws ")" ws "'" {
    var num = Math.floor(Math.random() * (max - min + 1)) + min
    queue_prod = !queue.length ? num : (queue_prod*num)
    queue.push(num)
  }
  / "'" ws "repeat" ws "(" ws num:int ws ")" ws "'" {
    queue_prod = !queue.length ? num : (queue_prod*num)
    queue.push(num)
  }

range
  = "range(" ws num:int ws ")" {
    return {
      model: {type: Array(num).fill({type: "integer", required: true}), required: true},
      data: Array(queue_prod).fill([...Array(num).keys()])
    }
  }
  / "range(" ws init:int ws "," ws end:int ws ")" {
    var range = []

    if (init < end) { for (let i = init; i < end; i++) range.push(i) }
    else if (init > end) { for (let i = init; i > end; i--) range.push(i) }

    return {
      model: {type: Array(range.length).fill({type: "integer", required: true}), required: true},
      data: Array(queue_prod).fill(range)
    }
  }

probability
  = sign:("missing" / "having" {return text()}) "(" ws probability:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    var prob = parseInt(probability.join(""))/100, arr = []

    for (let i = 0; i < queue_prod; i++) {
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
  = name:key "(" ws "gen" ws ")" ws code:code {
    return {
      name, value: {
        model: {any: {}, required: true},
        function: new Function("gen", code)
      }
    }
  }

code = CODE_START str:(gen_call / local_var / not_code / code)* CODE_STOP { return "\x7B" + str.join("") + "\x7D" }

not_code = !CODE_START !CODE_STOP. { return text() }

code_key = key:([a-zA-Z_][a-zA-Z0-9_.]*) { return key.flat().join("") } 

local_var = "this." key:code_key { return "gen.local." + key }

gen_call = "gen." key:code_key ARGS_START args:(gen_call / not_gen_call)* ARGS_STOP {
    args = args.join("").split(",")
    
    var split = [], build = "", i = 0
    while (i < args.length) {
      if (!args[i].includes('(')) split.push(args[i++])
      else {
        build = ""
        while (!args[i].includes(')')) build += args[i++] + ','
        split.push(build + args[i++])
      }
    }

    var obj = getApiPath(key, split.map(x => x.trim()))
    return `gen.${obj.path}(` + (obj.path.includes('dataAPI') ? `"${language}", ` : '') + `${obj.args})`
  }

not_gen_call = !ARGS_START !ARGS_STOP. { return text() }

ARGS_START = "("
ARGS_STOP = ")"

CODE_START = "{"
CODE_STOP = "}"

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i