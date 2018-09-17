import Vue from 'vue'
import App from './App'
import axios from './helper/axios'
import VueElement from 'element-ui'
import router from './router/routes'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'helper/filters'

Vue.config.productionTip = false
Vue.use(VueElement)
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
