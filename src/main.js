import Vue from 'vue'
import VueResize from 'vue-resize'
import App from './App.vue'
import KontentCustomElementApi from './plugins/kontent-custom-element-api'

import 'vue-resize/dist/vue-resize.css'
import './kontent-theme/custom-module.css'



Vue.use(VueResize)
Vue.use(KontentCustomElementApi)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
