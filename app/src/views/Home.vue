<template>
  <div>
    <div class="row">
      <div class="col-md-9">
        <input class="btn btn-primary float-left" type="button" value="Gerar" @click="generate"/>
      </div>
      <div class="col-md-3">
        <div class="input-group">
          <div class="input-group-prepend ">
            <span class="input-group-text" id="basic-addon1">Nome:</span>
          </div>
          <input type="text" class="form-control" id="filename" value="dataset">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="download">Download</button>
          </div>
          <div class="input-group-append">
            <button class="btn btn-success" type="button" @click="createAPI">Gerar API</button>
          </div>
        </div>
      </div>
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
import {convert} from '../grammar/convert.js'
import parser from '../grammar/parser.js'
import axios from 'axios';
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
  props: {
    msg: String
  },
  data() {
      return {
        parser: parser,
        result: "",
        code: `<!LANGUAGE pt>
{
  colecao: [
	'repeat(3)': {
        _id: '{{objectId()}}',
        guid: '{{guid()}}',
  		indice: '{{index()}}',
  		missing(50): {
        	boleano: '{{bool()}}'
        },
        inteiro_2args: '{{integer(30,70)}}',
        inteiro_3args: '{{integer(100,400,"$")}}',
        float_2args: '{{floating(-180.0451, 180)}}',
        float_3args: '{{floating(-180.0451, 180, 2)}}',
        float_4args: '{{floating(1000, 4000, 2, "0,0.00€")}}',
        posicao: '{{position()}}',
        posicao_com_limites: '{{position([0,30.5],[-50,-25.4])}}',
        telemovel: '{{phone()}}',
        telemovel_ext: '{{phone(true)}}',
        data: '{{date("10/01/2015")}}',
        data2: '{{date("10/01/2015", "YYYY-MM-DD")}}',
        data3: '{{date("10/05/2019","10/01/2018")}}',
        data4: '{{date("10/05/2019","10/01/2018", "MM.DD.AAAA")}}',
        aleatorio: '{{random("blue", null, true, false, 23, 17.56)}}',
        lorem_palavras: '{{lorem(3,"words")}}',
        lorem_frases: '{{lorem(2,"sentences")}}',
        lorem_paragrafos: '{{lorem(1,"paragraphs")}}',
	  	range: range(5),
        range_asc: range(10,15),
        range_desc: range(15,10),
	  	string: "boas",
	  	numero: 93,
	  	name: {
	    	first: "Hugo",
	    	last: "Cardoso"
	  	},
    	boolean: false,
	  	estudante: false,
	  	trabalhador: true,
	  	outros: null,
	  	lista_exemplo: [
	  		"string",
	  		'{{bool()}}',
	  		{
	  			elem: 1, 
                indice: '{{integer(20,50)}}', 
                lista_nested: [1,2,3], 
                range: range(3) 
            }
    	],
  		objeto: [
			'repeat(5)': {
  				indice_objeto: '{{index()}}'
  			}
		]
    }
  ]
}`,
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
        //generated é um objeto em que o valor de cada prop é {dataset, model}
        var generated = convert(this.code,this.parser)

        //generated.components
        //generated.dataModel.model
        console.log(generated)

        this.result = JSON.stringify(generated.dataModel.data, null, 2)
        var model = JSON.stringify(generated.dataModel.model, null, 2)

        //console.log("O modelo chegou:",model)

        var elem = document.createElement('boas');
        elem.setAttribute("id","md")
        elem.setAttribute("modelo", model)
        document.body.appendChild(elem)
      },
      createAPI(){
        console.log("Cunhanz!!!!")
      },
      download(){
        if(this.result == "") {
          alert("Generate a Dataset first.")
        }
        else {
          var element = document.createElement('a');
          var filename = document.getElementById('filename').value + '.json'
          element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(this.result));
          element.setAttribute('download', filename);

          element.style.display = 'none';
          document.body.appendChild(element);

          var a = document.getElementById("md").getAttribute("modelo")

          //element.click();
          var optionAxios = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var body = {}
          body["api"]=document.getElementById('filename').value
          axios.post('http://localhost:3000/genAPI/',body)
          .then(dados => console.log("Modelo criado"))
          .catch(erro => console.log(erro))
          //axios.get('http://localhost:3000/dir/'+document.getElementById('filename').value,optionAxios)
          //.then(dados => console.log("Modelo criado"))
          //.catch(erro => console.log(erro))
        
          document.body.removeChild(element);
        }
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
.row {margin-left: -8px; max-width: 100%; margin-bottom: 3px;}
.col-md-3 {padding-right: 0px;}
.col-md-6 {padding-right: 0px; height: 89vh !important;}
.vue-codemirror{height:100%}
</style>
