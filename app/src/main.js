import Vue from 'vue'
import App from './App.vue'
import VueCodeMirror from 'vue-codemirror'
import router from './router'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import VueMoment from 'vue-moment'
import moment from 'moment'
library.add(fas)
moment.locale('pt');
Vue.config.productionTip = false

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueCodeMirror)
Vue.use(VueMoment, { moment });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
