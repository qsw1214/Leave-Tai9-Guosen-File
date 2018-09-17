import Vue from 'vue'
import App from './App'
import VueElement from 'element-ui'
import VueRouter from 'vue-router'
import router from './router'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import AxiosPlugin from '@/utils/axios'

Vue.use(VueElement)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype.$axios = AxiosPlugin

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
