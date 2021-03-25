<template>
<div>
  <Login />
  <Register />
  <Success msg="Registo efetuado com sucesso!" id="register_success_modal"/>
  <Success msg="Login efetuado com sucesso!" id="login_success_modal"/>

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
            <a class="nav-link" href="/">Gerar
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="/">Gerar</a>
          </li>
        </div>
        <div v-if="isDocumentation">
          <li class="nav-item active">
            <a class="nav-link" href="documentation">Documentação
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="documentation">Documentação</a>
          </li>
        </div>
        <div v-if="isAbout">
          <li class="nav-item active">
            <a class="nav-link" href="about">Sobre
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="about">Sobre</a>
          </li>
        </div>
        <div>
          <li v-if="isLoggedIn" class="nav-item">
            <a href="#" class="nav-link" @click="logout">Logout</a>
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
import Success from './Success.vue';
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
    Success,
    Register,
    Login
  },
  data(){
    return {
      utilizador: null
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
      this.utilizador = res.data
      console.log(res.data)
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
          this.$router.go(this.$router.currentRoute)
        })
        .catch(error => console.log(error))
    }
  }
};
</script>