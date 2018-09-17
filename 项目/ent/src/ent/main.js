// window.alert('Hi')
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vueResource from 'vue-resource'
import vueTap from 'v-tap'
// import { sync } from 'vuex-router-sync'
import { Interceptors } from 'helper/interceptors'
import { Filters } from 'helper/filters'
import '../../node_modules/lib-flexible/flexible.js'
// import './helper/console.js'
// import JSBridge from 'helper/JSBridge'
import 'style/index'
// import 'weui'
// sync(store, router)
Vue.use(vueResource)
Vue.use(vueTap)
// CROS 拦截器
Interceptors(() => {
  console.log('统一错误处理函数')
})
// Vue 全局过滤器
Filters()

new Vue({
  router,
  store,
  ...App
}).$mount('#app')

