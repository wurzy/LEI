<template>
  <div class="hello">
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
      <div class="col-md-6">
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
        result: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
        code: `[
  {
    'repeat(5, 10)': {
      _id: '{{objectId()}}',
      index: '{{index()}}',
      guid: '{{guid()}}',
      isActive: '{{bool()}}',
      balance: '{{floating(1000, 4000, 2, "$0,0.00")}}',
      picture: 'http://placehold.it/32x32',
      age: '{{integer(20, 40)}}',
      eyeColor: '{{random("blue", "brown", "green")}}',
      name: {
        first: '{{firstName()}}',
        last: '{{surname()}}'
      },
      company: '{{company().toUpperCase()}}',
      phone: '+1 {{phone()}}',
      address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
      about: '{{lorem(1, "paragraphs")}}',
      registered: '{{moment(this.date(new Date(2014, 0, 1), new Date())).format("LLLL")}}',
      latitude: '{{floating(-90.000001, 90)}}',
      longitude: '{{floating(-180.000001, 180)}}',
      tags: [
        {
          'repeat(5)': '{{lorem(1, "words")}}'
        }
      ],
      range: range(10),
      friends: [
        {
          'repeat(3)': {
            id: '{{index()}}',
            name: '{{firstName()}} {{surname()}}'
          }
        }
      ],
      favoriteFruit(tags) {
        const fruits = ['apple', 'banana', 'strawberry'];
        return fruits[tags.integer(0, fruits.length - 1)];
      }
    }
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
        this.result = convert(this.code)
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
.row {max-width: 100%;}
.col-md-6 {padding-right: 0px; height:100%; min-height: 745px;}
.row{margin-left: -8px;}
.btn{margin-left: 15px; margin-bottom: 3px;}
</style>
