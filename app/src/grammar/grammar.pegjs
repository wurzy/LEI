// DSL Grammar
// ============

{
  var moustachesKeys = ["objectId","guid","index","bool","integer","floating","position","phone","random","loremIpsum","having","missing"]

  function hex(x) { return Math.floor(x).toString(16) }

  function formatNumber(num) {
    var x = num.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\\d+)(\\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace( rgx, '$1' + ',' + '$2' );
    }
    return x1 + x2;
  }

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

  function genObjectId() {
    return hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
  }

  function genGuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  }

  function genBoolean() { return Math.random() < 0.5 }

  function genInteger(min, max) {
    return Math.floor(Math.random() * (min - max + 1) + max)
  }

  function genInteger2(min, max, unit) {
    return String(Math.floor(Math.random() * (max - min + 1) + min)) + unit
  }

  function genFloat(min, max) {
    var decimals = 3; //3 caracteres decimais por predefinição
    const maxStr = String(max);
    const minStr = String(min);

    if (minStr.includes('.')) decimals = minStr.split('.')[1].length;
    if (maxStr.includes('.')) {
      var maxDecimals = maxStr.split('.')[1].length;
      if (decimals < maxDecimals) decimals = maxDecimals;
    }

    var random = min + (max - min) * Math.random();
    return Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
  }

  function genFloat2(min, max, decimals) {
    var random = min + (max - min) * Math.random()
    return Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
  }

  function genFloat3(min, max, decimals, int_sep, dec_sep, unit) {
    var random = min + (max - min) * Math.random()
    var roundedRandom = String(Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals))
    var formatted = formatNumber(roundedRandom)
             
    var split = formatted.split('.')
    return split[0].replace(/,/g, int_sep) + dec_sep + split[1] + unit
  }

  function genPosition() {
    return "(" + genFloat(-90,90,5) + ", " + genFloat(-180,180,5) + ")"
  }

  function genPosition2(lat, long) {
    if (lat.min > lat.max) {var latmax = lat.min; lat.min = lat.max; lat.max = latmax}
    if (long.min > long.max) {var longmax = long.min; long.min = long.max; long.max = longmax}

    return "(" + genFloat(lat.min, lat.max, 5) + ", " + genFloat(long.min, long.max, 5) + ")"
  }

  function genPhone() {
    var number = "9" + genRandom([1,2,3,6])
    while (number.length < 11) {
      if (number.length == 3 || number.length == 7) number += " "
      else number += (Math.floor(Math.random() * 9) + 1)
    }
    return number
  }

  function genPhone2(extension) {
    if (extension) return "+351 " + genPhone()
    return genPhone()
  }

  function genLorem(count, units) { return loremIpsum({ count, units }) }

  function genRandom(values) { return values[Math.floor(Math.random() * values.length)] }

  function genProbability(type, probability, value, i) {
    if (type == "missing" && Math.random() > probability) return moustachesSwitch(value, i)
    else if (type == "having" && Math.random() < probability) return moustachesSwitch(value, i)
    return null
  }

  function moustachesSwitch(obj, i) {
    switch (obj.moustaches) {
      case "objectId": obj = genObjectId(); break
      case "guid": obj = genGuid(); break
      case "index": obj = i; break
      case "bool": obj = genBoolean(); break
      case "integer":
        if (Object.prototype.hasOwnProperty.call(obj, "unit")) obj = genInteger2(obj.min, obj.max, obj.unit)
        else obj = genInteger(obj.min, obj.max)
        break
      case "floating":
        if (Object.prototype.hasOwnProperty.call(obj, "unit")) obj = genFloat3(obj.min, obj.max, obj.decimals, obj.int_sep, obj.dec_sep, obj.unit)
        else if (Object.prototype.hasOwnProperty.call(obj, "decimals")) obj = genFloat2(obj.min, obj.max, obj.decimals)
        else obj = genFloat(obj.min, obj.max)
        break
      case "position":
        if (Object.prototype.hasOwnProperty.call(obj, "lat")) obj = genPosition2(obj.lat, obj.long)
        else obj = genPosition()
        break
      case "phone":
        if (Object.prototype.hasOwnProperty.call(obj, "extension")) obj = genPhone2(obj.extension)
        else obj = genPhone()
        break
      case "loremIpsum": obj = genLorem(obj.count, obj.units); break
      case "random": obj = genRandom(obj.values); break
      case "missing": obj = genProbability("missing", obj.probability, obj.value, i); break
      case "having": obj = genProbability("having", obj.probability, obj.value, i); break
    }

    return obj
  }

  function resolveMoustaches(obj, i) {
    var objectKeys = Object.keys(obj).filter(k => 
          typeof obj[k] === 'object' && 
          obj[k] !== null && !Array.isArray(obj[k]) &&
          !(Object.prototype.hasOwnProperty.call(obj[k], "moustaches") &&
          moustachesKeys.includes(obj[k].moustaches)))
      
    objectKeys.forEach(k => { obj[k] = resolveMoustaches(obj[k]) })
    
    var keys = Object.keys(obj).filter(k => 
          typeof obj[k] === 'object' && 
          obj[k] !== null && 
          Object.prototype.hasOwnProperty.call(obj[k], "moustaches") &&
          moustachesKeys.includes(obj[k].moustaches))

    keys.forEach(k => {
      obj[k] = moustachesSwitch(obj[k], i)
      if (obj[k] === null) delete obj[k]
    })

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
  = ws value:repeat_object ws { return value; }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
name_separator  = ws ":" ws
value_separator = ws "," ws

ws "whitespace" = [ \t\n\r]*

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
  = name:key name_separator value:object_value {
      return { name: name, value: value };
    }
  / probability

object_value
  = value / moustaches

// ----- 5. Arrays -----

array
  = begin_array
    values:(
      head:value
      tail:(value_separator v:value { return v; })*
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

latitude
  = (minus / plus)?("90"(".""0"+)?/([1-8]?[0-9]("."[0-9]+)?)) { return parseFloat(text()); }

longitude
  = (minus / plus)?("180"(".""0"+)?/(("1"[0-7][0-9])/([1-9]?[0-9]))("."[0-9]+)?) { return parseFloat(text()); }

// ----- 7. Strings -----

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

lorem_string
  = quotation_mark word:"words" quotation_mark { return word; }
  / quotation_mark word:"sentences" quotation_mark { return word; }
  / quotation_mark word:"paragraphs" quotation_mark { return word; }

key
  = head:[a-z_] tail:[a-zA-Z0-9_]* { return head.concat(tail.join("")); }

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
  = "'" ws "{{" ws value:mous_func ws "}}" ws "'" { return value; }

mous_func
  = "objectId()" { return {  moustaches: "objectId" } }
  / "guid()" { return { moustaches: "guid" } }
  / "index()" { return { moustaches: "index" } }
  / "bool()" { return { moustaches: "bool" } }
  / "integer(" ws min:int ws "," ws max:int ws ")" {
    return {
      moustaches: "integer",
      min, max
    }
  }
  / "integer(" ws min:int ws "," ws max:int ws ",\"" ws unit:. ws "\")" {
    return {
      moustaches: "integer",
      min, max, unit
    }
  }
  // gerar float aleatório sem especificação do nr de casas decimais
  / "floating(" ws min:number ws "," ws max:number ws ")" {
    return {
      moustaches: "floating",
      min, max
    }
  }
  // gerar float aleatório com especificação do nr de casas decimais
  / "floating(" ws min:number ws "," ws max:number ws "," ws decimals:int ws ")" {
    return {
      moustaches: "floating",
      min, max, decimals
    }
  }
  // gerar float aleatório com especificação do nr de casas decimais e formato
  / "floating(" ws min:number ws "," ws max:number ws "," ws decimals:number ws "," ws "\"0" int_sep:[.,] "0" dec_sep:[.,] "00" unit:. "\"" ws ")" {
    return {
      moustaches: "floating",
      min, max, int_sep, dec_sep, unit, decimals
    }
  }
  / "position()" {
    return { moustaches: "position" }
  }
  / "position(" ws "[" ws min_lat:latitude ws "," max_lat:latitude ws "]" ws "," ws "[" ws min_long:longitude ws "," max_long:longitude ws "]" ws ")" {
    return {
      moustaches: "position",
      lat: {min: min_lat, max: max_lat},
      long: {min: min_long, max: max_long}
    }
  }
  / "phone()" { return { moustaches: "phone" } }
  / "phone(" ws extension:(true/false) ws ")" {
    return {
      moustaches: "phone",
      extension
    }
  }
  / "random(" ws values:(
      head:simple_value
      tail:(value_separator v:simple_value { return v; })*
      { return [head].concat(tail); }
    )? ")" {
      return {
        moustaches: "random",
        values
      }
  }
  / "lorem(" ws count:int ws "," ws units:lorem_string ws ")" {
    return {
      moustaches: "loremIpsum",
      count, units
    } 
  }
  /* "distrito()" {
    Distrito.getRandom()
      .then(dados => {return dados})
      .catch(e => {return e})
  }
  / "concelho()" {
    Concelho.getRandom()
      .then(dados => {return dados})
      .catch(e => {return e})
  }
  / "freguesia()" {
    Freguesia.getRandom()
      .then(dados => {return dados})
      .catch(e => {return e})
  }*/

// ----- 9. Diretivas -----

directive
  = repeat
  / range

repeat
  = size:repeat_signature ws ":" ws val:value {
    if (typeof val === 'object' && val !== null) return repeatArray(size,val)
    else return Array(size).fill(val)
  }

repeat_object
  = "[" ws size:repeat_signature ws ":" ws obj:object ws "]" {
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
        probability: parseInt(prob.join(""))/100,
        value: m.value
      }
    }
  }

having
  = "having(" ws prob:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    return {
      name: m.name,
      value: {
        moustaches: "having",
        probability: parseInt(prob.join(""))/100,
        value: m.value
      }
    }
  }

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i