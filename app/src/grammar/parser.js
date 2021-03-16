import genAPI from './moustaches'
import dataAPI from '../data/API'

const parser = (function() {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { DSL_text: peg$parseDSL_text },
        peg$startRuleFunction  = peg$parseDSL_text,

        peg$c0 = function(value) { return value },
        peg$c1 = "[",
        peg$c2 = peg$literalExpectation("[", false),
        peg$c3 = "{",
        peg$c4 = peg$literalExpectation("{", false),
        peg$c5 = "]",
        peg$c6 = peg$literalExpectation("]", false),
        peg$c7 = "}",
        peg$c8 = peg$literalExpectation("}", false),
        peg$c9 = ":",
        peg$c10 = peg$literalExpectation(":", false),
        peg$c11 = ",",
        peg$c12 = peg$literalExpectation(",", false),
        peg$c13 = "/",
        peg$c14 = peg$literalExpectation("/", false),
        peg$c15 = "-",
        peg$c16 = peg$literalExpectation("-", false),
        peg$c17 = ".",
        peg$c18 = peg$literalExpectation(".", false),
        peg$c19 = function(sep) { return sep },
        peg$c20 = peg$otherExpectation("whitespace"),
        peg$c21 = /^[ \t\n\r]/,
        peg$c22 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
        peg$c23 = "<!LANGUAGE ",
        peg$c24 = peg$literalExpectation("<!LANGUAGE ", false),
        peg$c25 = "pt",
        peg$c26 = peg$literalExpectation("pt", false),
        peg$c27 = "en",
        peg$c28 = peg$literalExpectation("en", false),
        peg$c29 = ">",
        peg$c30 = peg$literalExpectation(">", false),
        peg$c31 = function(lang) { return lang },
        peg$c32 = "false",
        peg$c33 = peg$literalExpectation("false", false),
        peg$c34 = function() { return false; },
        peg$c35 = "null",
        peg$c36 = peg$literalExpectation("null", false),
        peg$c37 = function() { return null;  },
        peg$c38 = "true",
        peg$c39 = peg$literalExpectation("true", false),
        peg$c40 = function() { return true;  },
        peg$c41 = function(head, m) { return m; },
        peg$c42 = function(head, tail) {
                var result = {};

                [head].concat(tail).forEach(function(element) {
                  result[element.name] = element.value;
                })

                return result;
              },
        peg$c43 = function(members) { return members !== null ? members: {}; },
        peg$c44 = function(name, value) {
              if (name == "moustaches") name = random_id
              return { name, value }
            },
        peg$c45 = function(head, v) { return v; },
        peg$c46 = function(head, tail) { return [head].concat(tail); },
        peg$c47 = function(values) { return values !== null ? values : []; },
        peg$c48 = peg$otherExpectation("number"),
        peg$c49 = function() { return parseFloat(text()); },
        peg$c50 = /^[1-9]/,
        peg$c51 = peg$classExpectation([["1", "9"]], false, false),
        peg$c52 = /^[eE]/,
        peg$c53 = peg$classExpectation(["e", "E"], false, false),
        peg$c54 = function() { return parseInt(text()); },
        peg$c55 = "+",
        peg$c56 = peg$literalExpectation("+", false),
        peg$c57 = "0",
        peg$c58 = peg$literalExpectation("0", false),
        peg$c59 = "\"0",
        peg$c60 = peg$literalExpectation("\"0", false),
        peg$c61 = /^[^0-9]/,
        peg$c62 = peg$classExpectation([["0", "9"]], true, false),
        peg$c63 = "00",
        peg$c64 = peg$literalExpectation("00", false),
        peg$c65 = "\"",
        peg$c66 = peg$literalExpectation("\"", false),
        peg$c67 = function(int_sep, dec_sep, unit) { return {int_sep, dec_sep, unit} },
        peg$c68 = "90",
        peg$c69 = peg$literalExpectation("90", false),
        peg$c70 = /^[1-8]/,
        peg$c71 = peg$classExpectation([["1", "8"]], false, false),
        peg$c72 = /^[0-9]/,
        peg$c73 = peg$classExpectation([["0", "9"]], false, false),
        peg$c74 = function(min, max) { return {min, max} },
        peg$c75 = "180",
        peg$c76 = peg$literalExpectation("180", false),
        peg$c77 = "1",
        peg$c78 = peg$literalExpectation("1", false),
        peg$c79 = /^[0-7]/,
        peg$c80 = peg$classExpectation([["0", "7"]], false, false),
        peg$c81 = peg$otherExpectation("string"),
        peg$c82 = function(chars) { return chars.join("") },
        peg$c83 = function(api) { return { moustaches: text().slice(0, -2), api, args: [] } },
        peg$c84 = "pt_district()",
        peg$c85 = peg$literalExpectation("pt_district()", false),
        peg$c86 = "pt_county()",
        peg$c87 = peg$literalExpectation("pt_county()", false),
        peg$c88 = "pt_parish()",
        peg$c89 = peg$literalExpectation("pt_parish()", false),
        peg$c90 = function() { return "districts" },
        peg$c91 = "firstName()",
        peg$c92 = peg$literalExpectation("firstName()", false),
        peg$c93 = "surname()",
        peg$c94 = peg$literalExpectation("surname()", false),
        peg$c95 = "fullName()",
        peg$c96 = peg$literalExpectation("fullName()", false),
        peg$c97 = function() { return "names" },
        peg$c98 = "actor()",
        peg$c99 = peg$literalExpectation("actor()", false),
        peg$c100 = "animal()",
        peg$c101 = peg$literalExpectation("animal()", false),
        peg$c102 = "brand()",
        peg$c103 = peg$literalExpectation("brand()", false),
        peg$c104 = "buzzword()",
        peg$c105 = peg$literalExpectation("buzzword()", false),
        peg$c106 = "capital()",
        peg$c107 = peg$literalExpectation("capital()", false),
        peg$c108 = "car_brand()",
        peg$c109 = peg$literalExpectation("car_brand()", false),
        peg$c110 = "continent()",
        peg$c111 = peg$literalExpectation("continent()", false),
        peg$c112 = "cultural_center()",
        peg$c113 = peg$literalExpectation("cultural_center()", false),
        peg$c114 = "hacker()",
        peg$c115 = peg$literalExpectation("hacker()", false),
        peg$c116 = "job()",
        peg$c117 = peg$literalExpectation("job()", false),
        peg$c118 = "musician()",
        peg$c119 = peg$literalExpectation("musician()", false),
        peg$c120 = "pt_politian()",
        peg$c121 = peg$literalExpectation("pt_politian()", false),
        peg$c122 = "pt_public_figure()",
        peg$c123 = peg$literalExpectation("pt_public_figure()", false),
        peg$c124 = "religion()",
        peg$c125 = peg$literalExpectation("religion()", false),
        peg$c126 = "soccer_player()",
        peg$c127 = peg$literalExpectation("soccer_player()", false),
        peg$c128 = "sport()",
        peg$c129 = peg$literalExpectation("sport()", false),
        peg$c130 = "writer()",
        peg$c131 = peg$literalExpectation("writer()", false),
        peg$c132 = function() { return text().slice(0, -2) + 's' },
        peg$c133 = "country()",
        peg$c134 = peg$literalExpectation("country()", false),
        peg$c135 = "gov_entity()",
        peg$c136 = peg$literalExpectation("gov_entity()", false),
        peg$c137 = "nationality()",
        peg$c138 = peg$literalExpectation("nationality()", false),
        peg$c139 = "political_party()",
        peg$c140 = peg$literalExpectation("political_party()", false),
        peg$c141 = "top100_celebrity()",
        peg$c142 = peg$literalExpectation("top100_celebrity()", false),
        peg$c143 = "pt_top100_celebrity()",
        peg$c144 = peg$literalExpectation("pt_top100_celebrity()", false),
        peg$c145 = function() { return text().slice(0, -3) + 'ies' },
        peg$c146 = "pt_businessman()",
        peg$c147 = peg$literalExpectation("pt_businessman()", false),
        peg$c148 = function() { return text().slice(0, -4) + 'en' },
        peg$c149 = "name",
        peg$c150 = peg$literalExpectation("name", false),
        peg$c151 = "abbr",
        peg$c152 = peg$literalExpectation("abbr", false),
        peg$c153 = function(arg) { return arg },
        peg$c154 = "de",
        peg$c155 = peg$literalExpectation("de", false),
        peg$c156 = "es",
        peg$c157 = peg$literalExpectation("es", false),
        peg$c158 = "it",
        peg$c159 = peg$literalExpectation("it", false),
        peg$c160 = function() { return text() },
        peg$c161 = /^[a-zA-Z\- ]/,
        peg$c162 = peg$classExpectation([["a", "z"], ["A", "Z"], "-", " "], false, false),
        peg$c163 = function(chars) { return chars.join("").trim(); },
        peg$c164 = "district",
        peg$c165 = peg$literalExpectation("district", false),
        peg$c166 = "county",
        peg$c167 = peg$literalExpectation("county", false),
        peg$c168 = function(label) { return label; },
        peg$c169 = "words",
        peg$c170 = peg$literalExpectation("words", false),
        peg$c171 = function(word) { return word; },
        peg$c172 = "sentences",
        peg$c173 = peg$literalExpectation("sentences", false),
        peg$c174 = "paragraphs",
        peg$c175 = peg$literalExpectation("paragraphs", false),
        peg$c176 = "2",
        peg$c177 = peg$literalExpectation("2", false),
        peg$c178 = /^[0-8]/,
        peg$c179 = peg$classExpectation([["0", "8"]], false, false),
        peg$c180 = /^[012]/,
        peg$c181 = peg$classExpectation(["0", "1", "2"], false, false),
        peg$c182 = "29",
        peg$c183 = peg$literalExpectation("29", false),
        peg$c184 = "30",
        peg$c185 = peg$literalExpectation("30", false),
        peg$c186 = "31",
        peg$c187 = peg$literalExpectation("31", false),
        peg$c188 = /^[13578]/,
        peg$c189 = peg$classExpectation(["1", "3", "5", "7", "8"], false, false),
        peg$c190 = /^[02]/,
        peg$c191 = peg$classExpectation(["0", "2"], false, false),
        peg$c192 = /^[4,6,9]/,
        peg$c193 = peg$classExpectation(["4", ",", "6", ",", "9"], false, false),
        peg$c194 = "11",
        peg$c195 = peg$literalExpectation("11", false),
        peg$c196 = "19",
        peg$c197 = peg$literalExpectation("19", false),
        peg$c198 = /^[2-9]/,
        peg$c199 = peg$classExpectation([["2", "9"]], false, false),
        peg$c200 = "02",
        peg$c201 = peg$literalExpectation("02", false),
        peg$c202 = "04",
        peg$c203 = peg$literalExpectation("04", false),
        peg$c204 = "08",
        peg$c205 = peg$literalExpectation("08", false),
        peg$c206 = "12",
        peg$c207 = peg$literalExpectation("12", false),
        peg$c208 = "16",
        peg$c209 = peg$literalExpectation("16", false),
        peg$c210 = "20",
        peg$c211 = peg$literalExpectation("20", false),
        peg$c212 = "24",
        peg$c213 = peg$literalExpectation("24", false),
        peg$c214 = "28",
        peg$c215 = peg$literalExpectation("28", false),
        peg$c216 = "32",
        peg$c217 = peg$literalExpectation("32", false),
        peg$c218 = "36",
        peg$c219 = peg$literalExpectation("36", false),
        peg$c220 = "40",
        peg$c221 = peg$literalExpectation("40", false),
        peg$c222 = "44",
        peg$c223 = peg$literalExpectation("44", false),
        peg$c224 = "48",
        peg$c225 = peg$literalExpectation("48", false),
        peg$c226 = "52",
        peg$c227 = peg$literalExpectation("52", false),
        peg$c228 = "56",
        peg$c229 = peg$literalExpectation("56", false),
        peg$c230 = "60",
        peg$c231 = peg$literalExpectation("60", false),
        peg$c232 = "64",
        peg$c233 = peg$literalExpectation("64", false),
        peg$c234 = "68",
        peg$c235 = peg$literalExpectation("68", false),
        peg$c236 = "72",
        peg$c237 = peg$literalExpectation("72", false),
        peg$c238 = "76",
        peg$c239 = peg$literalExpectation("76", false),
        peg$c240 = "80",
        peg$c241 = peg$literalExpectation("80", false),
        peg$c242 = "84",
        peg$c243 = peg$literalExpectation("84", false),
        peg$c244 = "88",
        peg$c245 = peg$literalExpectation("88", false),
        peg$c246 = "92",
        peg$c247 = peg$literalExpectation("92", false),
        peg$c248 = "96",
        peg$c249 = peg$literalExpectation("96", false),
        peg$c250 = function(date) {
            var split = date.flat(2).join("").split(/\//)
            return new Date(parseInt(split[2]), parseInt(split[1]), parseInt(split[0]))
          },
        peg$c251 = "DD",
        peg$c252 = peg$literalExpectation("DD", false),
        peg$c253 = "MM",
        peg$c254 = peg$literalExpectation("MM", false),
        peg$c255 = "AAAA",
        peg$c256 = peg$literalExpectation("AAAA", false),
        peg$c257 = "YYYY",
        peg$c258 = peg$literalExpectation("YYYY", false),
        peg$c259 = function(format) { return format.join(""); },
        peg$c260 = /^[_]/,
        peg$c261 = peg$classExpectation(["_"], false, false),
        peg$c262 = /^[a-z]/,
        peg$c263 = peg$classExpectation([["a", "z"]], false, false),
        peg$c264 = /^[a-zA-Z0-9_]/,
        peg$c265 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false),
        peg$c266 = function(chars) { return chars.flat().join("") },
        peg$c267 = "\\",
        peg$c268 = peg$literalExpectation("\\", false),
        peg$c269 = "b",
        peg$c270 = peg$literalExpectation("b", false),
        peg$c271 = function() { return "\b"; },
        peg$c272 = "f",
        peg$c273 = peg$literalExpectation("f", false),
        peg$c274 = function() { return "\f"; },
        peg$c275 = "n",
        peg$c276 = peg$literalExpectation("n", false),
        peg$c277 = function() { return "\n"; },
        peg$c278 = "r",
        peg$c279 = peg$literalExpectation("r", false),
        peg$c280 = function() { return "\r"; },
        peg$c281 = "t",
        peg$c282 = peg$literalExpectation("t", false),
        peg$c283 = function() { return "\t"; },
        peg$c284 = "u",
        peg$c285 = peg$literalExpectation("u", false),
        peg$c286 = function(digits) {
                  return String.fromCharCode(parseInt(digits, 16));
                },
        peg$c287 = function(sequence) { return sequence; },
        peg$c288 = "'",
        peg$c289 = peg$literalExpectation("'", false),
        peg$c290 = /^[^\0-\x1F"\\]/,
        peg$c291 = peg$classExpectation([["\0", "\x1F"], "\"", "\\"], true, false),
        peg$c292 = /^[^{']/,
        peg$c293 = peg$classExpectation(["{", "'"], true, false),
        peg$c294 = function(chars) {return chars.join("")},
        peg$c295 = function(curly) {return curly},
        peg$c296 = function(value) {
            if (!value.length) return ""
            else if (value.length == 1) return value[0]
            else return { moustaches: "interpolation", value }
          },
        peg$c297 = "}}",
        peg$c298 = peg$literalExpectation("}}", false),
        peg$c299 = function(char) { return "\x7B"+char },
        peg$c300 = "objectId(",
        peg$c301 = peg$literalExpectation("objectId(", false),
        peg$c302 = ")",
        peg$c303 = peg$literalExpectation(")", false),
        peg$c304 = function() { return {  moustaches: "objectId", args: [] } },
        peg$c305 = "guid(",
        peg$c306 = peg$literalExpectation("guid(", false),
        peg$c307 = function() { return { moustaches: "guid", args: [] } },
        peg$c308 = "index(",
        peg$c309 = peg$literalExpectation("index(", false),
        peg$c310 = function() { return { moustaches: "index", args: [] } },
        peg$c311 = "bool(",
        peg$c312 = peg$literalExpectation("bool(", false),
        peg$c313 = function() { return { moustaches: "boolean", args: [] } },
        peg$c314 = "integer(",
        peg$c315 = peg$literalExpectation("integer(", false),
        peg$c316 = peg$anyExpectation(),
        peg$c317 = function(min, max, u) {return u},
        peg$c318 = function(min, max, unit) {
            return {
              moustaches: "integer",
              args: [min, max, unit]
            }
          },
        peg$c319 = "floating(",
        peg$c320 = peg$literalExpectation("floating(", false),
        peg$c321 = function(min, max, decimals, f) {return f},
        peg$c322 = function(min, max, decimals, format) {return {decimals, format} },
        peg$c323 = function(min, max, others) {
            if (!others) others = {decimals: null, format: null}
            return {
              moustaches: "floating",
              args: [min, max, others.decimals, others.format]
            }
          },
        peg$c324 = "position(",
        peg$c325 = peg$literalExpectation("position(", false),
        peg$c326 = function(lat, long) {return {lat, long} },
        peg$c327 = function(limits) {
            return {
              moustaches: "position",
              args: [!limits ? null : limits.lat, !limits ? null : limits.long]
            }
          },
        peg$c328 = "phone(",
        peg$c329 = peg$literalExpectation("phone(", false),
        peg$c330 = function(extension) {
            return {
              moustaches: "phone",
              args: [extension]
            }
          },
        peg$c331 = "date(",
        peg$c332 = peg$literalExpectation("date(", false),
        peg$c333 = function(start, e) { return e },
        peg$c334 = function(start, end, f) { return f },
        peg$c335 = function(start, end, format) {
            return {
              moustaches: "date",
              args: [start, !end ? new Date() : end, !format ? 'DD/MM/YYYY' : format]
            }
          },
        peg$c336 = "random(",
        peg$c337 = peg$literalExpectation("random(", false),
        peg$c338 = function(values) {
              return {
                moustaches: "random",
                args: [values]
              }
          },
        peg$c339 = "lorem(",
        peg$c340 = peg$literalExpectation("lorem(", false),
        peg$c341 = function(count, units) {
            return {
              moustaches: "lorem",
              args: [count, units]
            } 
          },
        peg$c342 = "pt_county(",
        peg$c343 = peg$literalExpectation("pt_county(", false),
        peg$c344 = function(district) {
            return {
              moustaches: "pt_countyFromDistrict",
              api: "districts",
              args: [district]
            }
          },
        peg$c345 = "pt_parish(",
        peg$c346 = peg$literalExpectation("pt_parish(", false),
        peg$c347 = function(keyword, name) {
            return {
              moustaches: keyword == "county" ? "pt_parishFromCounty" : "pt_parishFromDistrict",
              api: "districts",
              args: [name]
            }
          },
        peg$c348 = "pt_political_party(",
        peg$c349 = peg$literalExpectation("pt_political_party(", false),
        peg$c350 = function(a) {return a},
        peg$c351 = function(arg) {
            return {
              moustaches: !arg ? "pt_political_party" : ("pt_political_party_" + arg),
              api: "ptPoliticalParties",
              args: []
            }
          },
        peg$c352 = "soccer_club(",
        peg$c353 = peg$literalExpectation("soccer_club(", false),
        peg$c354 = function(arg) {
            return {
              moustaches: !arg ? "soccer_club" : "soccer_club_from",
              api: "soccer_clubs",
              args: !arg ? [] : [arg]
            }
          },
        peg$c355 = function(head, r) { return r },
        peg$c356 = function(head, tail) { return ([head].concat(tail)).flat() },
        peg$c357 = function(values) { return values !== null ? values : [] },
        peg$c358 = function(size, val) {
            if (typeof val === 'object' && val !== null) return repeatArray(size,val)
            else return Array(size).fill(val)
          },
        peg$c359 = function(values) { 
              //values -> lista em que cada elem = {dataset: x, model: y}
              return values !== null ? values : []
            },
        peg$c360 = function(size, obj) {
            //var model = generateModel(obj)
            //return {dataset: repeatArray(size,obj), model: ...}
            return repeatArray(size,obj)
          },
        peg$c361 = "repeat",
        peg$c362 = peg$literalExpectation("repeat", false),
        peg$c363 = "(",
        peg$c364 = peg$literalExpectation("(", false),
        peg$c365 = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
          },
        peg$c366 = function(min) {
            return min
          },
        peg$c367 = "range(",
        peg$c368 = peg$literalExpectation("range(", false),
        peg$c369 = function(num) {
            return [...Array(num).keys()]
          },
        peg$c370 = function(init, end) {
            var range = []

            if (init < end) {
              for (var i = init; i < end; i++) range.push(i)
            }
            else if (init > end) {
              for (var j = init; j > end; j--) range.push(j)
            }

            return range
          },
        peg$c371 = "missing(",
        peg$c372 = peg$literalExpectation("missing(", false),
        peg$c373 = function(prob, m) {
            return {
              name: m.name,
              value: {
                moustaches: "missing",
                args: ["missing", parseInt(prob.join(""))/100, m.value]
              }
            }
          },
        peg$c374 = "having(",
        peg$c375 = peg$literalExpectation("having(", false),
        peg$c376 = function(prob, m) {
            return {
              name: m.name,
              value: {
                moustaches: "having",
                args: ["having", parseInt(prob.join(""))/100, m.value]
              }
            }
          },
        peg$c377 = /^[0-9a-f]/i,
        peg$c378 = peg$classExpectation([["0", "9"], ["a", "f"]], false, true),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseDSL_text() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parselanguage();
      if (s1 !== peg$FAILED) {
        s2 = peg$parserepeat_object_seq();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsebegin_array() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c1;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsebegin_object() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 123) {
          s2 = peg$c3;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseend_array() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 93) {
          s2 = peg$c5;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseend_object() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 125) {
          s2 = peg$c7;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsename_separator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s2 = peg$c9;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsevalue_separator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s2 = peg$c11;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c12); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsedate_separator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s2 = peg$c13;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c14); }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s2 = peg$c15;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c16); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s2 = peg$c17;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c18); }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c19(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c21.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c22); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c21.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }

      return s0;
    }

    function peg$parselanguage() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c23) {
          s2 = peg$c23;
          peg$currPos += 11;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c25) {
            s3 = peg$c25;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c27) {
              s3 = peg$c27;
              peg$currPos += 2;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c28); }
            }
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 62) {
              s4 = peg$c29;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c31(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsevalue() {
      var s0;

      s0 = peg$parsefalse();
      if (s0 === peg$FAILED) {
        s0 = peg$parsenull();
        if (s0 === peg$FAILED) {
          s0 = peg$parsetrue();
          if (s0 === peg$FAILED) {
            s0 = peg$parseobject();
            if (s0 === peg$FAILED) {
              s0 = peg$parsearray();
              if (s0 === peg$FAILED) {
                s0 = peg$parsenumber();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsestring();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parsedirective();
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsesimple_value() {
      var s0;

      s0 = peg$parsefalse();
      if (s0 === peg$FAILED) {
        s0 = peg$parsenull();
        if (s0 === peg$FAILED) {
          s0 = peg$parsetrue();
          if (s0 === peg$FAILED) {
            s0 = peg$parsenumber();
            if (s0 === peg$FAILED) {
              s0 = peg$parsestring();
            }
          }
        }
      }

      return s0;
    }

    function peg$parsefalse() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c32) {
        s1 = peg$c32;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c34();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenull() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c35) {
        s1 = peg$c35;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c37();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsetrue() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c38) {
        s1 = peg$c38;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c40();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseobject() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_object();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parsemember();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsemember();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c41(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$currPos;
            s6 = peg$parsevalue_separator();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsemember();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c41(s3, s7);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c42(s3, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseend_object();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c43(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsemember() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsename_separator();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevalue_or_moustaches();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c44(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseprobability();
      }

      return s0;
    }

    function peg$parsevalue_or_moustaches() {
      var s0;

      s0 = peg$parsevalue();
      if (s0 === peg$FAILED) {
        s0 = peg$parseinterpolation();
      }

      return s0;
    }

    function peg$parsearray() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parsevalue_or_moustaches();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsevalue_or_moustaches();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c45(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$currPos;
            s6 = peg$parsevalue_separator();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsevalue_or_moustaches();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c45(s3, s7);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c46(s3, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseend_array();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c47(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseminus();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseint();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefrac();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseexp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c49();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c48); }
      }

      return s0;
    }

    function peg$parsedecimal_point() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 46) {
        s0 = peg$c17;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }

      return s0;
    }

    function peg$parsedigit1_9() {
      var s0;

      if (peg$c50.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c51); }
      }

      return s0;
    }

    function peg$parsee() {
      var s0;

      if (peg$c52.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c53); }
      }

      return s0;
    }

    function peg$parseexp() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsee();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseminus();
        if (s2 === peg$FAILED) {
          s2 = peg$parseplus();
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseDIGIT();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseDIGIT();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsefrac() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsedecimal_point();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseDIGIT();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseDIGIT();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseint() {
      var s0, s1, s2, s3, s4;

      s0 = peg$parsezero();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parsedigit1_9();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseDIGIT();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseDIGIT();
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c54();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseminus() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 45) {
        s0 = peg$c15;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }

      return s0;
    }

    function peg$parseplus() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 43) {
        s0 = peg$c55;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }

      return s0;
    }

    function peg$parsezero() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 48) {
        s0 = peg$c57;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c58); }
      }

      return s0;
    }

    function peg$parsefloat_format() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c59) {
          s2 = peg$c59;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c60); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c61.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c62); }
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 48) {
              s4 = peg$c57;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c58); }
            }
            if (s4 !== peg$FAILED) {
              if (peg$c61.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c62); }
              }
              if (s5 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c63) {
                  s6 = peg$c63;
                  peg$currPos += 2;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c64); }
                }
                if (s6 !== peg$FAILED) {
                  if (peg$c61.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 34) {
                      s8 = peg$c65;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c66); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsews();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c67(s3, s5, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parselatitude() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseminus();
      if (s1 === peg$FAILED) {
        s1 = peg$parseplus();
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c68) {
          s3 = peg$c68;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c69); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s5 = peg$c17;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c18); }
          }
          if (s5 !== peg$FAILED) {
            s6 = [];
            if (input.charCodeAt(peg$currPos) === 48) {
              s7 = peg$c57;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c58); }
            }
            if (s7 !== peg$FAILED) {
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                if (input.charCodeAt(peg$currPos) === 48) {
                  s7 = peg$c57;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c58); }
                }
              }
            } else {
              s6 = peg$FAILED;
            }
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          if (peg$c70.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c71); }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (peg$c72.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c73); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 46) {
                s6 = peg$c17;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c18); }
              }
              if (s6 !== peg$FAILED) {
                s7 = [];
                if (peg$c72.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s8 !== peg$FAILED) {
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    if (peg$c72.test(input.charAt(peg$currPos))) {
                      s8 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c73); }
                    }
                  }
                } else {
                  s7 = peg$FAILED;
                }
                if (s7 !== peg$FAILED) {
                  s6 = [s6, s7];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c49();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parselat_interval() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$parselatitude();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevalue_separator();
          if (s3 !== peg$FAILED) {
            s4 = peg$parselatitude();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseend_array();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c74(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parselongitude() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseminus();
      if (s1 === peg$FAILED) {
        s1 = peg$parseplus();
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c75) {
          s3 = peg$c75;
          peg$currPos += 3;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s5 = peg$c17;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c18); }
          }
          if (s5 !== peg$FAILED) {
            s6 = [];
            if (input.charCodeAt(peg$currPos) === 48) {
              s7 = peg$c57;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c58); }
            }
            if (s7 !== peg$FAILED) {
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                if (input.charCodeAt(peg$currPos) === 48) {
                  s7 = peg$c57;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c58); }
                }
              }
            } else {
              s6 = peg$FAILED;
            }
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 49) {
            s4 = peg$c77;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c78); }
          }
          if (s4 !== peg$FAILED) {
            if (peg$c79.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c80); }
            }
            if (s5 !== peg$FAILED) {
              if (peg$c72.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c73); }
              }
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            if (peg$c50.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c51); }
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              if (peg$c72.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c73); }
              }
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
              s5 = peg$c17;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c18); }
            }
            if (s5 !== peg$FAILED) {
              s6 = [];
              if (peg$c72.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c73); }
              }
              if (s7 !== peg$FAILED) {
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  if (peg$c72.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c73); }
                  }
                }
              } else {
                s6 = peg$FAILED;
              }
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c49();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parselong_interval() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$parselongitude();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevalue_separator();
          if (s3 !== peg$FAILED) {
            s4 = peg$parselongitude();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseend_array();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c74(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsechar();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsechar();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c82(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c81); }
      }

      return s0;
    }

    function peg$parsesimple_api_key() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsedistricts_key();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenames_key();
        if (s1 === peg$FAILED) {
          s1 = peg$parsegeneric_key();
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c83(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsedistricts_key() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c84) {
        s1 = peg$c84;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c85); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c86) {
          s1 = peg$c86;
          peg$currPos += 11;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c87); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 11) === peg$c88) {
            s1 = peg$c88;
            peg$currPos += 11;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c89); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c90();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenames_key() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 11) === peg$c91) {
        s1 = peg$c91;
        peg$currPos += 11;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c92); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c93) {
          s1 = peg$c93;
          peg$currPos += 9;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c94); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 10) === peg$c95) {
            s1 = peg$c95;
            peg$currPos += 10;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c96); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c97();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsegeneric_key() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c98) {
        s1 = peg$c98;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c100) {
          s1 = peg$c100;
          peg$currPos += 8;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c101); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c102) {
            s1 = peg$c102;
            peg$currPos += 7;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c103); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 10) === peg$c104) {
              s1 = peg$c104;
              peg$currPos += 10;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c105); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 9) === peg$c106) {
                s1 = peg$c106;
                peg$currPos += 9;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c107); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 11) === peg$c108) {
                  s1 = peg$c108;
                  peg$currPos += 11;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c109); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 11) === peg$c110) {
                    s1 = peg$c110;
                    peg$currPos += 11;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c111); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 17) === peg$c112) {
                      s1 = peg$c112;
                      peg$currPos += 17;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c113); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 8) === peg$c114) {
                        s1 = peg$c114;
                        peg$currPos += 8;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c115); }
                      }
                      if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 5) === peg$c116) {
                          s1 = peg$c116;
                          peg$currPos += 5;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c117); }
                        }
                        if (s1 === peg$FAILED) {
                          if (input.substr(peg$currPos, 10) === peg$c118) {
                            s1 = peg$c118;
                            peg$currPos += 10;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c119); }
                          }
                          if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 13) === peg$c120) {
                              s1 = peg$c120;
                              peg$currPos += 13;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c121); }
                            }
                            if (s1 === peg$FAILED) {
                              if (input.substr(peg$currPos, 18) === peg$c122) {
                                s1 = peg$c122;
                                peg$currPos += 18;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c123); }
                              }
                              if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 10) === peg$c124) {
                                  s1 = peg$c124;
                                  peg$currPos += 10;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c125); }
                                }
                                if (s1 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 15) === peg$c126) {
                                    s1 = peg$c126;
                                    peg$currPos += 15;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c127); }
                                  }
                                  if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 7) === peg$c128) {
                                      s1 = peg$c128;
                                      peg$currPos += 7;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c129); }
                                    }
                                    if (s1 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 8) === peg$c130) {
                                        s1 = peg$c130;
                                        peg$currPos += 8;
                                      } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c131); }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c132();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 9) === peg$c133) {
          s1 = peg$c133;
          peg$currPos += 9;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c134); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 12) === peg$c135) {
            s1 = peg$c135;
            peg$currPos += 12;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c136); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 13) === peg$c137) {
              s1 = peg$c137;
              peg$currPos += 13;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c138); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 17) === peg$c139) {
                s1 = peg$c139;
                peg$currPos += 17;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c140); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 18) === peg$c141) {
                  s1 = peg$c141;
                  peg$currPos += 18;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c142); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 21) === peg$c143) {
                    s1 = peg$c143;
                    peg$currPos += 21;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c144); }
                  }
                }
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c145();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 16) === peg$c146) {
            s1 = peg$c146;
            peg$currPos += 16;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c147); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c148();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsept_political_party_arg() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c149) {
          s2 = peg$c149;
          peg$currPos += 4;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c150); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c151) {
            s2 = peg$c151;
            peg$currPos += 4;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c152); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c153(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsesoccer_club_nationality() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c154) {
          s2 = peg$c154;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c155); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c27) {
            s2 = peg$c27;
            peg$currPos += 2;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c28); }
          }
          if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c156) {
              s2 = peg$c156;
              peg$currPos += 2;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c157); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c158) {
                s2 = peg$c158;
                peg$currPos += 2;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c159); }
              }
              if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c25) {
                  s2 = peg$c25;
                  peg$currPos += 2;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c26); }
                }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c160();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseplace_name() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsequotation_mark();
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c161.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c162); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c161.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c162); }
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsequotation_mark();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c163(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseplace_label() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsequotation_mark();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c164) {
            s3 = peg$c164;
            peg$currPos += 8;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c165); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c166) {
              s3 = peg$c166;
              peg$currPos += 6;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c167); }
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsequotation_mark();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c168(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parselorem_string() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c169) {
          s2 = peg$c169;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c170); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c171(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsequotation_mark();
        if (s1 !== peg$FAILED) {
          if (input.substr(peg$currPos, 9) === peg$c172) {
            s2 = peg$c172;
            peg$currPos += 9;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c173); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsequotation_mark();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c171(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsequotation_mark();
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 10) === peg$c174) {
              s2 = peg$c174;
              peg$currPos += 10;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c175); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsequotation_mark();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c171(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }

      return s0;
    }

    function peg$parsedate() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$currPos;
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 48) {
          s5 = peg$c57;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
        if (s5 !== peg$FAILED) {
          if (peg$c50.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
          if (s6 !== peg$FAILED) {
            s5 = [s5, s6];
            s4 = s5;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 === peg$FAILED) {
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 49) {
            s5 = peg$c77;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c78); }
          }
          if (s5 !== peg$FAILED) {
            if (peg$c72.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c73); }
            }
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 === peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 50) {
              s5 = peg$c176;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c177); }
            }
            if (s5 !== peg$FAILED) {
              if (peg$c178.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c179); }
              }
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          }
        }
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s5 = peg$c13;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c14); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 48) {
              s7 = peg$c57;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c58); }
            }
            if (s7 !== peg$FAILED) {
              if (peg$c50.test(input.charAt(peg$currPos))) {
                s8 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c51); }
              }
              if (s8 !== peg$FAILED) {
                s7 = [s7, s8];
                s6 = s7;
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            } else {
              peg$currPos = s6;
              s6 = peg$FAILED;
            }
            if (s6 === peg$FAILED) {
              s6 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 49) {
                s7 = peg$c77;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c78); }
              }
              if (s7 !== peg$FAILED) {
                if (peg$c180.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c181); }
                }
                if (s8 !== peg$FAILED) {
                  s7 = [s7, s8];
                  s6 = s7;
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            }
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 === peg$FAILED) {
          s3 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c182) {
            s4 = peg$c182;
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c183); }
          }
          if (s4 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c184) {
              s4 = peg$c184;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c185); }
            }
            if (s4 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c186) {
                s4 = peg$c186;
                peg$currPos += 2;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c187); }
              }
            }
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s5 = peg$c13;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c14); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 48) {
                s7 = peg$c57;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c58); }
              }
              if (s7 !== peg$FAILED) {
                if (peg$c188.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c189); }
                }
                if (s8 !== peg$FAILED) {
                  s7 = [s7, s8];
                  s6 = s7;
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
              if (s6 === peg$FAILED) {
                s6 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 49) {
                  s7 = peg$c77;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c78); }
                }
                if (s7 !== peg$FAILED) {
                  if (peg$c190.test(input.charAt(peg$currPos))) {
                    s8 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c191); }
                  }
                  if (s8 !== peg$FAILED) {
                    s7 = [s7, s8];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              }
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c182) {
              s4 = peg$c182;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c183); }
            }
            if (s4 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c184) {
                s4 = peg$c184;
                peg$currPos += 2;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c185); }
              }
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s5 = peg$c13;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c14); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 48) {
                  s7 = peg$c57;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c58); }
                }
                if (s7 !== peg$FAILED) {
                  if (peg$c192.test(input.charAt(peg$currPos))) {
                    s8 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c193); }
                  }
                  if (s8 !== peg$FAILED) {
                    s7 = [s7, s8];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
                if (s6 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c194) {
                    s6 = peg$c194;
                    peg$currPos += 2;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c195); }
                  }
                }
                if (s6 !== peg$FAILED) {
                  s4 = [s4, s5, s6];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        }
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s4 = peg$c13;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c14); }
          }
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c196) {
              s5 = peg$c196;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c197); }
            }
            if (s5 === peg$FAILED) {
              s5 = peg$currPos;
              if (peg$c198.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c199); }
              }
              if (s6 !== peg$FAILED) {
                if (peg$c72.test(input.charAt(peg$currPos))) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s7 !== peg$FAILED) {
                  s6 = [s6, s7];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            }
            if (s5 !== peg$FAILED) {
              if (peg$c72.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c73); }
              }
              if (s6 !== peg$FAILED) {
                if (peg$c72.test(input.charAt(peg$currPos))) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s7 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6, s7];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c182) {
            s3 = peg$c182;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c183); }
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s4 = peg$c13;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c14); }
            }
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c200) {
                s5 = peg$c200;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c201); }
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                  s6 = peg$c13;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c14); }
                }
                if (s6 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c196) {
                    s7 = peg$c196;
                    peg$currPos += 2;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c197); }
                  }
                  if (s7 === peg$FAILED) {
                    s7 = peg$currPos;
                    if (peg$c198.test(input.charAt(peg$currPos))) {
                      s8 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c199); }
                    }
                    if (s8 !== peg$FAILED) {
                      if (peg$c72.test(input.charAt(peg$currPos))) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c73); }
                      }
                      if (s9 !== peg$FAILED) {
                        s8 = [s8, s9];
                        s7 = s8;
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c63) {
                      s8 = peg$c63;
                      peg$currPos += 2;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c64); }
                    }
                    if (s8 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c202) {
                        s8 = peg$c202;
                        peg$currPos += 2;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c203); }
                      }
                      if (s8 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c204) {
                          s8 = peg$c204;
                          peg$currPos += 2;
                        } else {
                          s8 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c205); }
                        }
                        if (s8 === peg$FAILED) {
                          if (input.substr(peg$currPos, 2) === peg$c206) {
                            s8 = peg$c206;
                            peg$currPos += 2;
                          } else {
                            s8 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c207); }
                          }
                          if (s8 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c208) {
                              s8 = peg$c208;
                              peg$currPos += 2;
                            } else {
                              s8 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c209); }
                            }
                            if (s8 === peg$FAILED) {
                              if (input.substr(peg$currPos, 2) === peg$c210) {
                                s8 = peg$c210;
                                peg$currPos += 2;
                              } else {
                                s8 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c211); }
                              }
                              if (s8 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c212) {
                                  s8 = peg$c212;
                                  peg$currPos += 2;
                                } else {
                                  s8 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c213); }
                                }
                                if (s8 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 2) === peg$c214) {
                                    s8 = peg$c214;
                                    peg$currPos += 2;
                                  } else {
                                    s8 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c215); }
                                  }
                                  if (s8 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c216) {
                                      s8 = peg$c216;
                                      peg$currPos += 2;
                                    } else {
                                      s8 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c217); }
                                    }
                                    if (s8 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 2) === peg$c218) {
                                        s8 = peg$c218;
                                        peg$currPos += 2;
                                      } else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c219); }
                                      }
                                      if (s8 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 2) === peg$c220) {
                                          s8 = peg$c220;
                                          peg$currPos += 2;
                                        } else {
                                          s8 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c221); }
                                        }
                                        if (s8 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 2) === peg$c222) {
                                            s8 = peg$c222;
                                            peg$currPos += 2;
                                          } else {
                                            s8 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c223); }
                                          }
                                          if (s8 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 2) === peg$c224) {
                                              s8 = peg$c224;
                                              peg$currPos += 2;
                                            } else {
                                              s8 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c225); }
                                            }
                                            if (s8 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 2) === peg$c226) {
                                                s8 = peg$c226;
                                                peg$currPos += 2;
                                              } else {
                                                s8 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c227); }
                                              }
                                              if (s8 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 2) === peg$c228) {
                                                  s8 = peg$c228;
                                                  peg$currPos += 2;
                                                } else {
                                                  s8 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c229); }
                                                }
                                                if (s8 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 2) === peg$c230) {
                                                    s8 = peg$c230;
                                                    peg$currPos += 2;
                                                  } else {
                                                    s8 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c231); }
                                                  }
                                                  if (s8 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 2) === peg$c232) {
                                                      s8 = peg$c232;
                                                      peg$currPos += 2;
                                                    } else {
                                                      s8 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c233); }
                                                    }
                                                    if (s8 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 2) === peg$c234) {
                                                        s8 = peg$c234;
                                                        peg$currPos += 2;
                                                      } else {
                                                        s8 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c235); }
                                                      }
                                                      if (s8 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 2) === peg$c236) {
                                                          s8 = peg$c236;
                                                          peg$currPos += 2;
                                                        } else {
                                                          s8 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c237); }
                                                        }
                                                        if (s8 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 2) === peg$c238) {
                                                            s8 = peg$c238;
                                                            peg$currPos += 2;
                                                          } else {
                                                            s8 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c239); }
                                                          }
                                                          if (s8 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 2) === peg$c240) {
                                                              s8 = peg$c240;
                                                              peg$currPos += 2;
                                                            } else {
                                                              s8 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c241); }
                                                            }
                                                            if (s8 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 2) === peg$c242) {
                                                                s8 = peg$c242;
                                                                peg$currPos += 2;
                                                              } else {
                                                                s8 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c243); }
                                                              }
                                                              if (s8 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 2) === peg$c244) {
                                                                  s8 = peg$c244;
                                                                  peg$currPos += 2;
                                                                } else {
                                                                  s8 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c245); }
                                                                }
                                                                if (s8 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 2) === peg$c246) {
                                                                    s8 = peg$c246;
                                                                    peg$currPos += 2;
                                                                  } else {
                                                                    s8 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c247); }
                                                                  }
                                                                  if (s8 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 2) === peg$c248) {
                                                                      s8 = peg$c248;
                                                                      peg$currPos += 2;
                                                                    } else {
                                                                      s8 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    if (s8 !== peg$FAILED) {
                      s3 = [s3, s4, s5, s6, s7, s8];
                      s2 = s3;
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c250(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsedate_format() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c251) {
          s3 = peg$c251;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c252); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsedate_separator();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c253) {
              s5 = peg$c253;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c254); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsedate_separator();
              if (s6 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c255) {
                  s7 = peg$c255;
                  peg$currPos += 4;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c256); }
                }
                if (s7 === peg$FAILED) {
                  if (input.substr(peg$currPos, 4) === peg$c257) {
                    s7 = peg$c257;
                    peg$currPos += 4;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c258); }
                  }
                }
                if (s7 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6, s7];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c259(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsequotation_mark();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c253) {
            s3 = peg$c253;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c254); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsedate_separator();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c251) {
                s5 = peg$c251;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c252); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsedate_separator();
                if (s6 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 4) === peg$c255) {
                    s7 = peg$c255;
                    peg$currPos += 4;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c256); }
                  }
                  if (s7 === peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c257) {
                      s7 = peg$c257;
                      peg$currPos += 4;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c258); }
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    s3 = [s3, s4, s5, s6, s7];
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsequotation_mark();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c259(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsequotation_mark();
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c255) {
              s3 = peg$c255;
              peg$currPos += 4;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c256); }
            }
            if (s3 === peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c257) {
                s3 = peg$c257;
                peg$currPos += 4;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c258); }
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsedate_separator();
              if (s4 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c253) {
                  s5 = peg$c253;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c254); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsedate_separator();
                  if (s6 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c251) {
                      s7 = peg$c251;
                      peg$currPos += 2;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c252); }
                    }
                    if (s7 !== peg$FAILED) {
                      s3 = [s3, s4, s5, s6, s7];
                      s2 = s3;
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsequotation_mark();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c259(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }

      return s0;
    }

    function peg$parsekey() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      if (peg$c260.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c261); }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c260.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c261); }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (peg$c262.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c263); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$c264.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c265); }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c264.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c265); }
            }
          }
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c266(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        if (peg$c262.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c263); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c264.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c265); }
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            if (peg$c264.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c265); }
            }
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c266(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$parseunescaped();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseescape();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s2 = peg$c65;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c267;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c268); }
            }
            if (s2 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s2 = peg$c13;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c14); }
              }
              if (s2 === peg$FAILED) {
                s2 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 98) {
                  s3 = peg$c269;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c270); }
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c271();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 102) {
                    s3 = peg$c272;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c273); }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c274();
                  }
                  s2 = s3;
                  if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 110) {
                      s3 = peg$c275;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c276); }
                    }
                    if (s3 !== peg$FAILED) {
                      peg$savedPos = s2;
                      s3 = peg$c277();
                    }
                    s2 = s3;
                    if (s2 === peg$FAILED) {
                      s2 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 114) {
                        s3 = peg$c278;
                        peg$currPos++;
                      } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c279); }
                      }
                      if (s3 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c280();
                      }
                      s2 = s3;
                      if (s2 === peg$FAILED) {
                        s2 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 116) {
                          s3 = peg$c281;
                          peg$currPos++;
                        } else {
                          s3 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c282); }
                        }
                        if (s3 !== peg$FAILED) {
                          peg$savedPos = s2;
                          s3 = peg$c283();
                        }
                        s2 = s3;
                        if (s2 === peg$FAILED) {
                          s2 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 117) {
                            s3 = peg$c284;
                            peg$currPos++;
                          } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c285); }
                          }
                          if (s3 !== peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$currPos;
                            s6 = peg$parseHEXDIG();
                            if (s6 !== peg$FAILED) {
                              s7 = peg$parseHEXDIG();
                              if (s7 !== peg$FAILED) {
                                s8 = peg$parseHEXDIG();
                                if (s8 !== peg$FAILED) {
                                  s9 = peg$parseHEXDIG();
                                  if (s9 !== peg$FAILED) {
                                    s6 = [s6, s7, s8, s9];
                                    s5 = s6;
                                  } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s5;
                                  s5 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s5;
                              s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                              s4 = input.substring(s4, peg$currPos);
                            } else {
                              s4 = s5;
                            }
                            if (s4 !== peg$FAILED) {
                              peg$savedPos = s2;
                              s3 = peg$c286(s4);
                              s2 = s3;
                            } else {
                              peg$currPos = s2;
                              s2 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c287(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseescape() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 92) {
        s0 = peg$c267;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c268); }
      }

      return s0;
    }

    function peg$parsequotation_mark() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 34) {
        s0 = peg$c65;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }

      return s0;
    }

    function peg$parseapostrophe() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 39) {
        s0 = peg$c288;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c289); }
      }

      return s0;
    }

    function peg$parseunescaped() {
      var s0;

      if (peg$c290.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c291); }
      }

      return s0;
    }

    function peg$parseinterpolation() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseapostrophe();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = [];
        if (peg$c292.test(input.charAt(peg$currPos))) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c293); }
        }
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c292.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c293); }
            }
          }
        } else {
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          peg$savedPos = s3;
          s4 = peg$c294(s4);
        }
        s3 = s4;
        if (s3 === peg$FAILED) {
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 123) {
            s4 = peg$c3;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c4); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseafter_curly_bracket();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c295(s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = [];
          if (peg$c292.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c293); }
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c292.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c293); }
              }
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c294(s4);
          }
          s3 = s4;
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseafter_curly_bracket();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c295(s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseapostrophe();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c296(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseafter_curly_bracket() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c3;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsemoustaches_value();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c297) {
                s5 = peg$c297;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c298); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c0(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (peg$c292.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c293); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c299(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsemoustaches_value() {
      var s0;

      s0 = peg$parsegen_moustaches();
      if (s0 === peg$FAILED) {
        s0 = peg$parseapi_moustaches();
      }

      return s0;
    }

    function peg$parsegen_moustaches() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c300) {
        s1 = peg$c300;
        peg$currPos += 9;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c301); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c302;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c303); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c304();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c305) {
          s1 = peg$c305;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c306); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c302;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c303); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c307();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c308) {
            s1 = peg$c308;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c309); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsews();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s3 = peg$c302;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c303); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c310();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c311) {
              s1 = peg$c311;
              peg$currPos += 5;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c312); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsews();
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s3 = peg$c302;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c303); }
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c313();
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 8) === peg$c314) {
                s1 = peg$c314;
                peg$currPos += 8;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c315); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsews();
                if (s2 !== peg$FAILED) {
                  s3 = peg$parseint();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parsews();
                    if (s4 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 44) {
                        s5 = peg$c11;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c12); }
                      }
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parsews();
                        if (s6 !== peg$FAILED) {
                          s7 = peg$parseint();
                          if (s7 !== peg$FAILED) {
                            s8 = peg$parsews();
                            if (s8 !== peg$FAILED) {
                              s9 = peg$currPos;
                              if (input.charCodeAt(peg$currPos) === 44) {
                                s10 = peg$c11;
                                peg$currPos++;
                              } else {
                                s10 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c12); }
                              }
                              if (s10 !== peg$FAILED) {
                                s11 = peg$parsequotation_mark();
                                if (s11 !== peg$FAILED) {
                                  if (input.length > peg$currPos) {
                                    s12 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                  } else {
                                    s12 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c316); }
                                  }
                                  if (s12 !== peg$FAILED) {
                                    s13 = peg$parsequotation_mark();
                                    if (s13 !== peg$FAILED) {
                                      peg$savedPos = s9;
                                      s10 = peg$c317(s3, s7, s12);
                                      s9 = s10;
                                    } else {
                                      peg$currPos = s9;
                                      s9 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s9;
                                    s9 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s9;
                                  s9 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s9;
                                s9 = peg$FAILED;
                              }
                              if (s9 === peg$FAILED) {
                                s9 = null;
                              }
                              if (s9 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                  s10 = peg$c302;
                                  peg$currPos++;
                                } else {
                                  s10 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c303); }
                                }
                                if (s10 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c318(s3, s7, s9);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 9) === peg$c319) {
                  s1 = peg$c319;
                  peg$currPos += 9;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c320); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$parsews();
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parsenumber();
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parsews();
                      if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                          s5 = peg$c11;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c12); }
                        }
                        if (s5 !== peg$FAILED) {
                          s6 = peg$parsews();
                          if (s6 !== peg$FAILED) {
                            s7 = peg$parsenumber();
                            if (s7 !== peg$FAILED) {
                              s8 = peg$parsews();
                              if (s8 !== peg$FAILED) {
                                s9 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 44) {
                                  s10 = peg$c11;
                                  peg$currPos++;
                                } else {
                                  s10 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c12); }
                                }
                                if (s10 !== peg$FAILED) {
                                  s11 = peg$parsews();
                                  if (s11 !== peg$FAILED) {
                                    s12 = peg$parseint();
                                    if (s12 !== peg$FAILED) {
                                      s13 = peg$parsews();
                                      if (s13 !== peg$FAILED) {
                                        s14 = peg$currPos;
                                        if (input.charCodeAt(peg$currPos) === 44) {
                                          s15 = peg$c11;
                                          peg$currPos++;
                                        } else {
                                          s15 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c12); }
                                        }
                                        if (s15 !== peg$FAILED) {
                                          s16 = peg$parsefloat_format();
                                          if (s16 !== peg$FAILED) {
                                            peg$savedPos = s14;
                                            s15 = peg$c321(s3, s7, s12, s16);
                                            s14 = s15;
                                          } else {
                                            peg$currPos = s14;
                                            s14 = peg$FAILED;
                                          }
                                        } else {
                                          peg$currPos = s14;
                                          s14 = peg$FAILED;
                                        }
                                        if (s14 === peg$FAILED) {
                                          s14 = null;
                                        }
                                        if (s14 !== peg$FAILED) {
                                          peg$savedPos = s9;
                                          s10 = peg$c322(s3, s7, s12, s14);
                                          s9 = s10;
                                        } else {
                                          peg$currPos = s9;
                                          s9 = peg$FAILED;
                                        }
                                      } else {
                                        peg$currPos = s9;
                                        s9 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s9;
                                      s9 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s9;
                                    s9 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s9;
                                  s9 = peg$FAILED;
                                }
                                if (s9 === peg$FAILED) {
                                  s9 = null;
                                }
                                if (s9 !== peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 41) {
                                    s10 = peg$c302;
                                    peg$currPos++;
                                  } else {
                                    s10 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c303); }
                                  }
                                  if (s10 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c323(s3, s7, s9);
                                    s0 = s1;
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 9) === peg$c324) {
                    s1 = peg$c324;
                    peg$currPos += 9;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c325); }
                  }
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parsews();
                    if (s2 !== peg$FAILED) {
                      s3 = peg$currPos;
                      s4 = peg$parselat_interval();
                      if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                          s5 = peg$c11;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c12); }
                        }
                        if (s5 !== peg$FAILED) {
                          s6 = peg$parselong_interval();
                          if (s6 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c326(s4, s6);
                            s3 = s4;
                          } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                      if (s3 === peg$FAILED) {
                        s3 = null;
                      }
                      if (s3 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s4 = peg$c302;
                          peg$currPos++;
                        } else {
                          s4 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c303); }
                        }
                        if (s4 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c327(s3);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 6) === peg$c328) {
                      s1 = peg$c328;
                      peg$currPos += 6;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c329); }
                    }
                    if (s1 !== peg$FAILED) {
                      s2 = peg$parsews();
                      if (s2 !== peg$FAILED) {
                        s3 = peg$parsetrue();
                        if (s3 === peg$FAILED) {
                          s3 = peg$parsefalse();
                        }
                        if (s3 === peg$FAILED) {
                          s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                          s4 = peg$parsews();
                          if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                              s5 = peg$c302;
                              peg$currPos++;
                            } else {
                              s5 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c303); }
                            }
                            if (s5 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c330(s3);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.substr(peg$currPos, 5) === peg$c331) {
                        s1 = peg$c331;
                        peg$currPos += 5;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c332); }
                      }
                      if (s1 !== peg$FAILED) {
                        s2 = peg$parsews();
                        if (s2 !== peg$FAILED) {
                          s3 = peg$parsedate();
                          if (s3 !== peg$FAILED) {
                            s4 = peg$parsews();
                            if (s4 !== peg$FAILED) {
                              s5 = peg$currPos;
                              if (input.charCodeAt(peg$currPos) === 44) {
                                s6 = peg$c11;
                                peg$currPos++;
                              } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c12); }
                              }
                              if (s6 !== peg$FAILED) {
                                s7 = peg$parsews();
                                if (s7 !== peg$FAILED) {
                                  s8 = peg$parsedate();
                                  if (s8 !== peg$FAILED) {
                                    s9 = peg$parsews();
                                    if (s9 !== peg$FAILED) {
                                      peg$savedPos = s5;
                                      s6 = peg$c333(s3, s8);
                                      s5 = s6;
                                    } else {
                                      peg$currPos = s5;
                                      s5 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s5;
                                  s5 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                              }
                              if (s5 === peg$FAILED) {
                                s5 = null;
                              }
                              if (s5 !== peg$FAILED) {
                                s6 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 44) {
                                  s7 = peg$c11;
                                  peg$currPos++;
                                } else {
                                  s7 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c12); }
                                }
                                if (s7 !== peg$FAILED) {
                                  s8 = peg$parsews();
                                  if (s8 !== peg$FAILED) {
                                    s9 = peg$parsedate_format();
                                    if (s9 !== peg$FAILED) {
                                      s10 = peg$parsews();
                                      if (s10 !== peg$FAILED) {
                                        peg$savedPos = s6;
                                        s7 = peg$c334(s3, s5, s9);
                                        s6 = s7;
                                      } else {
                                        peg$currPos = s6;
                                        s6 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s6;
                                      s6 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s6;
                                  s6 = peg$FAILED;
                                }
                                if (s6 === peg$FAILED) {
                                  s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 41) {
                                    s7 = peg$c302;
                                    peg$currPos++;
                                  } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c303); }
                                  }
                                  if (s7 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c335(s3, s5, s6);
                                    s0 = s1;
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 7) === peg$c336) {
                          s1 = peg$c336;
                          peg$currPos += 7;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c337); }
                        }
                        if (s1 !== peg$FAILED) {
                          s2 = peg$parsews();
                          if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = peg$parsesimple_value();
                            if (s4 !== peg$FAILED) {
                              s5 = [];
                              s6 = peg$currPos;
                              s7 = peg$parsevalue_separator();
                              if (s7 !== peg$FAILED) {
                                s8 = peg$parsesimple_value();
                                if (s8 !== peg$FAILED) {
                                  peg$savedPos = s6;
                                  s7 = peg$c45(s4, s8);
                                  s6 = s7;
                                } else {
                                  peg$currPos = s6;
                                  s6 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                              }
                              while (s6 !== peg$FAILED) {
                                s5.push(s6);
                                s6 = peg$currPos;
                                s7 = peg$parsevalue_separator();
                                if (s7 !== peg$FAILED) {
                                  s8 = peg$parsesimple_value();
                                  if (s8 !== peg$FAILED) {
                                    peg$savedPos = s6;
                                    s7 = peg$c45(s4, s8);
                                    s6 = s7;
                                  } else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s6;
                                  s6 = peg$FAILED;
                                }
                              }
                              if (s5 !== peg$FAILED) {
                                peg$savedPos = s3;
                                s4 = peg$c46(s4, s5);
                                s3 = s4;
                              } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s3;
                              s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                              s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 41) {
                                s4 = peg$c302;
                                peg$currPos++;
                              } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c303); }
                              }
                              if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c338(s3);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.substr(peg$currPos, 6) === peg$c339) {
                            s1 = peg$c339;
                            peg$currPos += 6;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c340); }
                          }
                          if (s1 !== peg$FAILED) {
                            s2 = peg$parsews();
                            if (s2 !== peg$FAILED) {
                              s3 = peg$parseint();
                              if (s3 !== peg$FAILED) {
                                s4 = peg$parsews();
                                if (s4 !== peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 44) {
                                    s5 = peg$c11;
                                    peg$currPos++;
                                  } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c12); }
                                  }
                                  if (s5 !== peg$FAILED) {
                                    s6 = peg$parsews();
                                    if (s6 !== peg$FAILED) {
                                      s7 = peg$parselorem_string();
                                      if (s7 !== peg$FAILED) {
                                        s8 = peg$parsews();
                                        if (s8 !== peg$FAILED) {
                                          if (input.charCodeAt(peg$currPos) === 41) {
                                            s9 = peg$c302;
                                            peg$currPos++;
                                          } else {
                                            s9 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c303); }
                                          }
                                          if (s9 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c341(s3, s7);
                                            s0 = s1;
                                          } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                          }
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$FAILED;
                                        }
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseapi_moustaches() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$parsesimple_api_key();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 10) === peg$c342) {
          s1 = peg$c342;
          peg$currPos += 10;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c343); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseplace_name();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c302;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c303); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c344(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 10) === peg$c345) {
            s1 = peg$c345;
            peg$currPos += 10;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c346); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseplace_label();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s3 = peg$c11;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c12); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseplace_name();
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s5 = peg$c302;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c303); }
                  }
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c347(s2, s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 19) === peg$c348) {
              s1 = peg$c348;
              peg$currPos += 19;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c349); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsews();
              if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$parsept_political_party_arg();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c350(s4);
                }
                s3 = s4;
                if (s3 === peg$FAILED) {
                  s3 = null;
                }
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s4 = peg$c302;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c303); }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c351(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 12) === peg$c352) {
                s1 = peg$c352;
                peg$currPos += 12;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c353); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsews();
                if (s2 !== peg$FAILED) {
                  s3 = peg$currPos;
                  s4 = peg$parsesoccer_club_nationality();
                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c350(s4);
                  }
                  s3 = s4;
                  if (s3 === peg$FAILED) {
                    s3 = null;
                  }
                  if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s4 = peg$c302;
                      peg$currPos++;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c303); }
                    }
                    if (s4 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c354(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsedirective() {
      var s0;

      s0 = peg$parserepeat_any_seq();
      if (s0 === peg$FAILED) {
        s0 = peg$parserange();
      }

      return s0;
    }

    function peg$parserepeat_any_seq() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parserepeat_any();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parserepeat_any();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c355(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$currPos;
            s6 = peg$parsevalue_separator();
            if (s6 !== peg$FAILED) {
              s7 = peg$parserepeat_any();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c355(s3, s7);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c356(s3, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseend_array();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c357(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parserepeat_any() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parserepeat_signature();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s3 = peg$c9;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsevalue();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c358(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parserepeat_object_seq() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parserepeat_object();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parserepeat_object();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c355(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$currPos;
            s6 = peg$parsevalue_separator();
            if (s6 !== peg$FAILED) {
              s7 = peg$parserepeat_object();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c355(s3, s7);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c356(s3, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseend_array();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c359(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parserepeat_object() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parserepeat_signature();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s3 = peg$c9;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseobject();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c360(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parserepeat_signature() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c288;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c289); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c361) {
            s3 = peg$c361;
            peg$currPos += 6;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c362); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s5 = peg$c363;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c364); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseint();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 44) {
                        s9 = peg$c11;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c12); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsews();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseint();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parsews();
                            if (s12 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 41) {
                                s13 = peg$c302;
                                peg$currPos++;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c303); }
                              }
                              if (s13 !== peg$FAILED) {
                                s14 = peg$parsews();
                                if (s14 !== peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 39) {
                                    s15 = peg$c288;
                                    peg$currPos++;
                                  } else {
                                    s15 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c289); }
                                  }
                                  if (s15 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c365(s7, s11);
                                    s0 = s1;
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c288;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c289); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c361) {
              s3 = peg$c361;
              peg$currPos += 6;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c362); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 40) {
                  s5 = peg$c363;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c364); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsews();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseint();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsews();
                      if (s8 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s9 = peg$c302;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c303); }
                        }
                        if (s9 !== peg$FAILED) {
                          s10 = peg$parsews();
                          if (s10 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 39) {
                              s11 = peg$c288;
                              peg$currPos++;
                            } else {
                              s11 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c289); }
                            }
                            if (s11 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c366(s7);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parserange() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c367) {
        s1 = peg$c367;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c368); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseint();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c302;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c303); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c369(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c367) {
          s1 = peg$c367;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c368); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseint();
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s5 = peg$c11;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c12); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsews();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseint();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsews();
                      if (s8 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s9 = peg$c302;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c303); }
                        }
                        if (s9 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c370(s3, s7);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseprobability() {
      var s0;

      s0 = peg$parsemissing();
      if (s0 === peg$FAILED) {
        s0 = peg$parsehaving();
      }

      return s0;
    }

    function peg$parsemissing() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c371) {
        s1 = peg$c371;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c372); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (peg$c50.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
          if (s4 !== peg$FAILED) {
            if (peg$c72.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c73); }
            }
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c302;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c303); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 58) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 123) {
                        s9 = peg$c3;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c4); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsews();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parsemember();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parsews();
                            if (s12 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 125) {
                                s13 = peg$c7;
                                peg$currPos++;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c8); }
                              }
                              if (s13 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c373(s3, s11);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsehaving() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c374) {
        s1 = peg$c374;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c375); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (peg$c50.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
          if (s4 !== peg$FAILED) {
            if (peg$c72.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c73); }
            }
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c302;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c303); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsews();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 58) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsews();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 123) {
                        s9 = peg$c3;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c4); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsews();
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parsemember();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parsews();
                            if (s12 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 125) {
                                s13 = peg$c7;
                                peg$currPos++;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c8); }
                              }
                              if (s13 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c376(s3, s11);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDIGIT() {
      var s0;

      if (peg$c72.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c73); }
      }

      return s0;
    }

    function peg$parseHEXDIG() {
      var s0;

      if (peg$c377.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c378); }
      }

      return s0;
    }


      var language = "pt" //"pt" or "en", "pt" by default
      var random_id = "i04e8b563117bc2ed52e02b7"
      var keys = ["objectId","guid","index","boolean","integer","floating","position","phone","date","random","lorem","having","missing"]

      function renameProperty(obj, old_key, new_key) {
        Object.defineProperty(obj, new_key, Object.getOwnPropertyDescriptor(obj, old_key));
        delete obj[old_key]
        return obj
      }

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

      function resolveInterpolation(arr, i) {
        for (var j = 0; j < arr.length; j++) {
          if (isObject(arr[j])) {
            var value = resolveMoustaches(arr[j],i)
            arr[j] = (isObject(value)) ? JSON.stringify(value) : value
          }
        }
        return arr.join("")
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
          if (obj.moustaches == "interpolation") obj = resolveInterpolation(obj.value, i)
          else if (hasGenKey(obj)) obj = callGenAPI(obj, i)
          else obj = callDataAPI(obj)
        }
        else {
          var genKeys = [], dbKeys = []
          Object.keys(obj).forEach(k => {
            if (isObject(obj[k]) && hasMoustaches(obj[k])) {
              if (obj[k].moustaches == "interpolation") obj[k] = resolveInterpolation(obj[k].value, i)
              else if (hasGenKey(obj[k])) genKeys.push(k)
              else dbKeys.push(k)
            }
          })

          genKeys.forEach(k => {
            obj[k] = callGenAPI(obj[k],i)
            if (obj[k] === null) delete obj[k]
          })

          dbKeys.forEach(k => obj[k] = callDataAPI(obj[k]))

          /**********************************************************/
          //código para iterar objetos e arrays ao construir o modelo
          
          //objetos sem propriedade "moustaches" válida
          var objectKeys = Object.keys(obj).filter(k => isObject(obj[k]) && !hasMoustaches(obj[k]))
          objectKeys.forEach(k => { obj[k] = resolveMoustaches(obj[k],i) })
          
          var arrKeys = Object.keys(obj).filter(k => Array.isArray(obj[k]))
          arrKeys.forEach(k => {
            for (var j = 0; j < obj[k].length; j++) {
              if (isObject(obj[k][j])) obj[k][j] = resolveMoustaches(obj[k][j],i)
            }
          })
          /**********************************************************/
        }
        
        if (isObject(obj) && random_id in obj) obj = renameProperty(obj, random_id, "moustaches")
        return obj
      }

      function repeatArray(size, obj) {
        var arr = []
        for (var i = 0; i < size; i++) arr.push(resolveMoustaches(clone(obj),i))
        return arr
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

export default parser