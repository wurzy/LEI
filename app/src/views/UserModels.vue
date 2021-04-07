<template>
<div class="container" >
    <h2 style="margin-top:85px" >Modelos Guardados</h2>
    <hr/>
    <div class="row">
        <div class="col-md-12" style="margin-top:25px">
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                    <div class="panel panel-default" v-for="(model, idx) in userModels" :key="idx">
                        <div class="panel-heading" role="tab" :id="'heading' + model._id">
                            <h4 class="panel-title">
                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" :href="'#collapse' + model._id" aria-expanded="false" :aria-controls="'collapse' + model._id">
                                    {{model.titulo}} 
                                    <span style="color:gray">({{model.dataCriacao | moment("calendar")}})</span>
                                </a>
                            </h4>
                        </div>
                        <div :id="'collapse' + model._id" class="panel-collapse collapse" role="tabpanel" :aria-labelledby="'heading' + model._id">
                            <div class="panel-body">
                                <p>
                                    <b>Descrição:</b> {{model.descricao}}
                                </p>
                                <p>
                                    <b>Visibilidade: </b>
                                    <label class="switch">
                                      <input :id="'switch' + model._id" v-if="model.visibilidade" type="checkbox" checked @click="toggled(model._id)">
                                      <input :id="'switch' + model._id" v-else type="checkbox" @click="toggled(model._id)">
                                      <span class="slider round"></span>
                                    </label>
                                    <span v-if="model.visibilidade">
                                        (<font-awesome-icon icon="lock-open"/> Público)
                                    </span>
                                    <span v-else>
                                        (<font-awesome-icon icon="lock"/> Privado)
                                    </span>
                                </p> 
                                <codemirror
                                    ref="idx"
                                    :value="model.modelo"
                                    :options="cmOption"
                                ></codemirror>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import "codemirror/theme/dracula.css";
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript.js'
import "codemirror/addon/display/autorefresh.js";

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

export default {
    name: "UserModels",
    data() {
        return {
            userModels: null,
            cmOption: {
                tabSize: 4,
                readOnly: true,
                autoRefresh: true,
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
        async getUserModels(){
            const user = JSON.parse(localStorage.getItem('user'))._id
            const res = await axios.get('modelos/utilizador/' + user)
            this.userModels = res.data
        },
        isEmpty(){
            return this.userModels==null
        },
        async toggled(id){
            for(let [k, m] of Object.entries(this.userModels)){
                if(m._id==id){
                    m.visibilidade = !m.visibilidade
                    await axios.post('modelos/visibilidade/'+id,{visibilidade: m.visibilidade})
                    return
                }
            }
        }
    },
    mounted() {
        this.getUserModels()
    }
}
</script>

<style scoped>
a:hover,a:focus{
  text-decoration: none;
  outline: none;
}
#accordion .panel{
  border: none;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 15px;
  position: relative;
}
#accordion .panel:before{
  content: "";
  display: block;
  width: 1px;
  height: 100%;
  border: 1px dashed #6e8898;
  position: absolute;
  top: 25px;
  left: 18px;
}
#accordion .panel:last-child:before{ display: none; }
#accordion .panel-heading{
  padding: 0;
  border: none;
  border-radius: 0;
  position: relative;
}
#accordion .panel-title a{
  display: block;
  padding: 10px 30px 10px 60px;
  margin: 0;
  background: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #1d3557;
  border-radius: 0;
  position: relative;
}
#accordion .panel-title a:before,
#accordion .panel-title a.collapsed:before{
  content: "\f107";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  width: 40px;
  height: 100%;
  line-height: 40px;
  background: #8a8ac3;
  border: 1px solid #8a8ac3;
  border-radius: 3px;
  font-size: 17px;
  color: #fff;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s ease 0s;
}
#accordion .panel-title a.collapsed:before{
  content: "\f105";
  background: #fff;
  border: 1px solid #6e8898;
  color: #000;
}
#accordion .panel-body{
  padding: 10px 30px 10px 30px;
  margin-left: 40px;
  background: #fff;
  border-top: none;
  color: #6f6f6f;
  line-height: 28px;
  letter-spacing: 1px;
}

.switch {
    line-height: 22px;
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

label{
    margin-bottom: 0px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

p{
    color:#404040;
}
</style>