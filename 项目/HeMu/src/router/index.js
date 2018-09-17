import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 404 page
import NotFoundComponent from 'components/NotFoundComponent.vue'
// client page
import Login from 'components/Login'
import Client from 'components/Client'
import News from 'components/News'
import Worth from 'components/Worth'

export default new Router({
  // mode: 'history',
  routes: [
    { path: '/Login', component: Login },
    { path: '/Client', component: Client },
    { path: '/News', component: News },
    { path: '/Worth', component: Worth },
    // 404页面配置
    { path: '*', component: NotFoundComponent }
  ],
  // 路由scroller行为当路由mode为history形式生效
  scrollBehavior (to, from, savedPosition) {
    return false
  }
})
