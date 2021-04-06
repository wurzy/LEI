// DSL Grammar
// ============

{
  var language = "pt" //"pt" or "en", "pt" by default
  var components = {} //lista de componentes Strapi

  var collections = [] //nomes das coleções
  var cur_collection = "" //nome da coleção atual durante a travessia

  var queue = [] //queue com os números dos repeats (aninhados)
  var uniq_queue = [] //queue para fazer repeats de randoms sem elementos repetidos; ao entrar num repeat, pusha null se for normal, ou o nº do repeat se for unique
  var queue_prod = 1 //número de cópias de uma folha que é preciso produzir em qualquer momento
  
  var open_structs = 0 //para saber o nível de profundidade de estruturas em que está atualmente; incrementa ao abrir um objeto, array ou repeat
  var struct_types = [] //tipo das estruturas dentro das quais está, para saber se um index() pertence a um array ou a um repeat
  var array_indexes = [] //índices atuais onde se encontra dos arrays dentro dos quais está, para conseguir fazer o index() de um array

  var member_key = "" //chave do membro que está a processar no momento, para guardar na array abaixo ao começar um repeat
  var repeat_keys = [] //lista das chaves dos repeats, para ao fechar o objeto principal conseguir distinguir um objeto de um repeat (a data do objeto simples vem em Array(1))

  function mapToString(arr) {
    return arr.map(x => Array.isArray(x) ? mapToString(x) : (typeof x == "object" ? JSON.stringify(x) : String(x)))
  }

  function getIndexes(num) {
    if (struct_types[struct_types.length-1] == "repeat") return [...Array(num).keys()]
    else if (struct_types[struct_types.length-1] == "array") return Array(num).fill(array_indexes[array_indexes.length-1])
    else {
      var index = struct_types.length-1
      while (index >= 0 && struct_types[index] == "object") index--
      if (index >= 0) {
        if (struct_types[index] == "repeat") return [...Array(num).keys()]
        else return Array(num).fill(array_indexes[array_indexes.length-1])
      }
      //else erro não pode usar index aqui
    }
  }

  function trimArg(arg, marks) {
    if (arg[0] == '"' || arg[0] == "'") {
      arg = arg.split(arg[0])[1].trim()
      return (marks ? `"${arg}"` : arg)
    }
    return arg
  }

  function getApiPath(key, args) {
    var path = ""
    var join = args.join(",")

    if (key in genAPI) {
      if (key == "floating" && args.length > 3) {
        var format = trimArg(args.slice(3, args.length).join(','), true)
        join = args.slice(0,3).join(',') + ',' + format
      }
      if (key == "date") {
        if (args.length == 1) join = [args[0],"null",'"DD/MM/YYYY"'].join(",")
        if (args.length == 2) join = (/\d/.test(args[1]) ? [args[0],args[1],'"DD/MM/YYYY"'] : [args[0],"null",trimArg(args[1],true)]).join(",")
        if (args.length == 3) { args[2] = trimArg(args[2],true); join = args.join(",") }
      }
      if (key == "lorem") { args[1] = trimArg(args[1],true); join = args.join(",") }
      if (key == "random") join = '[' + join + ']'
      if (key == "range") {
        if (args.length == 1) join = [args[0],"null","null"].join(",")
        if (args.length == 2) join = [args[0],args[1],"null"].join(",")
      }
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

  function createComponent(name, value) {
    if ("component" in value) {
      if (open_structs > 1) {
        value.model.collectionName = "components_" + name
        value.model.info = {name}
        value.model.options = {}

        var i = 1, filename = name
        var keys = Object.keys(components[cur_collection])
        while (keys.includes(filename)) filename = name + i++

        components[cur_collection][filename] = lodash.cloneDeep(value.model)
        value.model = { "type": "component", "repeatable": false, required: true, "component": cur_collection + '.' + filename }
      }

      delete value.component
    }
    return value
  }

  function fillArray(api, sub_api, moustaches, args) {
    var arr = []

    if (moustaches == "random" && uniq_queue[uniq_queue.length-1] != null) {
      for (let i = 0; i < queue_prod; i++) {
        var arg = lodash.cloneDeep(args[0])
        var elem = []

        for (let j = 0; j < uniq_queue[uniq_queue.length-1]; j++) {
          var rand = genAPI[moustaches](arg); elem.push(rand)
          arg.splice(arg.indexOf(rand), 1)
          if (!arg.length) break
        }
        arr.push(elem)
      }
    }
    else {
      for (let i = 0; i < queue_prod; i++) {
        if (api == "gen") arr.push(genAPI[moustaches](...args))
        if (api == "data") arr.push(dataAPI[sub_api][moustaches](language, ...args))
      }
    }

    return arr
  }

  var chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
}

// ----- 2. DSL Grammar -----

DSL_text = language value:collection_object { return {dataModel: value, components} }

begin_array      = ws "[" ws { ++open_structs; array_indexes.push(0); struct_types.push("array") }
begin_object     = ws "{" ws { ++open_structs; struct_types.push("object") }
end_array        = ws "]" ws { array_indexes.pop(); struct_types.pop() }
end_object       = ws "}" ws { --open_structs; struct_types.pop() }
name_separator   = ws ":" ws
repeat_separator = ws ":" ws { ++open_structs; struct_types.push("repeat") }
value_separator  = ws "," ws
date_separator   = ws sep:("/" / "-" / ".") ws { return sep }

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
  = val:(false / null / true / number / string / interpolation) { return val.data[0] }

false = "false" { return {model: {type: "boolean", required: true}, data: Array(queue_prod).fill(false)} }
null  = "null"  { return {model: {type: "string", required: false, default: null}, data: Array(queue_prod).fill(null)} }
true  = "true"  { return {model: {type: "boolean", required: true}, data: Array(queue_prod).fill(true)} }

// ----- 4. Objects -----

collection_object
  = begin_object members:object_members end_object {
      var data = [], model = {}, i = 0

      for (let p in members) {
        model[collections[i]] = {
          kind: "collectionType",
          collectionName: collections[i],
          info: {name: collections[i++]},
          options: {},
          attributes: members[p].model.attributes
        }
        members[p] = repeat_keys.includes(p) ? members[p].data : members[p].data[0]
      }
      data = members

      return members !== null ? {data, model} : {}
    }

object
  = begin_object members:object_members end_object {
    var data = [], model = {attributes: {}}
    for (let i = 0; i < queue_prod; i++) data.push({})

    for (let p in members) {
      if ("if" in members[p]) {
        for (let prop in members[p].value.model.attributes) 
          model.attributes[prop] = members[p].value.model.attributes[prop]

        for (let i = 0; i < queue_prod; i++) {
          if (members[p].if({genAPI, dataAPI, local: data[i]})) {
            for (let prop in members[p].value.data[i]) data[i][prop] = members[p].value.data[i][prop]
          }
        }
      } 
      else if ("or" in members[p]) {
        for (let prop in members[p].or.model.attributes) 
          model.attributes[prop] = members[p].or.model.attributes[prop]

        var keys = Object.keys(members[p].or.model.attributes)
        for (let i = 0; i < queue_prod; i++) {
          var key = keys[Math.floor(Math.random() * (0 - keys.length) + keys.length)]
          data[i][key] = members[p].or.data[i][key]
        }
      }
      else {
        model.attributes[p] = members[p].model
        var prob = "probability" in members[p]

        for (let i = 0; i < queue_prod; i++) {
          if ((prob && members[p].data[i] !== null) || (!prob && !("function" in members[p]) && !("if" in members[p])))
            data[i][p] = members[p].data[i]
        }
      }
    }

    Object.keys(members).filter(key => "function" in members[key]).forEach(p => {
      for (let i = 0; i < queue_prod; i++)
        data[i][p] = members[p].function({genAPI, dataAPI, local: data[i]})
    })
    
    return members !== null ? {data, model, component: true} : {}
  }

object_members
  = head:member tail:(value_separator m:member { return m })* {
    var result = {};
    [head].concat(tail).forEach(function(element) { result[element.name] = element.value })
    return result
  }

member
  = name:member_key name_separator value:value_or_interpolation {
    if (open_structs == 1) cur_collection = ""
    value = createComponent(name, value)
    return { name, value }
  }
  / probability / function_prop / if / or

value_or_interpolation = val:(value / interpolation) {
    if (struct_types[struct_types.length-1] == "array") array_indexes[array_indexes.length-1]++
    return val
  }

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
      var model = {attributes: {}}, data = []
      for (let i = 0; i < queue_prod; i++) data.push([])
      if (arr == null) arr = []

      for (let j = 0; j < arr.length; j++) {
        arr[j] = createComponent("elem"+j, arr[j])
        model.attributes["elem"+j] = arr[j].model

        for (let k = 0; k < queue_prod; k++) data[k].push(arr[j].data[k])
      }

      var dataModel = {data, model}
      if (--open_structs > 1) dataModel.component = true
      return dataModel
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

int_neg = minus? int { return parseInt(text()) }

minus
  = "-"

plus
  = "+"

zero
  = "0"

float_format
  = ws quotation_mark ws f:("0" int_sep:[^0-9] "0" dec_sep:[^0-9] "00" unit:[^0-9]? { return text() }) ws quotation_mark ws { return f }

latitude
  = (minus / plus)?("90"(".""0"+)?/([1-8]?[0-9]("."[0-9]+)?)) { return parseFloat(text()); }

lat_interval
  = ws '[' ws min:latitude value_separator max:latitude ws ']' ws { return [min, max] }

longitude
  = (minus / plus)?("180"(".""0"+)?/(("1"[0-7][0-9])/([1-9]?[0-9]))("."[0-9]+)?) { return parseFloat(text()); }

long_interval
  = ws '[' ws min:longitude value_separator max:longitude ws ']' ws { return [min, max] }

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

nameOrAbbr
  = ws quotation_mark ws arg:(("name") / ("abbr")) ws quotation_mark ws { return arg }

string_arg
  = ws quotation_mark chars:[^"]* quotation_mark ws { return chars.flat().join("").trim() }

place_label
  = ws quotation_mark ws label:(("district") / ("county")) ws quotation_mark ws { return label }

lorem_string
  = quotation_mark ws word:"words" ws quotation_mark { return word }
  / quotation_mark ws word:"sentences" ws quotation_mark { return word }
  / quotation_mark ws word:"paragraphs" ws quotation_mark { return word }

date
  = quotation_mark ws date:((((("0"[1-9]/"1"[0-9]/"2"[0-8])"/"("0"[1-9]/"1"[012]))/(("29"/"30"/"31")"/"("0"[13578]/"1"[02]))/(("29"/"30")"/"("0"[4,6,9]/"11")))"/"("19"/[2-9][0-9])[0-9][0-9])/("29""/""02""/"("19"/[2-9][0-9])("00"/"04"/"08"/"12"/"16"/"20"/"24"/"28"/"32"/"36"/"40"/"44"/"48"/"52"/"56"/"60"/"64"/"68"/"72"/"76"/"80"/"84"/"88"/"92"/"96"))) ws quotation_mark {
    return date.flat(2).join("")
  }

date_format
  = quotation_mark ws format:("DD" date_separator "MM" date_separator ("AAAA" / "YYYY")) ws quotation_mark { return format.join(""); }
  / quotation_mark ws format:("MM" date_separator "DD" date_separator ("AAAA" / "YYYY")) ws quotation_mark { return format.join(""); }
  / quotation_mark ws format:(("AAAA" / "YYYY") date_separator "MM" date_separator "DD") ws quotation_mark { return format.join(""); }

member_key = chars:(([a-zA-Z_]/[^\x00-\x7F])([a-zA-Z0-9_]/[^\x00-\x7F])*) {
    member_key = chars.flat().join("")

    if (open_structs == 1) {
      cur_collection = member_key + "_" + uuidv4()
      collections.push(cur_collection)
      components[cur_collection] = {}
    }
    return member_key
  }

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

interpolation = apostrophe val:(moustaches / not_moustaches)* apostrophe str:(".string(" ws ")")? {
  var model = { type: "string", required: true }, data

  if (!val.length) data = Array(queue_prod).fill("")
  else if (val.length == 1) {
    model = val[0].model; data = val[0].data
    data = !str ? val[0].data : mapToString(val[0].data)
  }
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

moustaches_value = gen_moustaches / api_moustaches

gen_moustaches
  = "objectId(" ws ")" { return { model: {type: "string", required: true}, data: fillArray("gen", null, "objectId", []) } }
  / "guid(" ws ")" { return { model: {type: "string", required: true}, data: fillArray("gen", null, "guid", []) } }
  / "boolean(" ws ")" { return { model: {type: "boolean", required: true}, data: fillArray("gen", null, "boolean", []) } }
  / "index(" ws offset:(i:int ws { return i })? ")" {
    var queue_last = queue[queue.length-1]
    if (offset == null) offset = 0

    return {
      model: {type: "integer", required: true},
      data: Array(queue_prod/queue_last).fill(getIndexes(queue_last)).flat().map(k => k + offset)
    }
  }
  / "integer(" ws min:int_neg ws "," ws max:int_neg ws unit:("," ws quotation_mark u:[^"]* quotation_mark ws {return u})? ")" {
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
      data: fillArray("gen", null, "date", [start, end, !format ? 'DD/MM/YYYY' : format])
    }
  }
  / "random(" ws values:(
      head:(value/moustaches)
      tail:(value_separator v:(value/moustaches) { return v.data[0] })*
      { return [head.data[0]].concat(tail); }
    )? ")" {
      return {
        model: {type: "json", required: true},
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
  / "pt_county(" district:string_arg ")" {
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "pt_districts", "pt_countyFromDistrict", [district])
    }
  }
  / "pt_parish(" keyword:place_label "," name:string_arg ")" {
    var moustaches = keyword == "county" ? "pt_parishFromCounty" : "pt_parishFromDistrict"
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "pt_districts", moustaches, [name])
    }
  }
  / "pt_political_party(" ws arg:nameOrAbbr? ")" {
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
  / "political_party(" ws args:( t:nameOrAbbr {return [t]}
                            / (country:string_arg type:("," t:nameOrAbbr {return t})? {return type == null ? [country] : [country,type]}))? ")" {
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
  / "soccer_club(" ws arg:string_arg? ")" {
    var moustaches = !arg ? "soccer_club" : "soccer_club_from"
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "soccer_clubs", moustaches, !arg ? [] : [arg.toLowerCase()])
    }
  }
  / "pt_entity(" ws arg:nameOrAbbr? ")" {
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "pt_entities", "pt_entity" + (!arg ? '' : ('_'+arg)), [])
    }
  }

// ----- 9. Diretivas -----

directive
  = repeat
  / range

repeat
  = ws '[' ws repeat_signature ws repeat_separator ws val:value_or_interpolation ws ']' ws {
    var num = queue.pop(); queue_prod /= num
    uniq_queue.pop(); --open_structs
    struct_types.pop()
    
    var model = {attributes: {}}
    if (open_structs > 1) {
      val.data = chunk(val.data, num)
      val = createComponent("repeat_elem", val)
      for (let i = 0; i < num; i++) model.attributes["repeat_elem"+i] = val.model
    }

    return {data: val.data, model: open_structs > 1 ? model : val.model, component: true}
  }

repeat_signature 
  = "'" ws "repeat" unique:"_unique"? "(" ws min:int ws max:("," ws m:int ws { return m })? ")" ws "'" {
    var num = max === null ? min : Math.floor(Math.random() * (max - min + 1)) + min
    
    uniq_queue.push(unique != null ? num : null)
    queue_prod *= num; queue.push(num)

    repeat_keys.push(member_key)
  }

range
  = "range(" ws data:range_args ws ")" {
    var dataModel = open_structs > 1 ? {component: true} : {}
    var model = {attributes: {}}
    for (let i = 0; i < data[0].length; i++) model.attributes["elem"+i] = {type: "integer", required: true}

    dataModel.data = data
    dataModel.model = model
    return dataModel
  }

range_args
  = init:int_neg args:(ws "," ws end:int_neg step:(ws "," ws s:int_neg { return s })? { return {end, step}})? {
    var end = !args ? null : args.end
    var step = (!args || args.step == null) ? null : args.step
    return fillArray("gen", null, "range", [init, end, step])
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

or = "or(" ws ")" ws obj:object {
    for (let p in obj.model.attributes) obj.model.attributes[p].required = false
    return { name: "or_properties", value: { or: obj }}
  }

if = "if" ws code:if_code ws obj:object {
    for (let p in obj.model.attributes) obj.model.attributes[p].required = false
    return { name: "if_properties", value: { if: new Function("gen", "return " + code), value: obj } }
  }

function_prop
  = name:function_key "(" ws "gen" ws ")" ws code:function_code {
    return {
      name, value: {
        model: {type: "json", required: true},
        function: new Function("gen", code)
      }
    }
  }
  
function_key = chars:([a-zA-Z_][a-zA-Z0-9_]*) { return chars.flat().join("") }

function_code = CODE_START str:(gen_call / local_var / not_code / function_code)* CODE_STOP { return "\x7B" + str.join("") + "\x7D" }

if_code = ARGS_START str:(gen_call / local_var / not_parentheses / if_code)* ARGS_STOP { return str.join("") }

not_code = !CODE_START !CODE_STOP. { return text() }

code_key = key:([a-zA-Z_][a-zA-Z0-9_.]*) { return key.flat().join("") } 

local_var = "this." key:code_key { return "gen.local." + key }

gen_call = "gen." key:code_key ARGS_START args:(gen_call / not_parentheses)* ARGS_STOP {
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

not_parentheses = !ARGS_START !ARGS_STOP. { return text() }

ARGS_START = "("
ARGS_STOP = ")"

CODE_START = "{"
CODE_STOP = "}"

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i