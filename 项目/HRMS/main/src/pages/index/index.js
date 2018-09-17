import Vue from 'vue'
import router from './router'
import api from './api'
import store from './store'

const utils = window.Lib.utils.default

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$utils = utils
Vue.prototype.$api = api
Vue.prototype.$axios = utils.axios
Vue.prototype.$permission = utils.permission

const query = (name) => {
  const search = window.location.search.substr(1).split('&')
  const regex = new RegExp(`[^${name}=].*`)
  const res = search.filter(item => (item.indexOf(`${name}=`) === 0))[0]

  return (res ? res.match(regex)[0] : '')
}

const token = query('token')

if (token) {
  sessionStorage.clear()
  localStorage.setItem('token', token)
  window.location.replace(window.location.origin + window.location.pathname)
}

router.beforeEach((to, from, next) => {
  utils.config.init()
    .then(() => {
      utils.permission.router(to)
        .then(next)
        .catch(() => next(false))
    })
    .catch(() => {})
})

utils.createApp(
  { router, store },
  {
    sidebar: { active: 'index' },
    header: { 'is-search-user': true },
  },
)
