// DSL Grammar
// ============

{
  var language = "pt" //"pt" or "en", "pt" by default
  var keys = ["objectId","guid","index","boolean","integer","floating","position","phone","date","random","lorem","having","missing"]

  function isObject(x) { return typeof x==='object' && x!==null && !Array.isArray(x) }

  function hasMoustaches(x) { return Object.prototype.hasOwnProperty.call(x,"moustaches") }

  function hasGenKey(x) { return keys.includes(x.moustaches) }

  function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  function probability(type, probability, value, i) {
    if ((type == "missing" && Math.random() > probability) || (type == "having" && Math.random() < probability)) {
      if (hasMoustaches(value)) {
        if (keys.includes(value.moustaches)) return callGenAPI(value,i)
        else return callDataAPI(value)
      }
      else return value
    }
    return null
  }

  function callGenAPI(obj, i) {
    if (["index","missing","having"].includes(obj.moustaches)) obj.args.push(i)
    if (["missing","having"].includes(obj.moustaches)) return probability(...obj.args)
    return genAPI[obj.moustaches](...obj.args)
  }

  function callDataAPI(obj) { return dataAPI[obj.api][obj.moustaches](...obj.args) }

  function resolveMoustaches(obj, i) {
    if (hasMoustaches(obj)) {
      if (hasGenKey(obj)) obj = callGenAPI(obj, i)
      else obj = callDataAPI(obj)
    }
    else {
      //objetos sem propriedade "moustaches" válida
      var objectKeys = Object.keys(obj).filter(k => isObject(obj[k]) && !hasMoustaches(obj[k]))
      objectKeys.forEach(k => { obj[k] = resolveMoustaches(obj[k]) })
      
      var arrKeys = Object.keys(obj).filter(k => Array.isArray(obj[k]))
      arrKeys.forEach(k => {
        for (var j = 0; j < obj[k].length; j++) {
          if (isObject(obj[k][j])) obj[k][j] = resolveMoustaches(obj[k][j])
        }
      })
      
      var genKeys = [], dbKeys = []
      Object.keys(obj).forEach(k => {
        if (isObject(obj[k]) && hasMoustaches(obj[k])) {
          if (hasGenKey(obj[k])) genKeys.push(k)
          else dbKeys.push(k)
        }
      })

      genKeys.forEach(k => {
        obj[k] = callGenAPI(obj[k], i)
        if (obj[k] === null) delete obj[k]
      })

      dbKeys.forEach(k => obj[k] = callDataAPI(obj[k]))
    }

    return obj
  }

  function repeatArray(size, obj) {
    var arr = []
    for (var i = 0; i < size; i++) arr.push(resolveMoustaches(clone(obj),i))
    return arr
  }
}

// ----- 2. DSL Grammar -----

DSL_text
  = language value:repeat_object_seq { return value }

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
  = false
  / null
  / true
  / object
  / array
  / number
  / string
  / directive

simple_value
  = false
  / null
  / true
  / number
  / string

false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

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
    { return members !== null ? members: {}; }

member
  = name:key name_separator value:value_or_moustache {
      return { name: name, value: value };
    }
  / probability

value_or_moustache
  = value / moustaches

// ----- 5. Arrays -----

array
  = begin_array
    values:(
      head:value_or_moustache
      tail:(value_separator v:value_or_moustache { return v; })*
      { return [head].concat(tail); }
    )?
    end_array
    { return values !== null ? values : []; }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

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
  = zero / (digit1_9 DIGIT*) { return parseInt(text()); }

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
  = quotation_mark chars:char* quotation_mark { return chars.join("") }

simple_api_key
  = api:(districts_key
  / names_key
  / generic_key
  ) { return { moustaches: text().slice(0, -2), api, args: [] } }

districts_key = ("district()" / "county()" / "parish()") { return "districts" }
names_key = ("firstName()" / "surname()" / "fullName()") { return "names" }
generic_key 
  = ("animal()"
  / "buzzword()"
  / "car_brand()"
  / "continent()"
  / "sport()"
  / "brand()"
  / "religion()"
  ) { return text().slice(0, -2) + 's' }
  / ("gov_entity()"
  / "country()"
  ) { return text().slice(0, -3) + 'ies' }

pt_political_party_arg
  = quotation_mark arg:(("name") / ("abbr")) quotation_mark { return arg }

place_name
  = ws quotation_mark chars:[a-zA-Z\- ]+ quotation_mark ws { return chars.join("").trim(); }

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

key
  = chars:([_]+[a-z][a-zA-Z0-9_]*) { return chars.flat().join("") }
  / chars:([a-z][a-zA-Z0-9_]*) { return chars.flat().join("") }

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

unescaped
  = [^\0-\x1F\x22\x5C]

// ----- 8. Moustaches -----

moustaches
  = "'" ws "{{" ws value:moustaches_value ws "}}" ws "'" { return value }

moustaches_value
  = gen_moustaches / api_moustaches

gen_moustaches
  = "objectId(" ws ")" { return {  moustaches: "objectId", args: [] } }
  / "guid(" ws ")" { return { moustaches: "guid", args: [] } }
  / "index(" ws ")" { return { moustaches: "index", args: [] } }
  / "bool(" ws ")" { return { moustaches: "boolean", args: [] } }
  / "integer(" ws min:int ws "," ws max:int ws unit:("," quotation_mark u:. quotation_mark {return u})? ")" {
    return {
      moustaches: "integer",
      args: [min, max, unit]
    }
  }
  / "floating(" ws min:number ws "," ws max:number ws others:("," ws decimals:int ws format:("," f:float_format {return f})? {return {decimals, format} })? ")" {
    if (!others) others = {decimals: null, format: null}
    return {
      moustaches: "floating",
      args: [min, max, others.decimals, others.format]
    }
  }
  / "position(" ws limits:(lat:lat_interval "," long:long_interval {return {lat, long} })? ")" {
    return {
      moustaches: "position",
      args: [!limits ? null : limits.lat, !limits ? null : limits.long]
    }
  }
  / "phone(" ws extension:(true/false)? ws ")" {
    return {
      moustaches: "phone",
      args: [extension]
    }
  }
  / "date(" ws start:date ws end:("," ws e:date ws { return e })? format:("," ws f:date_format ws { return f })? ")" {
    return {
      moustaches: "date",
      args: [start, !end ? new Date() : end, !format ? 'DD/MM/YYYY' : format]
    }
  }
  / "random(" ws values:(
      head:simple_value
      tail:(value_separator v:simple_value { return v; })*
      { return [head].concat(tail); }
    )? ")" {
      return {
        moustaches: "random",
        args: [values]
      }
  }
  / "lorem(" ws count:int ws "," ws units:lorem_string ws ")" {
    return {
      moustaches: "lorem",
      args: [count, units]
    } 
  }
  
api_moustaches
  = simple_api_key
  / "county(" district:place_name ")" {
    return {
      moustaches: "countyFromDistrict",
      api: "districts",
      args: [district]
    }
  }
  / "parish(" keyword:place_label "," name:place_name ")" {
    return {
      moustaches: keyword == "county" ? "parishFromCounty" : "parishFromDistrict",
      api: "districts",
      args: [name]
    }
  }
  / "pt_political_party(" ws arg:( a:pt_political_party_arg {return a} )? ")" {
    return {
      moustaches: !arg ? "pt_political_party" : ("pt_political_party_" + arg),
      api: "ptPoliticalParties",
      args: []
    }
  }

// ----- 9. Diretivas -----

directive
  = repeat_any_seq
  / range

repeat_any_seq
  = begin_array
    values:(
      head:repeat_any
      tail:(value_separator r:repeat_any { return r })*
      { return ([head].concat(tail)).flat() }
    )?
    end_array
    { return values !== null ? values : [] }

repeat_any
  = size:repeat_signature ws ":" ws val:value {
    if (typeof val === 'object' && val !== null) return repeatArray(size,val)
    else return Array(size).fill(val)
  }

repeat_object_seq
  = begin_array
    values:(
      head:repeat_object
      tail:(value_separator r:repeat_object { return r })*
      { return ([head].concat(tail)).flat() }
    )?
    end_array
    { return values !== null ? values : [] }

repeat_object
  = size:repeat_signature ws ":" ws obj:object {
    return repeatArray(size,obj)
  }

repeat_signature
  = "'" ws "repeat" ws "(" ws min:int ws "," ws max:int ws ")" ws "'" {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  / "'" ws "repeat" ws "(" ws min:int ws ")" ws "'" {
    return min
  }

range
  = "range(" ws num:int ws ")" {
    return [...Array(num).keys()]
  }
  / "range(" ws init:int ws "," ws end:int ws ")" {
    var range = []

    if (init < end) {
      for (var i = init; i < end; i++) range.push(i)
    }
    else if (init > end) {
      for (var j = init; j > end; j--) range.push(j)
    }

    return range
  }

probability = missing / having

missing
  = "missing(" ws prob:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    return {
      name: m.name,
      value: {
        moustaches: "missing",
        args: ["missing", parseInt(prob.join(""))/100, m.value]
      }
    }
  }

having
  = "having(" ws prob:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    return {
      name: m.name,
      value: {
        moustaches: "having",
        args: ["having", parseInt(prob.join(""))/100, m.value]
      }
    }
  }

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i