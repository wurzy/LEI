// DSL Grammar
// ============

{
  function hex (value) {
    return Math.floor(value).toString(16)
  }

  function formatNumber(input) {
    var x = input.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
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

  function repeatArray(size, obj) {
    var arr = []
    var keys = Object.keys(obj).filter(key => obj[key] === "'{{index()}}'")

    for (var i = 0; i < size; i++) {
      var objClone = clone(obj)
      keys.forEach(key => { objClone[key] = i })
      arr.push(objClone)
    }

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
        head = head === null ? [] : [head] 

        head.concat(tail).forEach(function(element) {
          if (element !== null) result[element.name] = element.value;
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
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

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
  = "objectId()" {
    return hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
  }
  / "guid()" {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  / "index()" { return "'{{index()}}'"; }
  / "bool()" { return Math.random() < 0.5; }
  / "integer(" ws min:number ws "," ws max:number ws ")" {
    return Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1) + Math.floor(min));
  }
  / "integer(" ws min:number ws "," ws max:number ws ",\"" ws unit:. ws "\")" {
    return String(Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1) + Math.floor(min))) + unit;
  }
  // gerar float aleatório sem especificação do nr de casas decimais
  / "floating(" ws min:number ws "," ws max:number ws ")" {
    var decimals = 3; //3 caracteres decimais por predefinição
    const minStr = String(min);
    const maxStr = String(max);

    if (minStr.includes('.')) decimals = minStr.split('.')[1].length;
    if (maxStr.includes('.')) {
      var maxDecimals = maxStr.split('.')[1].length;
      if (decimals < maxDecimals) decimals = maxDecimals;
    }

    var random = min + (max - min) * Math.random();
    return Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
  }
  // gerar float aleatório com especificação do nr de casas decimais
  / "floating(" ws min:number ws "," ws max:number ws "," ws dec:number ws ")" {
    var random = min + (max - min) * Math.random();
    var decimals = Math.floor(dec)
    return Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
  }
  // gerar float aleatório com especificação do nr de casas decimais e formato
  / "floating(" ws min:number ws "," ws max:number ws "," ws dec:number ws "," ws "\"0" int_sep:[.,] "0" dec_sep:[.,] "00" unit:. "\"" ws ")" {
    var random = min + (max - min) * Math.random();
    var decimals = Math.floor(dec)
    var roundedRandom = String(Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals))

    var formatted = formatNumber(roundedRandom)
    var split = formatted.split('.')
    return split[0].replace(/,/g, int_sep) + dec_sep + split[1] + unit
  }
  / "random(" values:(
      head:simple_value
      tail:(value_separator v:simple_value { return v; })*
      { return [head].concat(tail); }
    )? ")" {
      return values[Math.floor(Math.random() * values.length)];
  }
  / "lorem(" ws num:number ws "," ws units:lorem_string ws ")" {
    return loremIpsum({ count: Math.floor(num), units })
  }
  / "distrito()" {
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
  }

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
    //return Array(size).fill(obj)
    return repeatArray(size,obj)
  }

repeat_signature
  = "'" ws "repeat" ws "(" ws min:number ws "," ws max:number ws ")" ws "'" {
    return Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1)) + Math.floor(min)
  }
  / "'" ws "repeat" ws "(" ws min:number ws ")" ws "'" {
    return Math.floor(min)
  }

range
  = "range(" num:number ")" {
    return [...Array(Math.floor(num)).keys()]
  }

probability = missing / having

missing
  = "missing(" ws prob:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    console.log(prob)
    if (Math.random() > (parseInt(prob.join(""))/100)) return m
    else return null
  }

having
  = "having(" ws prob:([1-9][0-9]?) ws ")" ws ":" ws "{" ws m:member ws "}" {
    console.log(prob)
    if (Math.random() < (parseInt(prob.join(""))/100)) return m
    else return null
  }

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i