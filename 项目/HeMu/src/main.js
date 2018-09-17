// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import vueTap from 'v-tap'
import { Interceptor } from 'helper/interceptor'
import '../node_modules/lib-flexible/flexible.js'
import 'style/index'
Vue.use(vueResource)
Vue.use(vueTap)
// 添加请求拦截器
Interceptor()
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
