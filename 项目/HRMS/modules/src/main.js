// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Modules from './modules'
import utils from './utils'
import './assets/common.scss'

const store = new Vuex.Store({})

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(Modules)
Vue.prototype.$utils = utils
Vue.prototype.$api = utils.api
Vue.prototype.$axios = utils.axios

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
