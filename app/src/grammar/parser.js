import genAPI from './moustaches'
import dataAPI from '../data/API'
import vm from 'vm'

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

        peg$c0 = function(value) { return {dataModel: value, components} },
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
        peg$c32 = function(val) { return val.data[0] },
        peg$c33 = "false",
        peg$c34 = peg$literalExpectation("false", false),
        peg$c35 = function() { return {model: {type: Boolean, required: true}, data: Array(queue_prod).fill(false)} },
        peg$c36 = "null",
        peg$c37 = peg$literalExpectation("null", false),
        peg$c38 = function() { return {model: {type: String, required: false}, data: Array(queue_prod).fill(null)} },
        peg$c39 = "true",
        peg$c40 = peg$literalExpectation("true", false),
        peg$c41 = function() { return {model: {type: Boolean, required: true}, data: Array(queue_prod).fill(true)} },
        peg$c42 = function(head, m) { return m; },
        peg$c43 = function(head, tail) {
                var result = {};

                [head].concat(tail).forEach(function(element) {
                  result[element.name] = element.value;
                })

                return result;
              },
        peg$c44 = function(members) {
              var values = [], model = !queue.length ? {} : {type: {}, required: true}
              //objeto de nível superior
              if (!queue.length) {
                for (var prop1 in members) {
                  model[prop1] = members[prop1].model
                  members[prop1] = members[prop1].data
                }
                values = members
              }
              //objetos aninhados (components)
              else {
                for (var i = 0; i < queue_prod; i++) values.push({})

                for (var prop2 in members) {
                  model.type[prop2] = members[prop2].model
                  var prob = "probability" in members[prop2]

                  for (var j = 0; j < queue_prod; j++) {
                    if (!prob || (prob && members[prop2].data[j] !== null)) values[j][prop2] = members[prop2].data[j]
                  }
                }
              }
              return members !== null ? {model, data: values} : {}
            },
        peg$c45 = function(name, value) { return { name, value } },
        peg$c46 = function(head, v) { return v },
        peg$c47 = function(head, tail) { return [head].concat(tail) },
        peg$c48 = function(arr) {
              var model = {type: [], required: true}, values = []
              for (var i = 0; i < queue_prod; i++) values.push([])

              for (var j = 0; j < arr.length; j++) {
                model.type.push(arr[j].model)
                for (var k = 0; k < queue_prod; k++) values[k].push(arr[j].data[k])
              }

              //criar modelo e dar push para components

              return arr !== null ? {model, data: values} : []
            },
        peg$c49 = peg$otherExpectation("number"),
        peg$c50 = function() {
            var num = parseFloat(text())
            return {model: {type: Number, required: true}, data: Array(queue_prod).fill(num)}
          },
        peg$c51 = /^[1-9]/,
        peg$c52 = peg$classExpectation([["1", "9"]], false, false),
        peg$c53 = /^[eE]/,
        peg$c54 = peg$classExpectation(["e", "E"], false, false),
        peg$c55 = function(i) {return i},
        peg$c56 = function(integer) {
            return parseInt(Array.isArray(integer) ? integer.flat().join("") : integer)
          },
        peg$c57 = "+",
        peg$c58 = peg$literalExpectation("+", false),
        peg$c59 = "0",
        peg$c60 = peg$literalExpectation("0", false),
        peg$c61 = "\"0",
        peg$c62 = peg$literalExpectation("\"0", false),
        peg$c63 = /^[^0-9]/,
        peg$c64 = peg$classExpectation([["0", "9"]], true, false),
        peg$c65 = "00",
        peg$c66 = peg$literalExpectation("00", false),
        peg$c67 = "\"",
        peg$c68 = peg$literalExpectation("\"", false),
        peg$c69 = function(int_sep, dec_sep, unit) { return {int_sep, dec_sep, unit} },
        peg$c70 = "90",
        peg$c71 = peg$literalExpectation("90", false),
        peg$c72 = /^[1-8]/,
        peg$c73 = peg$classExpectation([["1", "8"]], false, false),
        peg$c74 = /^[0-9]/,
        peg$c75 = peg$classExpectation([["0", "9"]], false, false),
        peg$c76 = function() { return parseFloat(text()); },
        peg$c77 = function(min, max) { return {min, max} },
        peg$c78 = "180",
        peg$c79 = peg$literalExpectation("180", false),
        peg$c80 = "1",
        peg$c81 = peg$literalExpectation("1", false),
        peg$c82 = /^[0-7]/,
        peg$c83 = peg$classExpectation([["0", "7"]], false, false),
        peg$c84 = peg$otherExpectation("string"),
        peg$c85 = function(chars) {
            var str = chars.join("")
            return { model: {type: String, required: true}, data: Array(queue_prod).fill(str) }
          },
        peg$c86 = "(",
        peg$c87 = peg$literalExpectation("(", false),
        peg$c88 = ")",
        peg$c89 = peg$literalExpectation(")", false),
        peg$c90 = function(api) {
            return {
              model: {type: String, required: true}, 
              data: fillArray("data", api, text().split("(")[0], [])
            }
          },
        peg$c91 = "pt_district",
        peg$c92 = peg$literalExpectation("pt_district", false),
        peg$c93 = "pt_county",
        peg$c94 = peg$literalExpectation("pt_county", false),
        peg$c95 = "pt_parish",
        peg$c96 = peg$literalExpectation("pt_parish", false),
        peg$c97 = function() { return "districts" },
        peg$c98 = "firstName",
        peg$c99 = peg$literalExpectation("firstName", false),
        peg$c100 = "surname",
        peg$c101 = peg$literalExpectation("surname", false),
        peg$c102 = "fullName",
        peg$c103 = peg$literalExpectation("fullName", false),
        peg$c104 = function() { return "names" },
        peg$c105 = "actor",
        peg$c106 = peg$literalExpectation("actor", false),
        peg$c107 = "animal",
        peg$c108 = peg$literalExpectation("animal", false),
        peg$c109 = "brand",
        peg$c110 = peg$literalExpectation("brand", false),
        peg$c111 = "buzzword",
        peg$c112 = peg$literalExpectation("buzzword", false),
        peg$c113 = "capital",
        peg$c114 = peg$literalExpectation("capital", false),
        peg$c115 = "car_brand",
        peg$c116 = peg$literalExpectation("car_brand", false),
        peg$c117 = "continent",
        peg$c118 = peg$literalExpectation("continent", false),
        peg$c119 = "cultural_center",
        peg$c120 = peg$literalExpectation("cultural_center", false),
        peg$c121 = "day",
        peg$c122 = peg$literalExpectation("day", false),
        peg$c123 = "hacker",
        peg$c124 = peg$literalExpectation("hacker", false),
        peg$c125 = "job",
        peg$c126 = peg$literalExpectation("job", false),
        peg$c127 = "month",
        peg$c128 = peg$literalExpectation("month", false),
        peg$c129 = "musician",
        peg$c130 = peg$literalExpectation("musician", false),
        peg$c131 = "pt_politician",
        peg$c132 = peg$literalExpectation("pt_politician", false),
        peg$c133 = "pt_public_figure",
        peg$c134 = peg$literalExpectation("pt_public_figure", false),
        peg$c135 = "religion",
        peg$c136 = peg$literalExpectation("religion", false),
        peg$c137 = "soccer_player",
        peg$c138 = peg$literalExpectation("soccer_player", false),
        peg$c139 = "sport",
        peg$c140 = peg$literalExpectation("sport", false),
        peg$c141 = "writer",
        peg$c142 = peg$literalExpectation("writer", false),
        peg$c143 = function() { return text() + 's' },
        peg$c144 = "country",
        peg$c145 = peg$literalExpectation("country", false),
        peg$c146 = "gov_entity",
        peg$c147 = peg$literalExpectation("gov_entity", false),
        peg$c148 = "nationality",
        peg$c149 = peg$literalExpectation("nationality", false),
        peg$c150 = "top100_celebrity",
        peg$c151 = peg$literalExpectation("top100_celebrity", false),
        peg$c152 = "pt_top100_celebrity",
        peg$c153 = peg$literalExpectation("pt_top100_celebrity", false),
        peg$c154 = function() { return text().slice(0, -1) + 'ies' },
        peg$c155 = "pt_businessman",
        peg$c156 = peg$literalExpectation("pt_businessman", false),
        peg$c157 = function() { return text().slice(0, -2) + 'en' },
        peg$c158 = "name",
        peg$c159 = peg$literalExpectation("name", false),
        peg$c160 = "abbr",
        peg$c161 = peg$literalExpectation("abbr", false),
        peg$c162 = function(arg) { return arg },
        peg$c163 = /^[Gg]/,
        peg$c164 = peg$classExpectation(["G", "g"], false, false),
        peg$c165 = "ermany",
        peg$c166 = peg$literalExpectation("ermany", false),
        peg$c167 = /^[Ee]/,
        peg$c168 = peg$classExpectation(["E", "e"], false, false),
        peg$c169 = "ngland",
        peg$c170 = peg$literalExpectation("ngland", false),
        peg$c171 = /^[Ss]/,
        peg$c172 = peg$classExpectation(["S", "s"], false, false),
        peg$c173 = "pain",
        peg$c174 = peg$literalExpectation("pain", false),
        peg$c175 = /^[Ii]/,
        peg$c176 = peg$classExpectation(["I", "i"], false, false),
        peg$c177 = "taly",
        peg$c178 = peg$literalExpectation("taly", false),
        peg$c179 = /^[Pp]/,
        peg$c180 = peg$classExpectation(["P", "p"], false, false),
        peg$c181 = "ortugal",
        peg$c182 = peg$literalExpectation("ortugal", false),
        peg$c183 = function(nat) { return nat.join("") },
        peg$c184 = /^[a-zA-Z]/,
        peg$c185 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
        peg$c186 = /^[a-zA-Z\- ]/,
        peg$c187 = peg$classExpectation([["a", "z"], ["A", "Z"], "-", " "], false, false),
        peg$c188 = function(chars) { return chars.flat().join("").trim() },
        peg$c189 = "district",
        peg$c190 = peg$literalExpectation("district", false),
        peg$c191 = "county",
        peg$c192 = peg$literalExpectation("county", false),
        peg$c193 = function(label) { return label; },
        peg$c194 = "words",
        peg$c195 = peg$literalExpectation("words", false),
        peg$c196 = function(word) { return word; },
        peg$c197 = "sentences",
        peg$c198 = peg$literalExpectation("sentences", false),
        peg$c199 = "paragraphs",
        peg$c200 = peg$literalExpectation("paragraphs", false),
        peg$c201 = "2",
        peg$c202 = peg$literalExpectation("2", false),
        peg$c203 = /^[0-8]/,
        peg$c204 = peg$classExpectation([["0", "8"]], false, false),
        peg$c205 = /^[012]/,
        peg$c206 = peg$classExpectation(["0", "1", "2"], false, false),
        peg$c207 = "29",
        peg$c208 = peg$literalExpectation("29", false),
        peg$c209 = "30",
        peg$c210 = peg$literalExpectation("30", false),
        peg$c211 = "31",
        peg$c212 = peg$literalExpectation("31", false),
        peg$c213 = /^[13578]/,
        peg$c214 = peg$classExpectation(["1", "3", "5", "7", "8"], false, false),
        peg$c215 = /^[02]/,
        peg$c216 = peg$classExpectation(["0", "2"], false, false),
        peg$c217 = /^[4,6,9]/,
        peg$c218 = peg$classExpectation(["4", ",", "6", ",", "9"], false, false),
        peg$c219 = "11",
        peg$c220 = peg$literalExpectation("11", false),
        peg$c221 = "19",
        peg$c222 = peg$literalExpectation("19", false),
        peg$c223 = /^[2-9]/,
        peg$c224 = peg$classExpectation([["2", "9"]], false, false),
        peg$c225 = "02",
        peg$c226 = peg$literalExpectation("02", false),
        peg$c227 = "04",
        peg$c228 = peg$literalExpectation("04", false),
        peg$c229 = "08",
        peg$c230 = peg$literalExpectation("08", false),
        peg$c231 = "12",
        peg$c232 = peg$literalExpectation("12", false),
        peg$c233 = "16",
        peg$c234 = peg$literalExpectation("16", false),
        peg$c235 = "20",
        peg$c236 = peg$literalExpectation("20", false),
        peg$c237 = "24",
        peg$c238 = peg$literalExpectation("24", false),
        peg$c239 = "28",
        peg$c240 = peg$literalExpectation("28", false),
        peg$c241 = "32",
        peg$c242 = peg$literalExpectation("32", false),
        peg$c243 = "36",
        peg$c244 = peg$literalExpectation("36", false),
        peg$c245 = "40",
        peg$c246 = peg$literalExpectation("40", false),
        peg$c247 = "44",
        peg$c248 = peg$literalExpectation("44", false),
        peg$c249 = "48",
        peg$c250 = peg$literalExpectation("48", false),
        peg$c251 = "52",
        peg$c252 = peg$literalExpectation("52", false),
        peg$c253 = "56",
        peg$c254 = peg$literalExpectation("56", false),
        peg$c255 = "60",
        peg$c256 = peg$literalExpectation("60", false),
        peg$c257 = "64",
        peg$c258 = peg$literalExpectation("64", false),
        peg$c259 = "68",
        peg$c260 = peg$literalExpectation("68", false),
        peg$c261 = "72",
        peg$c262 = peg$literalExpectation("72", false),
        peg$c263 = "76",
        peg$c264 = peg$literalExpectation("76", false),
        peg$c265 = "80",
        peg$c266 = peg$literalExpectation("80", false),
        peg$c267 = "84",
        peg$c268 = peg$literalExpectation("84", false),
        peg$c269 = "88",
        peg$c270 = peg$literalExpectation("88", false),
        peg$c271 = "92",
        peg$c272 = peg$literalExpectation("92", false),
        peg$c273 = "96",
        peg$c274 = peg$literalExpectation("96", false),
        peg$c275 = function(date) {
            var split = date.flat(2).join("").split(/\//)
            return new Date(parseInt(split[2]), parseInt(split[1]), parseInt(split[0]))
          },
        peg$c276 = "DD",
        peg$c277 = peg$literalExpectation("DD", false),
        peg$c278 = "MM",
        peg$c279 = peg$literalExpectation("MM", false),
        peg$c280 = "AAAA",
        peg$c281 = peg$literalExpectation("AAAA", false),
        peg$c282 = "YYYY",
        peg$c283 = peg$literalExpectation("YYYY", false),
        peg$c284 = function(format) { return format.join(""); },
        peg$c285 = /^[_]/,
        peg$c286 = peg$classExpectation(["_"], false, false),
        peg$c287 = /^[a-z]/,
        peg$c288 = peg$classExpectation([["a", "z"]], false, false),
        peg$c289 = /^[a-zA-Z0-9_]/,
        peg$c290 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false),
        peg$c291 = function(chars) { return chars.flat().join("") },
        peg$c292 = "\\",
        peg$c293 = peg$literalExpectation("\\", false),
        peg$c294 = "b",
        peg$c295 = peg$literalExpectation("b", false),
        peg$c296 = function() { return "\b"; },
        peg$c297 = "f",
        peg$c298 = peg$literalExpectation("f", false),
        peg$c299 = function() { return "\f"; },
        peg$c300 = "n",
        peg$c301 = peg$literalExpectation("n", false),
        peg$c302 = function() { return "\n"; },
        peg$c303 = "r",
        peg$c304 = peg$literalExpectation("r", false),
        peg$c305 = function() { return "\r"; },
        peg$c306 = "t",
        peg$c307 = peg$literalExpectation("t", false),
        peg$c308 = function() { return "\t"; },
        peg$c309 = "u",
        peg$c310 = peg$literalExpectation("u", false),
        peg$c311 = function(digits) {
                  return String.fromCharCode(parseInt(digits, 16));
                },
        peg$c312 = function(sequence) { return sequence; },
        peg$c313 = "'",
        peg$c314 = peg$literalExpectation("'", false),
        peg$c315 = /^[^\0-\x1F"\\]/,
        peg$c316 = peg$classExpectation([["\0", "\x1F"], "\"", "\\"], true, false),
        peg$c317 = function(val) {
          var model = { type: String, required: true }, data

          if (!val.length) data = Array(queue_prod).fill("")
          else if (val.length == 1) { model = val[0].model; data = val[0].data }
          else {
            val.forEach(obj => { if ("objectType" in obj && obj.objectType) obj.data = obj.data.map(el => JSON.stringify(el)) })
            data = val.reduce((a, o) => (a.push(o.data), a), []).reduce((a, b) => a.map((v, i) => v + b[i]))
          }

          return { model, data }
        },
        peg$c318 = function(v) { return v },
        peg$c319 = peg$anyExpectation(),
        peg$c320 = function() {
          return { model: {type: String, required: true}, data: Array(queue_prod).fill(text()) }
        },
        peg$c321 = "{{",
        peg$c322 = peg$literalExpectation("{{", false),
        peg$c323 = "}}",
        peg$c324 = peg$literalExpectation("}}", false),
        peg$c325 = "objectId(",
        peg$c326 = peg$literalExpectation("objectId(", false),
        peg$c327 = function() { return { model: {type: String, required: true}, data: fillArray("gen", null, "objectId", []) } },
        peg$c328 = "guid(",
        peg$c329 = peg$literalExpectation("guid(", false),
        peg$c330 = function() { return { model: {type: String, required: true}, data: fillArray("gen", null, "guid", []) } },
        peg$c331 = "bool(",
        peg$c332 = peg$literalExpectation("bool(", false),
        peg$c333 = function() { return { model: {type: Boolean, required: true}, data: fillArray("gen", null, "boolean", []) } },
        peg$c334 = "index(",
        peg$c335 = peg$literalExpectation("index(", false),
        peg$c336 = function() {
            var queue_last = queue[queue.length-1]
            return {
              model: {type: Number, required: true},
              data: Array(queue_prod/queue_last).fill([...Array(queue_last).keys()]).flat()
            }
          },
        peg$c337 = "integer(",
        peg$c338 = peg$literalExpectation("integer(", false),
        peg$c339 = function(min, max, u) {return u},
        peg$c340 = function(min, max, unit) {
            return {
              model: { type: unit === null ? Number : String, required: true }, 
              data: fillArray("gen", null, "integer", [min, max, unit])
            }
          },
        peg$c341 = "floating(",
        peg$c342 = peg$literalExpectation("floating(", false),
        peg$c343 = function(min, max, decimals, f) {return f},
        peg$c344 = function(min, max, decimals, format) {return {decimals, format} },
        peg$c345 = function(min, max, others) {
            if (!others) others = {decimals: null, format: null}
            return {
              model: { type: others.format === null ? Number : String, required: true }, 
              data: fillArray("gen", null, "floating", [min.data[0], max.data[0], others.decimals, others.format])
            }
          },
        peg$c346 = "position(",
        peg$c347 = peg$literalExpectation("position(", false),
        peg$c348 = function(lat, long) {return {lat, long} },
        peg$c349 = function(limits) {
            return {
              model: {type: String, required: true},
              data: fillArray("gen", null, "position", [!limits ? null : limits.lat, !limits ? null : limits.long])
            }
          },
        peg$c350 = "phone(",
        peg$c351 = peg$literalExpectation("phone(", false),
        peg$c352 = function(extension) {
            return {
              model: {type: String, required: true},
              data: fillArray("gen", null, "phone", [extension])
            }
          },
        peg$c353 = "date(",
        peg$c354 = peg$literalExpectation("date(", false),
        peg$c355 = function(start, e) { return e },
        peg$c356 = function(start, end, f) { return f },
        peg$c357 = function(start, end, format) {
            return {
              model: {type: String, required: true},
              data: fillArray("gen", null, "date", [start, !end ? new Date() : end, !format ? 'DD/MM/YYYY' : format])
            }
          },
        peg$c358 = "random(",
        peg$c359 = peg$literalExpectation("random(", false),
        peg$c360 = function(head, v) { return v; },
        peg$c361 = function(head, tail) { return [head].concat(tail); },
        peg$c362 = function(values) {
              return {
                model: {any: {}, required: true},
                data: fillArray("gen", null, "random", [values])
              }
          },
        peg$c363 = "lorem(",
        peg$c364 = peg$literalExpectation("lorem(", false),
        peg$c365 = function(count, units) {
            return {
              model: {type: String, required: true},
              data: fillArray("gen", null, "lorem", [count, units])
            }
          },
        peg$c366 = "pt_county(",
        peg$c367 = peg$literalExpectation("pt_county(", false),
        peg$c368 = function(district) {
            return {
              model: {type: String, required: true},
              data: fillArray("data", "districts", "pt_countyFromDistrict", [district])
            }
          },
        peg$c369 = "pt_parish(",
        peg$c370 = peg$literalExpectation("pt_parish(", false),
        peg$c371 = function(keyword, name) {
            var moustaches = keyword == "county" ? "pt_parishFromCounty" : "pt_parishFromDistrict"
            return {
              model: {type: String, required: true},
              data: fillArray("data", "districts", moustaches, [name])
            }
          },
        peg$c372 = "pt_political_party(",
        peg$c373 = peg$literalExpectation("pt_political_party(", false),
        peg$c374 = function(a) {return a},
        peg$c375 = function(arg) {
            var moustaches = !arg ? "pt_political_party" : ("pt_political_party_" + arg)
            return {
              objectType: arg === null,
              model: {
                type: arg !== null ? String : {
                  sigla: {type: String, required: true},
                  partido: {type: String, required: true}
                },
                required: true
              },
              data: fillArray("data", "pt_political_parties", moustaches, [])
            }
          },
        peg$c376 = "political_party(",
        peg$c377 = peg$literalExpectation("political_party(", false),
        peg$c378 = function(t) {return [t]},
        peg$c379 = function(country, t) {return t},
        peg$c380 = function(country, type) {return type == null ? [country] : [country,type]},
        peg$c381 = function(args) {
            var objectType = true, moustaches, model = {
              type: {
                party_abbr: {type: String, required: true},
                party_name: {type: String, required: true}
              }, required: true
            }

            if (!args) moustaches = "political_party"
            else if (args.length == 1) {
              if (["abbr","name"].includes(args[0])) {
                moustaches = "political_party_" + args[0]
                model.type = String
                objectType = false
              }
              else moustaches = "political_party_from"
            } 
            else {
              moustaches = "political_party_from_" + args[1]
              model.type = String
              objectType = false
            }

            return { objectType, model, data: fillArray("data", "political_parties", moustaches, !args ? [] : args) }
          },
        peg$c382 = "soccer_club(",
        peg$c383 = peg$literalExpectation("soccer_club(", false),
        peg$c384 = function(arg) {
            var moustaches = !arg ? "soccer_club" : "soccer_club_from"
            return {
              model: {type: String, required: true},
              data: fillArray("data", "soccer_clubs", moustaches, !arg ? [] : [arg])
            }
          },
        peg$c385 = function(val) {
            if (queue.length > 1) {
              val.model = {type: Array(num).fill(val.model), required: true}
              val.data = chunk(val.data, queue[queue.length-1])
            }
            
            var num = queue.pop()
            queue_prod = !queue.length ? null : (queue_prod/num)
            return val
          },
        peg$c386 = "repeat",
        peg$c387 = peg$literalExpectation("repeat", false),
        peg$c388 = function(min, max) {
            var num = Math.floor(Math.random() * (max - min + 1)) + min
            queue_prod = !queue.length ? num : (queue_prod*num)
            queue.push(num)
          },
        peg$c389 = function(num) {
            queue_prod = !queue.length ? num : (queue_prod*num)
            queue.push(num)
          },
        peg$c390 = "range(",
        peg$c391 = peg$literalExpectation("range(", false),
        peg$c392 = function(num) {
            return {
              model: {type: Array(num).fill({type: Number, required: true}), required: true},
              data: Array(queue_prod).fill([...Array(num).keys()])
            }
          },
        peg$c393 = function(init, end) {
            var range = []

            if (init < end) { for (var i = init; i < end; i++) range.push(i) }
            else if (init > end) { for (var j = init; j > end; j--) range.push(j) }

            return {
              model: {type: Array(range.length).fill({type: Number, required: true}), required: true},
              data: Array(queue_prod).fill(range)
            }
          },
        peg$c394 = "missing",
        peg$c395 = peg$literalExpectation("missing", false),
        peg$c396 = "having",
        peg$c397 = peg$literalExpectation("having", false),
        peg$c398 = function() {return text()},
        peg$c399 = function(sign, probability, m) {
            var prob = parseInt(probability.join(""))/100, arr = []

            for (var i = 0; i < queue_prod; i++) {
              var bool = (sign == "missing" && Math.random() > prob) || (sign == "having" && Math.random() < prob)
              arr.push(bool ? m.value.data[i] : null)
            }

            m.value.model.required = false
            return {
              name: m.name,
              value: { probability: true, model: m.value.model, data: arr }
            }
          },
        peg$c400 = "()",
        peg$c401 = peg$literalExpectation("()", false),
        peg$c402 = function(name, code) {
            return {
              name, 
              data: {
                function: code
                /* function: "function f() " + code + "\n var result = f()" */
              }
            }
          },
        peg$c403 = function() { return text().slice(1,-1) },
        peg$c404 = /^[0-9a-f]/i,
        peg$c405 = peg$classExpectation([["0", "9"], ["a", "f"]], false, true),

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
        s2 = peg$parseobject();
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

      s0 = peg$parsedirective();
      if (s0 === peg$FAILED) {
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
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsefalse();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenull();
        if (s1 === peg$FAILED) {
          s1 = peg$parsetrue();
          if (s1 === peg$FAILED) {
            s1 = peg$parsenumber();
            if (s1 === peg$FAILED) {
              s1 = peg$parsestring();
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c32(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsefalse() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c33) {
        s1 = peg$c33;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c35();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenull() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c36) {
        s1 = peg$c36;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c38();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsetrue() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c39) {
        s1 = peg$c39;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c41();
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
              s6 = peg$c42(s3, s7);
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
                s6 = peg$c42(s3, s7);
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
            s3 = peg$c43(s3, s4);
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
            s1 = peg$c44(s2);
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
          s3 = peg$parsevalue_or_interpolation();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c45(s1, s3);
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
        if (s0 === peg$FAILED) {
          s0 = peg$parsefunction_prop();
        }
      }

      return s0;
    }

    function peg$parsevalue_or_interpolation() {
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
        s3 = peg$parsevalue_or_interpolation();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsevalue_or_interpolation();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c46(s3, s7);
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
              s7 = peg$parsevalue_or_interpolation();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c46(s3, s7);
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
            s3 = peg$c47(s3, s4);
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
            s1 = peg$c48(s2);
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
              s1 = peg$c50();
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
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
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

      if (peg$c51.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }

      return s0;
    }

    function peg$parsee() {
      var s0;

      if (peg$c53.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
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
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      s3 = peg$parsezero();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsezero();
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$currPos;
        s4 = peg$parsedigit1_9();
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parseDIGIT();
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            s6 = peg$parseDIGIT();
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
          peg$savedPos = s1;
          s2 = peg$c55(s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$parsezero();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsezero();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsezero();
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s1;
            s2 = peg$c55(s2);
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c56(s1);
      }
      s0 = s1;

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
        s0 = peg$c57;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c58); }
      }

      return s0;
    }

    function peg$parsezero() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 48) {
        s0 = peg$c59;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }

      return s0;
    }

    function peg$parsefloat_format() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c61) {
          s2 = peg$c61;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c62); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c63.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c64); }
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 48) {
              s4 = peg$c59;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s4 !== peg$FAILED) {
              if (peg$c63.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c64); }
              }
              if (s5 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c65) {
                  s6 = peg$c65;
                  peg$currPos += 2;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c66); }
                }
                if (s6 !== peg$FAILED) {
                  if (peg$c63.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c64); }
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 34) {
                      s8 = peg$c67;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c68); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsews();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c69(s3, s5, s7);
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
        if (input.substr(peg$currPos, 2) === peg$c70) {
          s3 = peg$c70;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c71); }
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
              s7 = peg$c59;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s7 !== peg$FAILED) {
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                if (input.charCodeAt(peg$currPos) === 48) {
                  s7 = peg$c59;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c60); }
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
          if (peg$c72.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (peg$c74.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
                if (peg$c74.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c75); }
                }
                if (s8 !== peg$FAILED) {
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    if (peg$c74.test(input.charAt(peg$currPos))) {
                      s8 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
          s1 = peg$c76();
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
                s1 = peg$c77(s2, s4);
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
        if (input.substr(peg$currPos, 3) === peg$c78) {
          s3 = peg$c78;
          peg$currPos += 3;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c79); }
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
              s7 = peg$c59;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s7 !== peg$FAILED) {
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                if (input.charCodeAt(peg$currPos) === 48) {
                  s7 = peg$c59;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c60); }
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
            s4 = peg$c80;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c81); }
          }
          if (s4 !== peg$FAILED) {
            if (peg$c82.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c83); }
            }
            if (s5 !== peg$FAILED) {
              if (peg$c74.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
            if (peg$c51.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c52); }
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              if (peg$c74.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
              if (peg$c74.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
              }
              if (s7 !== peg$FAILED) {
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  if (peg$c74.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
          s1 = peg$c76();
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
                s1 = peg$c77(s2, s4);
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
            s1 = peg$c85(s2);
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
        if (peg$silentFails === 0) { peg$fail(peg$c84); }
      }

      return s0;
    }

    function peg$parsesimple_api_key() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsedistricts_key();
      if (s1 === peg$FAILED) {
        s1 = peg$parsenames_key();
        if (s1 === peg$FAILED) {
          s1 = peg$parsegeneric_key();
        }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s2 = peg$c86;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c87); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s4 = peg$c88;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c89); }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c90(s1);
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

      return s0;
    }

    function peg$parsedistricts_key() {
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
          if (input.substr(peg$currPos, 9) === peg$c95) {
            s1 = peg$c95;
            peg$currPos += 9;
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

    function peg$parsenames_key() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c98) {
        s1 = peg$c98;
        peg$currPos += 9;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c100) {
          s1 = peg$c100;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c101); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c102) {
            s1 = peg$c102;
            peg$currPos += 8;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c103); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c104();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsegeneric_key() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c105) {
        s1 = peg$c105;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c106); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c107) {
          s1 = peg$c107;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c108); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c109) {
            s1 = peg$c109;
            peg$currPos += 5;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c110); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c111) {
              s1 = peg$c111;
              peg$currPos += 8;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c112); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 7) === peg$c113) {
                s1 = peg$c113;
                peg$currPos += 7;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c114); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 9) === peg$c115) {
                  s1 = peg$c115;
                  peg$currPos += 9;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c116); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 9) === peg$c117) {
                    s1 = peg$c117;
                    peg$currPos += 9;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c118); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 15) === peg$c119) {
                      s1 = peg$c119;
                      peg$currPos += 15;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c120); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 3) === peg$c121) {
                        s1 = peg$c121;
                        peg$currPos += 3;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c122); }
                      }
                      if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c123) {
                          s1 = peg$c123;
                          peg$currPos += 6;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c124); }
                        }
                        if (s1 === peg$FAILED) {
                          if (input.substr(peg$currPos, 3) === peg$c125) {
                            s1 = peg$c125;
                            peg$currPos += 3;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c126); }
                          }
                          if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c127) {
                              s1 = peg$c127;
                              peg$currPos += 5;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c128); }
                            }
                            if (s1 === peg$FAILED) {
                              if (input.substr(peg$currPos, 8) === peg$c129) {
                                s1 = peg$c129;
                                peg$currPos += 8;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c130); }
                              }
                              if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 13) === peg$c131) {
                                  s1 = peg$c131;
                                  peg$currPos += 13;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c132); }
                                }
                                if (s1 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 16) === peg$c133) {
                                    s1 = peg$c133;
                                    peg$currPos += 16;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c134); }
                                  }
                                  if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 8) === peg$c135) {
                                      s1 = peg$c135;
                                      peg$currPos += 8;
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
                                        if (input.substr(peg$currPos, 5) === peg$c139) {
                                          s1 = peg$c139;
                                          peg$currPos += 5;
                                        } else {
                                          s1 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c140); }
                                        }
                                        if (s1 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 6) === peg$c141) {
                                            s1 = peg$c141;
                                            peg$currPos += 6;
                                          } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c142); }
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
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c143();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 7) === peg$c144) {
          s1 = peg$c144;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c145); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 10) === peg$c146) {
            s1 = peg$c146;
            peg$currPos += 10;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c147); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 11) === peg$c148) {
              s1 = peg$c148;
              peg$currPos += 11;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c149); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 16) === peg$c150) {
                s1 = peg$c150;
                peg$currPos += 16;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c151); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 19) === peg$c152) {
                  s1 = peg$c152;
                  peg$currPos += 19;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c153); }
                }
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c154();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 14) === peg$c155) {
            s1 = peg$c155;
            peg$currPos += 14;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c156); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c157();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsepparty_type() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c158) {
          s2 = peg$c158;
          peg$currPos += 4;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c159); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c160) {
            s2 = peg$c160;
            peg$currPos += 4;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c161); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c162(s2);
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
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (peg$c163.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c164); }
        }
        if (s3 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c165) {
            s4 = peg$c165;
            peg$currPos += 6;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c166); }
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
          if (peg$c167.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c168); }
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c169) {
              s4 = peg$c169;
              peg$currPos += 6;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c170); }
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
            if (peg$c171.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c172); }
            }
            if (s3 !== peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c173) {
                s4 = peg$c173;
                peg$currPos += 4;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c174); }
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
              if (peg$c175.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c176); }
              }
              if (s3 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c177) {
                  s4 = peg$c177;
                  peg$currPos += 4;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c178); }
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
                if (peg$c179.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c180); }
                }
                if (s3 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 7) === peg$c181) {
                    s4 = peg$c181;
                    peg$currPos += 7;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c182); }
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
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c183(s2);
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
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsequotation_mark();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (peg$c184.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c185); }
          }
          if (s4 !== peg$FAILED) {
            s5 = [];
            if (peg$c186.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c187); }
            }
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              if (peg$c186.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c187); }
              }
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
            s4 = peg$parsequotation_mark();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c188(s3);
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
          if (input.substr(peg$currPos, 8) === peg$c189) {
            s3 = peg$c189;
            peg$currPos += 8;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c190); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c191) {
              s3 = peg$c191;
              peg$currPos += 6;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c192); }
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsequotation_mark();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c193(s3);
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
        if (input.substr(peg$currPos, 5) === peg$c194) {
          s2 = peg$c194;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c195); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c196(s2);
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
          if (input.substr(peg$currPos, 9) === peg$c197) {
            s2 = peg$c197;
            peg$currPos += 9;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c198); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsequotation_mark();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c196(s2);
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
            if (input.substr(peg$currPos, 10) === peg$c199) {
              s2 = peg$c199;
              peg$currPos += 10;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c200); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsequotation_mark();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c196(s2);
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
          s5 = peg$c59;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c60); }
        }
        if (s5 !== peg$FAILED) {
          if (peg$c51.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c52); }
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
            s5 = peg$c80;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c81); }
          }
          if (s5 !== peg$FAILED) {
            if (peg$c74.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
              s5 = peg$c201;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c202); }
            }
            if (s5 !== peg$FAILED) {
              if (peg$c203.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c204); }
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
              s7 = peg$c59;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s7 !== peg$FAILED) {
              if (peg$c51.test(input.charAt(peg$currPos))) {
                s8 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c52); }
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
                s7 = peg$c80;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c81); }
              }
              if (s7 !== peg$FAILED) {
                if (peg$c205.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c206); }
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
          if (input.substr(peg$currPos, 2) === peg$c207) {
            s4 = peg$c207;
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c208); }
          }
          if (s4 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c209) {
              s4 = peg$c209;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c210); }
            }
            if (s4 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c211) {
                s4 = peg$c211;
                peg$currPos += 2;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c212); }
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
                s7 = peg$c59;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
              }
              if (s7 !== peg$FAILED) {
                if (peg$c213.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c214); }
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
                  s7 = peg$c80;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c81); }
                }
                if (s7 !== peg$FAILED) {
                  if (peg$c215.test(input.charAt(peg$currPos))) {
                    s8 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c216); }
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
            if (input.substr(peg$currPos, 2) === peg$c207) {
              s4 = peg$c207;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c208); }
            }
            if (s4 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c209) {
                s4 = peg$c209;
                peg$currPos += 2;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c210); }
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
                  s7 = peg$c59;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c60); }
                }
                if (s7 !== peg$FAILED) {
                  if (peg$c217.test(input.charAt(peg$currPos))) {
                    s8 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c218); }
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
                  if (input.substr(peg$currPos, 2) === peg$c219) {
                    s6 = peg$c219;
                    peg$currPos += 2;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c220); }
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
            if (input.substr(peg$currPos, 2) === peg$c221) {
              s5 = peg$c221;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c222); }
            }
            if (s5 === peg$FAILED) {
              s5 = peg$currPos;
              if (peg$c223.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c224); }
              }
              if (s6 !== peg$FAILED) {
                if (peg$c74.test(input.charAt(peg$currPos))) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
              if (peg$c74.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
              }
              if (s6 !== peg$FAILED) {
                if (peg$c74.test(input.charAt(peg$currPos))) {
                  s7 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
          if (input.substr(peg$currPos, 2) === peg$c207) {
            s3 = peg$c207;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c208); }
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
              if (input.substr(peg$currPos, 2) === peg$c225) {
                s5 = peg$c225;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c226); }
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
                  if (input.substr(peg$currPos, 2) === peg$c221) {
                    s7 = peg$c221;
                    peg$currPos += 2;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c222); }
                  }
                  if (s7 === peg$FAILED) {
                    s7 = peg$currPos;
                    if (peg$c223.test(input.charAt(peg$currPos))) {
                      s8 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c224); }
                    }
                    if (s8 !== peg$FAILED) {
                      if (peg$c74.test(input.charAt(peg$currPos))) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c75); }
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
                    if (input.substr(peg$currPos, 2) === peg$c65) {
                      s8 = peg$c65;
                      peg$currPos += 2;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c66); }
                    }
                    if (s8 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c227) {
                        s8 = peg$c227;
                        peg$currPos += 2;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c228); }
                      }
                      if (s8 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c229) {
                          s8 = peg$c229;
                          peg$currPos += 2;
                        } else {
                          s8 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c230); }
                        }
                        if (s8 === peg$FAILED) {
                          if (input.substr(peg$currPos, 2) === peg$c231) {
                            s8 = peg$c231;
                            peg$currPos += 2;
                          } else {
                            s8 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c232); }
                          }
                          if (s8 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c233) {
                              s8 = peg$c233;
                              peg$currPos += 2;
                            } else {
                              s8 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c234); }
                            }
                            if (s8 === peg$FAILED) {
                              if (input.substr(peg$currPos, 2) === peg$c235) {
                                s8 = peg$c235;
                                peg$currPos += 2;
                              } else {
                                s8 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c236); }
                              }
                              if (s8 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c237) {
                                  s8 = peg$c237;
                                  peg$currPos += 2;
                                } else {
                                  s8 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c238); }
                                }
                                if (s8 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 2) === peg$c239) {
                                    s8 = peg$c239;
                                    peg$currPos += 2;
                                  } else {
                                    s8 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c240); }
                                  }
                                  if (s8 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c241) {
                                      s8 = peg$c241;
                                      peg$currPos += 2;
                                    } else {
                                      s8 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c242); }
                                    }
                                    if (s8 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 2) === peg$c243) {
                                        s8 = peg$c243;
                                        peg$currPos += 2;
                                      } else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c244); }
                                      }
                                      if (s8 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 2) === peg$c245) {
                                          s8 = peg$c245;
                                          peg$currPos += 2;
                                        } else {
                                          s8 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c246); }
                                        }
                                        if (s8 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 2) === peg$c247) {
                                            s8 = peg$c247;
                                            peg$currPos += 2;
                                          } else {
                                            s8 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c248); }
                                          }
                                          if (s8 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 2) === peg$c249) {
                                              s8 = peg$c249;
                                              peg$currPos += 2;
                                            } else {
                                              s8 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c250); }
                                            }
                                            if (s8 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 2) === peg$c251) {
                                                s8 = peg$c251;
                                                peg$currPos += 2;
                                              } else {
                                                s8 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c252); }
                                              }
                                              if (s8 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 2) === peg$c253) {
                                                  s8 = peg$c253;
                                                  peg$currPos += 2;
                                                } else {
                                                  s8 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c254); }
                                                }
                                                if (s8 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 2) === peg$c255) {
                                                    s8 = peg$c255;
                                                    peg$currPos += 2;
                                                  } else {
                                                    s8 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c256); }
                                                  }
                                                  if (s8 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 2) === peg$c257) {
                                                      s8 = peg$c257;
                                                      peg$currPos += 2;
                                                    } else {
                                                      s8 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c258); }
                                                    }
                                                    if (s8 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 2) === peg$c259) {
                                                        s8 = peg$c259;
                                                        peg$currPos += 2;
                                                      } else {
                                                        s8 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c260); }
                                                      }
                                                      if (s8 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 2) === peg$c261) {
                                                          s8 = peg$c261;
                                                          peg$currPos += 2;
                                                        } else {
                                                          s8 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c262); }
                                                        }
                                                        if (s8 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 2) === peg$c263) {
                                                            s8 = peg$c263;
                                                            peg$currPos += 2;
                                                          } else {
                                                            s8 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c264); }
                                                          }
                                                          if (s8 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 2) === peg$c265) {
                                                              s8 = peg$c265;
                                                              peg$currPos += 2;
                                                            } else {
                                                              s8 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c266); }
                                                            }
                                                            if (s8 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 2) === peg$c267) {
                                                                s8 = peg$c267;
                                                                peg$currPos += 2;
                                                              } else {
                                                                s8 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c268); }
                                                              }
                                                              if (s8 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 2) === peg$c269) {
                                                                  s8 = peg$c269;
                                                                  peg$currPos += 2;
                                                                } else {
                                                                  s8 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c270); }
                                                                }
                                                                if (s8 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 2) === peg$c271) {
                                                                    s8 = peg$c271;
                                                                    peg$currPos += 2;
                                                                  } else {
                                                                    s8 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c272); }
                                                                  }
                                                                  if (s8 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 2) === peg$c273) {
                                                                      s8 = peg$c273;
                                                                      peg$currPos += 2;
                                                                    } else {
                                                                      s8 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c274); }
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
            s1 = peg$c275(s2);
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
        if (input.substr(peg$currPos, 2) === peg$c276) {
          s3 = peg$c276;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c277); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsedate_separator();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c278) {
              s5 = peg$c278;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c279); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsedate_separator();
              if (s6 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c280) {
                  s7 = peg$c280;
                  peg$currPos += 4;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c281); }
                }
                if (s7 === peg$FAILED) {
                  if (input.substr(peg$currPos, 4) === peg$c282) {
                    s7 = peg$c282;
                    peg$currPos += 4;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c283); }
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
            s1 = peg$c284(s2);
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
          if (input.substr(peg$currPos, 2) === peg$c278) {
            s3 = peg$c278;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c279); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsedate_separator();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c276) {
                s5 = peg$c276;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c277); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsedate_separator();
                if (s6 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 4) === peg$c280) {
                    s7 = peg$c280;
                    peg$currPos += 4;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c281); }
                  }
                  if (s7 === peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c282) {
                      s7 = peg$c282;
                      peg$currPos += 4;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c283); }
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
              s1 = peg$c284(s2);
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
            if (input.substr(peg$currPos, 4) === peg$c280) {
              s3 = peg$c280;
              peg$currPos += 4;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c281); }
            }
            if (s3 === peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c282) {
                s3 = peg$c282;
                peg$currPos += 4;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c283); }
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsedate_separator();
              if (s4 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c278) {
                  s5 = peg$c278;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c279); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsedate_separator();
                  if (s6 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c276) {
                      s7 = peg$c276;
                      peg$currPos += 2;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c277); }
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
                s1 = peg$c284(s2);
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
      if (peg$c285.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c286); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$c285.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c286); }
        }
      }
      if (s2 !== peg$FAILED) {
        if (peg$c287.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c288); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$c289.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c290); }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c289.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c290); }
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
        s1 = peg$c291(s1);
      }
      s0 = s1;

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
            s2 = peg$c67;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c292;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c293); }
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
                  s3 = peg$c294;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c295); }
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c296();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 102) {
                    s3 = peg$c297;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c298); }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c299();
                  }
                  s2 = s3;
                  if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 110) {
                      s3 = peg$c300;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c301); }
                    }
                    if (s3 !== peg$FAILED) {
                      peg$savedPos = s2;
                      s3 = peg$c302();
                    }
                    s2 = s3;
                    if (s2 === peg$FAILED) {
                      s2 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 114) {
                        s3 = peg$c303;
                        peg$currPos++;
                      } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c304); }
                      }
                      if (s3 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c305();
                      }
                      s2 = s3;
                      if (s2 === peg$FAILED) {
                        s2 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 116) {
                          s3 = peg$c306;
                          peg$currPos++;
                        } else {
                          s3 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c307); }
                        }
                        if (s3 !== peg$FAILED) {
                          peg$savedPos = s2;
                          s3 = peg$c308();
                        }
                        s2 = s3;
                        if (s2 === peg$FAILED) {
                          s2 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 117) {
                            s3 = peg$c309;
                            peg$currPos++;
                          } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c310); }
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
                              s3 = peg$c311(s4);
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
            s1 = peg$c312(s2);
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
        s0 = peg$c292;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c293); }
      }

      return s0;
    }

    function peg$parsequotation_mark() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 34) {
        s0 = peg$c67;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }

      return s0;
    }

    function peg$parseapostrophe() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 39) {
        s0 = peg$c313;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c314); }
      }

      return s0;
    }

    function peg$parseunescaped() {
      var s0;

      if (peg$c315.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c316); }
      }

      return s0;
    }

    function peg$parseinterpolation() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseapostrophe();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsemoustaches();
        if (s3 === peg$FAILED) {
          s3 = peg$parsenot_moustaches();
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsemoustaches();
          if (s3 === peg$FAILED) {
            s3 = peg$parsenot_moustaches();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseapostrophe();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c317(s2);
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

    function peg$parsemoustaches() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsemoustaches_start();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsemoustaches_value();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsemoustaches_stop();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c318(s2);
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

    function peg$parsenot_moustaches() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parsemoustaches_start();
      if (s4 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s4 = peg$c313;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c314); }
        }
      }
      peg$silentFails--;
      if (s4 === peg$FAILED) {
        s3 = void 0;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c319); }
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
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parsemoustaches_start();
          if (s4 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s4 = peg$c313;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c314); }
            }
          }
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = void 0;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c319); }
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
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c320();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemoustaches_start() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c321) {
        s0 = peg$c321;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c322); }
      }

      return s0;
    }

    function peg$parsemoustaches_stop() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c323) {
        s0 = peg$c323;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c324); }
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
      if (input.substr(peg$currPos, 9) === peg$c325) {
        s1 = peg$c325;
        peg$currPos += 9;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c326); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c88;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c89); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c327();
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
        if (input.substr(peg$currPos, 5) === peg$c328) {
          s1 = peg$c328;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c329); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c88;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c89); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c330();
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
              if (input.charCodeAt(peg$currPos) === 41) {
                s3 = peg$c88;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c89); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c333();
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
            if (input.substr(peg$currPos, 6) === peg$c334) {
              s1 = peg$c334;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c335); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsews();
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s3 = peg$c88;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c89); }
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c336();
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
              if (input.substr(peg$currPos, 8) === peg$c337) {
                s1 = peg$c337;
                peg$currPos += 8;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c338); }
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
                                    if (peg$silentFails === 0) { peg$fail(peg$c319); }
                                  }
                                  if (s12 !== peg$FAILED) {
                                    s13 = peg$parsequotation_mark();
                                    if (s13 !== peg$FAILED) {
                                      peg$savedPos = s9;
                                      s10 = peg$c339(s3, s7, s12);
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
                                  s10 = peg$c88;
                                  peg$currPos++;
                                } else {
                                  s10 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c89); }
                                }
                                if (s10 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c340(s3, s7, s9);
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
                if (input.substr(peg$currPos, 9) === peg$c341) {
                  s1 = peg$c341;
                  peg$currPos += 9;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c342); }
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
                                            s15 = peg$c343(s3, s7, s12, s16);
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
                                          s10 = peg$c344(s3, s7, s12, s14);
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
                                    s10 = peg$c88;
                                    peg$currPos++;
                                  } else {
                                    s10 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c89); }
                                  }
                                  if (s10 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c345(s3, s7, s9);
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
                  if (input.substr(peg$currPos, 9) === peg$c346) {
                    s1 = peg$c346;
                    peg$currPos += 9;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c347); }
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
                            s4 = peg$c348(s4, s6);
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
                          s4 = peg$c88;
                          peg$currPos++;
                        } else {
                          s4 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c89); }
                        }
                        if (s4 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c349(s3);
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
                    if (input.substr(peg$currPos, 6) === peg$c350) {
                      s1 = peg$c350;
                      peg$currPos += 6;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c351); }
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
                              s5 = peg$c88;
                              peg$currPos++;
                            } else {
                              s5 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c89); }
                            }
                            if (s5 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c352(s3);
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
                      if (input.substr(peg$currPos, 5) === peg$c353) {
                        s1 = peg$c353;
                        peg$currPos += 5;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c354); }
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
                                      s6 = peg$c355(s3, s8);
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
                                        s7 = peg$c356(s3, s5, s9);
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
                                    s7 = peg$c88;
                                    peg$currPos++;
                                  } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c89); }
                                  }
                                  if (s7 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c357(s3, s5, s6);
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
                        if (input.substr(peg$currPos, 7) === peg$c358) {
                          s1 = peg$c358;
                          peg$currPos += 7;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c359); }
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
                                  s7 = peg$c360(s4, s8);
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
                                    s7 = peg$c360(s4, s8);
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
                                s4 = peg$c361(s4, s5);
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
                                s4 = peg$c88;
                                peg$currPos++;
                              } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c89); }
                              }
                              if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c362(s3);
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
                          if (input.substr(peg$currPos, 6) === peg$c363) {
                            s1 = peg$c363;
                            peg$currPos += 6;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c364); }
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
                                            s9 = peg$c88;
                                            peg$currPos++;
                                          } else {
                                            s9 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c89); }
                                          }
                                          if (s9 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c365(s3, s7);
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
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$parsesimple_api_key();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 10) === peg$c366) {
          s1 = peg$c366;
          peg$currPos += 10;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c367); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseplace_name();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c88;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c89); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c368(s2);
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
          if (input.substr(peg$currPos, 10) === peg$c369) {
            s1 = peg$c369;
            peg$currPos += 10;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c370); }
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
                    s5 = peg$c88;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c89); }
                  }
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c371(s2, s4);
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
            if (input.substr(peg$currPos, 19) === peg$c372) {
              s1 = peg$c372;
              peg$currPos += 19;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c373); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsews();
              if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$parsepparty_type();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c374(s4);
                }
                s3 = s4;
                if (s3 === peg$FAILED) {
                  s3 = null;
                }
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s4 = peg$c88;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c89); }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c375(s3);
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
              if (input.substr(peg$currPos, 16) === peg$c376) {
                s1 = peg$c376;
                peg$currPos += 16;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c377); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parsews();
                if (s3 !== peg$FAILED) {
                  s4 = peg$parsepparty_type();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsews();
                    if (s5 !== peg$FAILED) {
                      peg$savedPos = s2;
                      s3 = peg$c378(s4);
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
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$parsews();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parseplace_name();
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parsews();
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
                            s9 = peg$parsepparty_type();
                            if (s9 !== peg$FAILED) {
                              s10 = peg$parsews();
                              if (s10 !== peg$FAILED) {
                                peg$savedPos = s6;
                                s7 = peg$c379(s4, s9);
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
                          peg$savedPos = s2;
                          s3 = peg$c380(s4, s6);
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
                }
                if (s2 === peg$FAILED) {
                  s2 = null;
                }
                if (s2 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s3 = peg$c88;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c89); }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c381(s2);
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
                if (input.substr(peg$currPos, 12) === peg$c382) {
                  s1 = peg$c382;
                  peg$currPos += 12;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c383); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$parsews();
                  if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parsesoccer_club_nationality();
                    if (s4 !== peg$FAILED) {
                      peg$savedPos = s3;
                      s4 = peg$c374(s4);
                    }
                    s3 = s4;
                    if (s3 === peg$FAILED) {
                      s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s4 = peg$c88;
                        peg$currPos++;
                      } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c89); }
                      }
                      if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c384(s3);
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
      }

      return s0;
    }

    function peg$parsedirective() {
      var s0;

      s0 = peg$parserepeat();
      if (s0 === peg$FAILED) {
        s0 = peg$parserange();
      }

      return s0;
    }

    function peg$parserepeat() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$parserepeat_signature();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s4 = peg$c9;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsevalue_or_interpolation();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseend_array();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c385(s6);
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

      return s0;
    }

    function peg$parserepeat_signature() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c313;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c314); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c386) {
            s3 = peg$c386;
            peg$currPos += 6;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c387); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s5 = peg$c86;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c87); }
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
                                s13 = peg$c88;
                                peg$currPos++;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c89); }
                              }
                              if (s13 !== peg$FAILED) {
                                s14 = peg$parsews();
                                if (s14 !== peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 39) {
                                    s15 = peg$c313;
                                    peg$currPos++;
                                  } else {
                                    s15 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c314); }
                                  }
                                  if (s15 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c388(s7, s11);
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
          s1 = peg$c313;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c314); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c386) {
              s3 = peg$c386;
              peg$currPos += 6;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c387); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsews();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 40) {
                  s5 = peg$c86;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c87); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsews();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseint();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsews();
                      if (s8 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s9 = peg$c88;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c89); }
                        }
                        if (s9 !== peg$FAILED) {
                          s10 = peg$parsews();
                          if (s10 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 39) {
                              s11 = peg$c313;
                              peg$currPos++;
                            } else {
                              s11 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c314); }
                            }
                            if (s11 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c389(s7);
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
      if (input.substr(peg$currPos, 6) === peg$c390) {
        s1 = peg$c390;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c391); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseint();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c88;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c89); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c392(s3);
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
        if (input.substr(peg$currPos, 6) === peg$c390) {
          s1 = peg$c390;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c391); }
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
                          s9 = peg$c88;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c89); }
                        }
                        if (s9 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c393(s3, s7);
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
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c394) {
        s1 = peg$c394;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c395); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c396) {
          s2 = peg$c396;
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c397); }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s1;
          s2 = peg$c398();
        }
        s1 = s2;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s2 = peg$c86;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c87); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            if (peg$c51.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c52); }
            }
            if (s5 !== peg$FAILED) {
              if (peg$c74.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
              }
              if (s6 === peg$FAILED) {
                s6 = null;
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
            if (s4 !== peg$FAILED) {
              s5 = peg$parsews();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c88;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c89); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsews();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 58) {
                      s8 = peg$c9;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c10); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsews();
                      if (s9 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 123) {
                          s10 = peg$c3;
                          peg$currPos++;
                        } else {
                          s10 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c4); }
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parsews();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parsemember();
                            if (s12 !== peg$FAILED) {
                              s13 = peg$parsews();
                              if (s13 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 125) {
                                  s14 = peg$c7;
                                  peg$currPos++;
                                } else {
                                  s14 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c8); }
                                }
                                if (s14 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c399(s1, s4, s12);
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

      return s0;
    }

    function peg$parsefunction_prop() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c400) {
          s2 = peg$c400;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c401); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsecode();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c402(s1, s4);
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

      return s0;
    }

    function peg$parsecode() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseCODE_START();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsenot_code();
        if (s3 === peg$FAILED) {
          s3 = peg$parsecode();
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsenot_code();
          if (s3 === peg$FAILED) {
            s3 = peg$parsecode();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseCODE_STOP();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c403();
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

    function peg$parsenot_code() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseCODE_START();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseCODE_STOP();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c319); }
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

    function peg$parseCODE_START() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 123) {
        s0 = peg$c3;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }

      return s0;
    }

    function peg$parseCODE_STOP() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 125) {
        s0 = peg$c7;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }

      return s0;
    }

    function peg$parseDIGIT() {
      var s0;

      if (peg$c74.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c75); }
      }

      return s0;
    }

    function peg$parseHEXDIG() {
      var s0;

      if (peg$c404.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c405); }
      }

      return s0;
    }


      var language = "pt" //"pt" or "en", "pt" by default
      var components = []
      var queue = []
      var queue_prod = null

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
        for (var i = 0; i < queue_prod; i++) {
          if (api == "gen") arr.push(genAPI[moustaches](...args))
          if (api == "data") arr.push(dataAPI[sub_api][moustaches](...args))
        }
        return arr
      }

      var chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
          arr.slice(i * size, i * size + size)
        );


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