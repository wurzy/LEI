// JSON Grammar
// ============
//
// Based on the grammar from RFC 7159 [1].
//
// Note that JSON is also specified in ECMA-262 [2], ECMA-404 [3], and on the
// JSON website [4] (somewhat informally). The RFC seems the most authoritative
// source, which is confirmed e.g. by [5].
//
// [1] http://tools.ietf.org/html/rfc7159
// [2] http://www.ecma-international.org/publications/standards/Ecma-262.htm
// [3] http://www.ecma-international.org/publications/standards/Ecma-404.htm
// [4] http://json.org/
// [5] https://www.tbray.org/ongoing/When/201x/2014/03/05/RFC7159-JSON

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
}

// ----- 2. JSON Grammar -----

JSON_text
  = ws value:array ws { return value; }

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
        });

        return result;
      }
    )?
    end_object
    { return members !== null ? members: {}; }

member
  = name:object_name name_separator value:object_value {
      return { name: name, value: value };
    }
  / res:directive { return res }

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

object_name
  = chars:[a-zA-Z0-9_]+ { return chars.join(""); }

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

escape
  = "\\"

quotation_mark
  = '"'

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
  / "bool()" { return Math.random() < 0.5; }
  / "integer(" ws min:number ws "," ws max:number ws ")" {
    return Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1) + Math.floor(min));
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
  / "floating(" ws min:number ws "," ws max:number ws "," ws dec:number ws "," ws "\"" unit:. "0" int_sep:[.,] "0" dec_sep:[.,] "00\"" ws ")" {
    var random = min + (max - min) * Math.random();
    var decimals = Math.floor(dec)
    var roundedRandom = String(Math.round((random + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals))

    var formatted = formatNumber(roundedRandom)
    var split = formatted.split('.')
    return unit + split[0].replace(/,/g, int_sep) + dec_sep + split[1]
  }

// ----- 9. Diretivas -----

directive
  = repeat
  / range
  // / outras diretivas

repeat
  = "'" ws "repeat" ws "(" ws min:number ws "," ws max:number ws ")" ws "'" ws ":" ws val:value {
    return Array(Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1)) + Math.floor(min)).fill(val)
 }
 / "'" ws "repeat" ws "(" ws min:number ws ")" ws "'" ws ":" ws val:value {
    return Array(Math.floor(min)).fill(val)
 }

range
  = "range(" num:number ")" {
    return [...Array(Math.floor(num)).keys()];
  }

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i