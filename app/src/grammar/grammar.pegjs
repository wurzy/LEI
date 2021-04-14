// DSL Grammar
// ============

{
  var language = "pt" //"pt" or "en", "pt" by default
  var components = {} //lista de componentes Strapi

  var collections = [] //nomes das coleções
  var cur_collection = "" //nome da coleção atual durante a travessia

  var queue = [{value: 1, unique: false, total: 1}] //queue com {argumento original do repeat, se é um repeat unique ou não, total de cópias que é necessário criar nesse repeat}
  var nr_copies = 1 //número de cópias de uma folha que é preciso produzir em qualquer momento
  
  var open_structs = 0 //para saber o nível de profundidade de estruturas em que está atualmente; incrementa ao abrir um objeto, array ou repeat
  var struct_types = [] //tipo das estruturas dentro das quais está, para saber se um index() pertence a um array ou a um repeat
  var array_indexes = [] //índices atuais onde se encontra dos arrays dentro dos quais está, para conseguir fazer o index() de um array

  var member_key = "" //chave do membro que está a processar no momento, para guardar na array abaixo ao começar um repeat
  var repeat_keys = [] //lista das chaves dos repeats, para ao fechar o objeto principal conseguir distinguir um objeto de um repeat (a data do objeto simples vem em Array(1))

  var values_map = []

  function mapToString(arr) {
    return arr.map(x => Array.isArray(x) ? mapToString(x) : (typeof x == "object" ? JSON.stringify(x) : String(x)))
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
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
        var from = capitalize(trimArg(args[0], false))
        join = trimArg(args[1], true)

        if (key == "pt_district") key += "Of" + from
        if (key == "pt_county") key += (from == "District" ? "From" : "Of") + from
        if (key == "pt_parish") key += "From" + from
      }
      path = "dataAPI.pt_districts." + key
    }
    else if (key == "pt_city") {
      path = "dataAPI.pt_districts." + key + (!args[0].length ? "" : "Coordinates")
      if (args[0].length > 0) join = trimArg(args[1], true)
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

        components[cur_collection][filename] = _.cloneDeep(value.model)
        value.model = { "type": "component", "repeatable": false, required: true, "component": cur_collection + '.' + filename }
      }

      delete value.component
    }
    return value
  }

  function getFunctionData(code) {
    var data = [], f = new Function("gen", code)

    for (let i = 0; i < nr_copies; i++) {
      let local = Object.assign(..._.cloneDeep(values_map.map(x => x.data)))
      data.push(f({genAPI, dataAPI, local, i}))
    }
    return data
  }

  function propException(members, p, model, data) {
    if (model == null && data == null) {
      model = {attributes: {}}
      data = []
      for (let i = 0; i < nr_copies; i++) data.push({})
    }

    if ("if" in members[p]) {
      for (let prop in members[p].value.model.attributes) {
        model.attributes[prop] = members[p].value.model.attributes[prop]
        values_map[values_map.length-1].data[prop] = []
      }

      for (let i = 0; i < nr_copies; i++) {
        let local = Object.assign(..._.cloneDeep(values_map.map(x => x.data)))
        
        if (members[p].if({genAPI, dataAPI, local, i})) {
          for (let prop in members[p].value.data[i]) {
            data[i][prop] = members[p].value.data[i][prop]
            values_map[values_map.length-1].data[prop].push(data[i][prop])
          }
          var null_keys = Object.keys(values_map[values_map.length-1].data).filter(e => !Object.keys(members[p].value.data[i]).includes(e))
          null_keys.forEach(k => values_map[values_map.length-1].data[k].push(null))
        }
        else {
          for (let prop in members[p].value.data[i]) values_map[values_map.length-1].data[prop].push(null)
        }
      }
    }

    return {model, data}
  }

  function replicateMapValues() {
    for (let i = 0; i < values_map.length; i++) {
      for (var prop in values_map[i].data) {
        let arr = [], len = nr_copies/(values_map[i].data[prop].length)
        
        for (let j = 0; j < values_map[i].data[prop].length; j++) {
          for (let k = 0; k < len; k++) arr.push(values_map[i].data[prop][j])
        }
        if (arr.length) values_map[i].data[prop] = arr
      }
    }
  }

  function cleanMapValues() {
    for (let i = 0; i < values_map.length; i++) {
      for (var prop in values_map[i].data) {
        if (!("delete" in values_map[i].data[prop])) {
          let arr = [], step = (values_map[i].data[prop].length)/nr_copies
          
          for (let j = 0; j < values_map[i].data[prop].length; j += step)
            arr.push(values_map[i].data[prop][j])

          if (arr.length) values_map[i].data[prop] = arr
        }
      }
    }
  }

  function fillArray(api, sub_api, moustaches, args) {
    var arr = []

    if (moustaches == "random" && queue[queue.length-1].unique) {
      for (let i = 0; i < nr_copies; i++) {
        var arg = _.cloneDeep(args[0])
        var elem = []

        for (let j = 0; j < queue[queue.length-1].total; j++) {
          var rand = genAPI[moustaches](arg); elem.push(rand)
          arg.splice(arg.indexOf(rand), 1)
          if (!arg.length) break
        }
        arr.push(elem)
      }
    }
    else {
      for (let i = 0; i < nr_copies; i++) {
        let elem
        if (api == "gen") elem = genAPI[moustaches](...args)
        if (api == "data") elem = dataAPI[sub_api][moustaches](language, ...args)

        if (queue[queue.length-1].unique) {
          if (arr.includes(elem)) --i
          else arr.push(elem)
        }
        else arr.push(elem)
      }
    }

    return arr
  }

  function addCollectionModel(model, name, attributes) {
    model[name] = {
      kind: "collectionType",
      collectionName: name, info: {name},
      options: {}, attributes
    }
    return model
  }

  var chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))

  var chunkDifferent = (arr, sizes) => {
    sizes = sizes.map((sum => value => sum += value)(0))
    sizes.unshift(0)
    
    var chunks = []
    for (var i = 0; i < sizes.length - 1; i++) chunks.push(arr.slice(sizes[i], sizes[i+1]))
    return chunks
  }
}

// ----- 2. DSL Grammar -----

DSL_text = language value:collection_object { return {dataModel: value, components} }

begin_array      = ws "[" ws { ++open_structs; struct_types.push("array"); array_indexes.push(0); values_map.push({type: "array", data: []}) }
begin_object     = ws "{" ws { ++open_structs; struct_types.push("object"); values_map.push({type: "object", data: {}}) }
end_array        = ws "]" ws { struct_types.pop(); array_indexes.pop() }
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
  / object
  / array
  / false
  / null
  / true
  / number
  / string

simple_value
  = val:(false / null / true / number / string / interpolation) { return val.data[0] }

false = "false" { return {model: {type: "boolean", required: true}, data: Array(nr_copies).fill(false)} }
null  = "null"  { return {model: {type: "string", required: false, default: null}, data: Array(nr_copies).fill(null)} }
true  = "true"  { return {model: {type: "boolean", required: true}, data: Array(nr_copies).fill(true)} }

// ----- 4. Objects -----

collection_object
  = begin_object members:object_members end_object {
      var model = {}, data = {}, i = 0

      for (let p in members) {
        if ("or" in members[p]) {
          data[members[p].data[0].key] = members[p].data[0].value
          model = addCollectionModel(model, prop+"_"+uuidv4(), members[p].model)
        }
        else if ("at_least" in members[p]) {
          for (let prop in members[p].data[0]) {
            data[prop] = members[p].data[0][prop]
            model = addCollectionModel(model, prop+"_"+uuidv4(), members[p].model[prop])
          }
          i++
        }
        else if ("if" in members[p]) {
          let dataModel = propException(members, p, null, null)
          for (var prop in dataModel.data[0]) data[prop] = dataModel.data[0][prop]
        }
        else {
          model = addCollectionModel(model, collections[i++], members[p].model.attributes)
          data[p] = repeat_keys.includes(p) ? members[p].data : members[p].data[0]
        }
      }

      return members !== null ? {data, model} : {}
    }

object
  = begin_object members:object_members end_object {
    var data = [], model = {attributes: {}}
    for (let i = 0; i < nr_copies; i++) data.push({})

    for (let p in members) {
      if ("or" in members[p]) {
        for (let prop in members[p].model) model.attributes[prop] = members[p].model[prop]
        for (let i = 0; i < nr_copies; i++) data[i][members[p].data[i].key] = members[p].data[i].value
      }
      else if ("at_least" in members[p]) {
        for (let prop in members[p].model) model.attributes[prop] = members[p].model[prop]
        for (let i = 0; i < nr_copies; i++) {
          for (let prop in members[p].data[i]) data[i][prop] = members[p].data[i][prop]
        }
      }
      else if ("if" in members[p]) {
        let dataModel = propException(members, p, model, data)
        model = dataModel.model
        data = dataModel.data
      }
      else {
        model.attributes[p] = members[p].model
        var prob = "probability" in members[p]

        for (let i = 0; i < nr_copies; i++) {
          if ((prob && members[p].data[i] !== null) || !prob) data[i][p] = members[p].data[i]
        }
      }
    }
    
    values_map[values_map.length-1].delete = true
    return members !== null ? {data, model, component: true} : {}
  }

object_members
  = head:member tail:(value_separator m:member { return m })* {
    var result = {};
    [head].concat(tail).forEach(function(element) { result[element.name] = element.value })
    return result
  }

member
  = probability / function_prop / if / or / at_least
  / name:member_key name_separator value:value_or_interpolation {
    if ("delete" in values_map[values_map.length-1]) values_map.pop()
    values_map[values_map.length-1].data[name] = value.data

    if (open_structs == 1) cur_collection = ""
    value = createComponent(name, value)
    return { name, value }
  }

value_or_interpolation = val:(value / interpolation / anon_function) {
    if (struct_types[struct_types.length-1] == "array") array_indexes[array_indexes.length-1]++

    if ("delete" in values_map[values_map.length-1] && values_map[values_map.length-2].type == "array") {
      let popped = values_map.pop()
      values_map[values_map.length-1].data.push(popped.data)
    }
    else if (!("delete" in values_map[values_map.length-1]) && values_map[values_map.length-1].type == "array") {
      values_map[values_map.length-1].data.push(val.data)
    }

    return val
  }

member_key = chars:(([a-zA-Z_]/[^\x00-\x7F])([a-zA-Z0-9_]/[^\x00-\x7F])*) {
    member_key = chars.flat().join("")
    if (open_structs == 1) {
      cur_collection = member_key + "_" + uuidv4()
      collections.push(cur_collection)
      components[cur_collection] = {}
    }
    return member_key
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
      for (let i = 0; i < nr_copies; i++) data.push([])
      if (arr == null) arr = []

      for (let j = 0; j < arr.length; j++) {
        arr[j] = createComponent("elem"+j, arr[j])
        model.attributes["elem"+j] = arr[j].model

        for (let k = 0; k < nr_copies; k++) data[k].push(arr[j].data[k])
      }

      var dataModel = {data, model}
      if (--open_structs > 1) dataModel.component = true
      
      values_map[values_map.length-1].delete = true
      return dataModel
    }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? {
    var num = parseFloat(text())
    return {model: {type: !(num%1) ? "integer" : "float", required: true}, data: Array(nr_copies).fill(num)}
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
    return { model: {type: "string", required: true}, data: Array(nr_copies).fill(str) }
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
  / "hacker"
  / "job"
  / "month"
  / "musician"
  / "pt_politician"
  / "pt_public_figure"
  / "religion"
  / "soccer_player"
  / "sport"
  / "weekday"
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

district_keyword = "pt_district" / "pt_county" / "pt_parish"

place_label
  = ws quotation_mark ws label:(("district") / ("county") / ("parish") / ("city")) ws quotation_mark ws {
    return capitalize(label)
  }

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

  if (!val.length) data = Array(nr_copies).fill("")
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
  return { model: {type: "string", required: true}, data: Array(nr_copies).fill(text()) }
}

moustaches_start = "{{"
moustaches_stop = "}}"

moustaches_value = gen_moustaches / api_moustaches

gen_moustaches
  = "objectId(" ws ")" { return { model: {type: "string", required: true}, data: fillArray("gen", null, "objectId", []) } }
  / "guid(" ws ")" { return { model: {type: "string", required: true}, data: fillArray("gen", null, "guid", []) } }
  / "boolean(" ws ")" { return { model: {type: "boolean", required: true}, data: fillArray("gen", null, "boolean", []) } }
  / "index(" ws offset:(i:int ws { return i })? ")" {
      var arrays = [], queue_last = queue[queue.length-1]
      if (offset == null) offset = 0

      if (Array.isArray(queue_last.value)) queue_last.value.forEach(n => arrays.push(getIndexes(n)))
      else arrays = Array(queue_last.total/queue_last.value).fill(getIndexes(queue_last.value))

      return {
        model: {type: "integer", required: true},
        data: arrays.flat().map(k => k + offset)
      }
    }
  / "integer(" ws min:int_neg ws "," ws max:int_neg ws size:("," ws c:int ws {return c})? unit:("," ws quotation_mark u:[^"]* quotation_mark ws {return u.join("")})? ")" {
    return {
      model: { type: (size == null && unit === null) ? "integer" : "string", required: true }, 
      data: fillArray("gen", null, "integer", [min, max, size, unit])
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
      head:(value/moustaches_value)
      tail:(value_separator v:(value/moustaches_value) { return v.data[0] })*
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
  / key:district_keyword "(" moustaches:place_label "," name:string_arg ")" {
    if (key == "pt_district") moustaches = key + "Of" + moustaches
    if (key == "pt_county") moustaches = key + (moustaches == "District" ? "From" : "Of") + moustaches
    if (key == "pt_parish") moustaches = key + "From" + moustaches
    
    return {
      model: {type: "string", required: true},
      data: fillArray("data", "pt_districts", moustaches, [name])
    }
  }
  / "pt_city(" ws city:(quotation_mark ws "coords" ws quotation_mark ws "," name:string_arg ws {return name})? ")" {
    return {
      model: {
        type: city === null ? "string" : {
          latitude: {type: "string", required: true},
          longitude: {type: "string", required: true}
        },
        required: true
      },
      data: fillArray("data", "pt_districts", "pt_city" + (city == null ? "" : "Coordinates"), city == null ? [] : [city])
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
  = ws '[' ws num:repeat_signature ws repeat_separator ws val:value_or_interpolation ws ']' ws {
    queue.pop(); nr_copies = queue[queue.length-1].total
    struct_types.pop(); --open_structs
    
    var model = {attributes: {}}
    if (open_structs > 1) {
      val.data = Array.isArray(num) ? chunkDifferent(val.data, num) : chunk(val.data, num)
      val = createComponent("repeat_elem", val)
      for (let i = 0; i < num; i++) model.attributes["repeat_elem"+i] = val.model
    }

    cleanMapValues()
    return {data: val.data, model: open_structs > 1 ? model : val.model, component: true}
  }

repeat_signature 
  = "'" ws "repeat" unique:"_unique"? "(" num:repeat_args  ")" ws "'" {
    nr_copies = Array.isArray(num) ? num.reduce((a,b) => a+b, 0) : nr_copies*num
    queue.push({ value: num, unique: unique != null, total: nr_copies })

    repeat_keys.push(member_key)
    replicateMapValues()
    return num
  }

repeat_args
  = ws min:(int/local_arg) ws max:("," ws m:(int/local_arg) ws { return m })? {
    var minArr = Array.isArray(min), maxArr = Array.isArray(max)

    if (max === null) return min
    else if (!minArr && !maxArr) return Math.floor(Math.random() * ((max+1) - min) + min)
    else {
      if (!minArr) min = Array(max.length).fill(min)
      if (!maxArr) max = Array(min.length).fill(max)
      
      if (min.length == max.length) {
        var nums = []
        for (let i = 0; i < min.length; i++) {
          nums.push(Math.floor(Math.random() * ((max[i]+1) - min[i]) + min[i]))
        }
        return nums
      }
      //else erro
    }
  }

local_arg = ws "this" char:("."/"[") key:code_key ws {
    if (char == "[") key = char + key

    let local = Object.assign(..._.cloneDeep(values_map.map(x => x.data)))
    let args = key.match(/([a-zA-Z_]|[^\x00-\x7F])([a-zA-Z0-9_]|[^\x00-\x7F])*/g)

    for (let i = 0; i < args.length; i++) {
      if (args[i] in local) local = local[args[i]]
      else break//erro
    }

    return local.map(x => parseInt(x))
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

    for (let i = 0; i < nr_copies; i++) {
      var bool = (sign == "missing" && Math.random() > prob) || (sign == "having" && Math.random() < prob)
      arr.push(bool ? m.value.data[i] : null)
    }

    values_map[values_map.length-1].data[m.name] = arr
    m.value.model.required = false

    return {
      name: m.name,
      value: { probability: true, model: m.value.model, data: arr }
    }
  }

or = "or(" ws ")" ws obj:object {
    var model = {}, data = []

    for (let prop in obj.model.attributes) {
      obj.model.attributes[prop].required = false
      model[prop] = obj.model.attributes[prop]
      values_map[values_map.length-1].data[prop] = []
    }

    for (let i = 0; i < nr_copies; i++) {
      let keys = Object.keys(model)
      let key = keys[Math.floor(Math.random() * (0 - keys.length) + keys.length)]

      data.push({key, value: obj.data[i][key]})
      values_map[values_map.length-1].data[key].push(obj.data[i][key])

      keys.splice(keys.indexOf(key), 1)
      keys.forEach(k => values_map[values_map.length-1].data[k].push(null))
    }

    return { name: uuidv4(), value: { or: true, model, data } }
  }

at_least = "at_least(" ws num:int ws ")" obj:object {
    var model = {}, data = []

    for (let prop in obj.model.attributes) {
      obj.model.attributes[prop].required = false
      model[prop] = obj.model.attributes[prop]
      values_map[values_map.length-1].data[prop] = []
    }

    for (let i = 0; i < nr_copies; i++) {
      let keys = Object.keys(model)
      var n = Math.floor(Math.random() * ((keys.length+1) - num) + num)
      if (num > keys.length) n = keys.length
      data.push({})

      for (let j = 0; j < n; j++) {
        let key = keys[Math.floor(Math.random() * (0 - keys.length) + keys.length)]

        data[i][key] = obj.data[i][key]
        values_map[values_map.length-1].data[key].push(obj.data[i][key])

        keys.splice(keys.indexOf(key), 1)
      }

      keys.forEach(k => values_map[values_map.length-1].data[k].push(null))
    }
    
    return { name: uuidv4(), value: { at_least: true, model, data }}
  }

if = "if" ws code:if_code ws obj:object {
    for (let p in obj.model.attributes) obj.model.attributes[p].required = false
    return { name: uuidv4(), value: { if: new Function("gen", "return " + code), value: obj } }
  }

function_prop
  = name:function_key "(" ws "gen" ws ")" ws code:function_code {
    var data = getFunctionData(code)
    values_map[values_map.length-1].data[name] = data
    return { name, value: { model: {type: "json", required: true}, data } }
  }

anon_function = "gen" ws "=>" ws code:function_code {
    return { model: {type: "json", required: true}, data: getFunctionData(code) }
  }
  
function_key = chars:(([a-zA-Z_]/[^\x00-\x7F])([a-zA-Z0-9_]/[^\x00-\x7F])*) { return chars.flat().join("") }

function_code = CODE_START str:(gen_call / local_var / not_code / function_code)* CODE_STOP { return "\x7B" + str.join("") + "\x7D" }

if_code = ARGS_START str:(gen_call / local_var / not_parentheses / if_code)* ARGS_STOP { return "(" + str.join("") + ")" }

not_code = !CODE_START !CODE_STOP. { return text() }

code_key = key:(([a-zA-Z_]/[^\x00-\x7F])([a-zA-Z0-9_.]/[^\x00-\x7F])*) { return key.flat().join("") } 

local_var = "this" char:("."/"[") key:code_key {
    if (char == "[") key = char + key
    
    var keySplit = key.split(/\.(.+)/)
    var path = `gen.local${char=="."?".":""}${keySplit[0]}${nr_copies>1?"[gen.i]":""}`
    if (keySplit.length > 1) path += (keySplit[1][0] != "[" ? "." : "") + keySplit[1]
    return path
  }

gen_call = "gen." key:code_key ARGS_START args:(gen_call / local_var / not_parentheses)* ARGS_STOP {
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