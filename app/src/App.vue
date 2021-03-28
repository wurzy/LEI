<template>
  <div id="app">
    <Navbar :key="forceUpdateKey" v-on:update="forceUpdate"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue' 
export default {
  name: 'App',
  data() {
    return {
      forceUpdateKey: 1
    }
  },
  methods: {
    forceUpdate(){
      this.forceUpdateKey++
    }
  },
  components:{
    Navbar
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
</style>
