<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-6">
            <div class="input-group" style="margin-left: -5px">
            <div class="input-group-append">
              <input class="btn btn-primary float-left" type="button" value="Gerar" @click="generate"/>
            </div>
            <div class="input-group-append">
              <input id="saveModelButton" class="btn btn-danger float-left" type="button" value="Guardar Modelo" @click="saveModel" disabled/>
            </div>
            </div>
          </div>
          <div class="col-md-6">
            <ButtonGroup @toggleConversionType="toggleConversionType"/>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group">
          <div class="input-group-prepend ">
            <span class="input-group-text" id="basic-addon1">Nome:</span>
          </div>
          <input type="text" class="form-control" id="filename" value="dataset">
          <div class="input-group-append">
            <button id="defaultDownloadButton" class="btn btn-primary" disabled type="button" @click="download">Download</button>
          </div>
          <div class="input-group-append">
            <button id="generateAPIButton" class="btn btn-success" disabled type="button" @click="createAPI">Gerar API</button>
          </div>
          <div class="input-group-append">
            <button id="downloadAPIButton" class="btn btn-danger" disabled type="button" @click="downloadAPI">Download API</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 stretcher">
        <codemirror 
                ref="input"
                :value= "code"
                :options="cmInput"
                @input="onCmCodeChange"
        />
      </div>
      <div class="col-md-6 col-md-offset-2 stretcher">
        <codemirror
                ref="output"
                :value="result"
                :options="cmOutput"
        />
      </div>
    </div>
  </div>
  
</template>

<script>
import {convert} from '../grammar/convert.js'
import ButtonGroup from '../components/ButtonGroup'
import parser from '../grammar/parser.js'
import axios from 'axios';
import $ from 'jquery'
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

import { jsonToXml } from '../grammar/jsonToXML.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import "codemirror/theme/dracula.css";
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'

//import 'codemirror/addon/hint/javascript-hint.js';
//import 'codemirror/addon/hint/show-hint.css';
//import 'codemirror/addon/hint/show-hint.js';

export default {
  name: 'Home',
  components: {
    ButtonGroup
  },
  data() {
      return {
        output_format: "JSON",
        colname: null,
        model: null,
        components: null,
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
        	boleano: '{{boolean()}}'
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
        range_asc: range(1,15,3),
        range_desc: range(15,-50,-7),
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
	  		'{{boolean()}}',
	  		{
	  			elem: 1, 
                indice: '{{integer(20,50)}}', 
                lista_nested: [1,2,3], 
                range: range(-5) 
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
        cmInput: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          keyMap: "sublime",
          mode: 'text/javascript',
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "dracula",
          extraKeys: { "Ctrl": "autocomplete" },
          hintOptions:{
            completeSingle: false
          }
        },
        cmOutput: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          keyMap: "sublime",
          mode: 'text/javascript',
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
      toggleConversionType(arg){
        this.output_format = arg
      },
      generate(){
        //generated é um objeto em que o valor de cada prop é {dataset, model}
        localStorage.setItem('model',this.code)
        var generated = convert(this.code,this.parser)
        console.log(generated)
        
        if (this.output_format == "JSON") {
          this.cmOutput.mode = 'text/javascript'
          this.result = JSON.stringify(generated.dataModel.data, null, 2)
        }
        if (this.output_format == "XML") {
          this.cmOutput.mode = 'text/xml'
          this.result = jsonToXml(generated.dataModel.data)
        }
        /* if (output_format == "CSV") {
          this.result = jsonToCsv(generated.dataModel.data)
          this.cmOutput.mode == 'text/csv'
        } */

        var mkeys = Object.keys(generated.dataModel.model)
        //var ckeys = Object.keys(generated.components)
        
        this.colname = mkeys[0]
        this.model = generated.dataModel.model
        this.components = generated.components

        document.getElementById("saveModelButton").disabled = false;
        document.getElementById("defaultDownloadButton").disabled = false;
        document.getElementById("generateAPIButton").disabled = false;
      },
      downloadAPI(){
        var cname = this.colname
        console.log("collection name:"+cname)

        //var id = "colecao_c400bb89-41a0-4a94-80de-a0f29100afc9"
        axios.get('http://localhost:3000/download/'+cname)
          .then(dados => console.log("Zip criado"))
          .catch(erro => console.log(erro))
      },
      async saveModel(){
        $("#savemodels_modal").modal("show");
        $("#savemodels_modal").css("z-index", "1500");
        //await axios.post('http://localhost:3000/modelos/adicionar', json)
      },
      createAPI(){
        var body = {
          apiName: this.colname,
          model: this.model,
          componentes: this.components,
          dataset: JSON.parse(this.result)
        }

        //console.log("modelo aquii",document.getElementById("md").getAttribute("colname"))
        axios.post('http://localhost:3000/genAPI/',body)
          .then(dados => console.log("Modelo criado"))
          .catch(erro => console.log(erro))

        //axios.get('http://localhost:3000/dir/'+document.getElementById('filename').value,optionAxios)
        //.then(dados => console.log("Modelo criado"))
        //.catch(erro => console.log(erro))
        document.getElementById("downloadAPIButton").disabled = false;
      },
      download(){
        if(this.result == "") {
          alert("É necessário gerar um Dataset primeiro.")
        }
        else {
          var element = document.createElement('a');
          var filename = document.getElementById('filename').value + '.json'
          element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(this.result));
          element.setAttribute('download', filename);

          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
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
.col-md-6 {padding-right: 0px;}
.stretcher {padding-right: 0px; height: 89vh !important;}
.vue-codemirror{height:100%;}
</style>
