import Vue from 'vue'
import App from './App.vue'
import VueCodeMirror from 'vue-codemirror'
import router from './router'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

Vue.config.productionTip = false

Vue.use(VueCodeMirror)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
