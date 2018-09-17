// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AxiosPlugin from '@/helper/axios'
import VueScroller from 'vue-scroller'
import '@/helper/flexible'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/radar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

Vue.use(AxiosPlugin)
Vue.use(VueScroller)
Vue.component('chart', ECharts)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
