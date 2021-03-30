<template>
<div>
  <Login v-on:logged_in="loggedIn"/>
  <Register v-on:register_ok="registerOk" :key="registerKey"/>

  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
   <div class="container">
    <a class="navbar-brand" href="/">Gerador de Datasets</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav ml-auto">
        <div v-if="isHome">
          <li class="nav-item active">
            <a class="nav-link" href="/"><font-awesome-icon icon="download"/> Gerar
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="/"><font-awesome-icon icon="download"/> Gerar</a>
          </li>
        </div>
        <div v-if="isDocumentation">
          <li class="nav-item active">
            <a class="nav-link" href="documentacao"><font-awesome-icon icon="file-alt"/> Documentação
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="documentacao"><font-awesome-icon icon="file-alt"/> Documentação</a>
          </li>
        </div>
        <div v-if="isAbout">
          <li class="nav-item active">
            <a class="nav-link" href="sobre"><font-awesome-icon icon="university"/> Sobre
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="sobre"><font-awesome-icon icon="university"/> Sobre</a>
          </li>
        </div>
        <div>
          <li v-if="isLoggedIn" class="nav-item">
            <div class="dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" id="userDropDownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               <font-awesome-icon icon="user-alt"/> {{utilizador.nome}}
              </a>

              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href="#"><font-awesome-icon icon="wrench"/> Definições</a>
                <a class="dropdown-item" href="meusmodelos"><font-awesome-icon icon="save"/> Modelos Guardados</a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" @click="logout"><font-awesome-icon icon="sign-out-alt"/> Logout</a>
              </div>
            </div>
          </li>
        </div>
        <div>
          <li v-if="!isLoggedIn" class="nav-item">
            <a href="#" class="nav-link" @click="login">Login</a>
          </li>
        </div>
        <div>
          <li v-if="!isLoggedIn" class="nav-item">
            <a href="#" class="nav-link" @click="registar">Registar</a>
          </li>
        </div>
      </ul>
    </div>
  </div>
 </nav>
</div>
</template>

<script>
import Register from './Register.vue';
import Login from './Login.vue';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from 'jquery';
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:3000/";

export default {
  name: "Navbar",
  components: {
    Register,
    Login
  },
  data(){
    return {
      utilizador: { type: Object, default: () => ({}) },
      registerKey: 1
    }
  },
  computed: {
    isHome() {
      return this.$route.name == "Home";
    },
    isAbout() {
      return this.$route.name == "About";
    },
    isDocumentation() {
      return this.$route.name == "Documentation";
    },
    isLoggedIn(){
      return localStorage.getItem('token')!=null
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    console.log("render")
    if(token){
      const res = await axios.get('utilizadores/' + localStorage.getItem('token'))
      localStorage.setItem('user', JSON.stringify(res.data))
      this.utilizador = res.data
    }
    else {
      console.log("not logged in")
    }
  },
  methods: {
    login(){
      $("#login_modal").modal("show");
      $("#login_modal").css("z-index", "1500");
    },
    registar(){
      $("#registar_modal").modal("show");
      $("#registar_modal").css("z-index", "1500");
    },
    logout(){
      axios.post('utilizadores/logout', {token: localStorage.getItem('token')})
        .then(dados => {
          localStorage.removeItem('token')
          this.$emit('update')
        })
        .catch(error => console.log(error))
    },
    loggedIn(){
      console.log("emiti")
      this.$emit('update')
    },
    registerOk(){
      this.registerKey++
    }
  }
};
</script>