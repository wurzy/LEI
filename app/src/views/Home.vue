<template>
  <div>
    <Navbar/>
    <div class="row">
      <input class="btn btn-primary" type="button" value="Generate" @click="generate">
    </div>
    <div class="row">
      <div class="col-md-6">
        <codemirror 
                ref="input"
                :value= "code"
                :options="cmOption"
                @input="onCmCodeChange"
        />
      </div>
      <div class="col-md-6 col-md-offset-2">
        <codemirror
                ref="output"
                :value="result"
                :options="cmOption"
        />
      </div>
    </div>
  </div>
  
</template>

<script>
import Navbar from '../components/Navbar.vue' 
import {convert} from '../grammar/convert.js'
import parser from '../grammar/parser.js'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import "codemirror/theme/dracula.css";
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript.js'

//import 'codemirror/addon/hint/javascript-hint.js';
//import 'codemirror/addon/hint/show-hint.css';
//import 'codemirror/addon/hint/show-hint.js';

export default {
  name: 'Home',
  components:{
    Navbar
  },
  props: {
    msg: String
  },
  data() {
      return {
        parser: parser,
        result: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
        code: `[
 {

  'repeat(3)':
  [
  {
   range: range(5),
   string: "boas",
   numero: 93,
   name: {
     first: "Hugo",
     last: "Cardoso"
   },
   boolean: false
  },
  {
   estudante: false,
   trabalhador: true,
   outros: null,
   lista_exemplo: [
     "string",
     32,
     { elem: 1, indice: 2, lista_nested: [1,2,3], range: range(3) }
   ]
  }
  ]


 }
]`,
        cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'text/javascript',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "dracula",
          extraKeys: { "Ctrl": "autocomplete" },
          hintOptions:{
            completeSingle: false
          }
        }
      }
    },
    methods: {
      onCmCodeChange(newcode){
        this.code = newcode
      },
      generate(){
        this.result = convert(this.code,this.parser)
      }
    },
    computed: {
      codemirror() {
        return this.$refs.input.codemirror
      },
      codemirror2(){
        return this.$refs.output.codemirror
      }
    },
    mounted() {
      this.codemirror.setSize("100%", "100%")
      this.codemirror2.setSize("100%", "100%")
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row {margin-left: -8px; max-width: 100%}
.col-md-6 {padding-right: 0px; height: 89vh !important;}
.btn{margin-left: 15px; margin-bottom: 3px;}
.vue-codemirror{height:100%}

</style>
