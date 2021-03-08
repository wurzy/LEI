<template>
 <nav class="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
  <div class="container">
    <a class="navbar-brand" href="/">Dataset Generator</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav ml-auto">
        <div v-if="isHome">
          <li class="nav-item active">
            <a class="nav-link" href="/">Home
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="/">Home</a>
          </li>
        </div>
        <div v-if="isAbout">
          <li class="nav-item active">
            <a class="nav-link" href="about">About
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="about">About</a>
          </li>
        </div>
        <div v-if="isDocumentation">
          <li class="nav-item active">
            <a class="nav-link" href="documentation">Documentation
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </div>
        <div v-else>
          <li class="nav-item">
            <a class="nav-link" href="documentation">Documentation</a>
          </li>
        </div>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'Navbar',
  computed:{
    isHome() {
      return this.$route.name == "Home"
    },
    isAbout() {
      return this.$route.name == "About"
    },
    isDocumentation(){
      return this.$route.name == "Documentation"
    }
  }
}
</script>