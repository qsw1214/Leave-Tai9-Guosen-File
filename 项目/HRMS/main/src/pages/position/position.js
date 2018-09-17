import Vue from 'vue'
import router from './router'
import api from './api'
import store from './store'

const utils = window.Lib.utils.default

Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$api = api
Vue.prototype.$axios = utils.axios
Vue.prototype.$permission = utils.permission

router.beforeEach((to, from, next) => {
  utils.config.init()
    .then(() => {
      utils.permission.router(to)
        .then(next)
        .catch(() => { next(false) })
    })
    .catch(() => {})
})

utils.createApp(
  { router, store },
  { sidebar: { active: 'position' } }
)
