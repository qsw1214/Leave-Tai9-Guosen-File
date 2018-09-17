import Vue from 'vue'
// import App from './App'
import router from './router'
import api from './api'
import store from './store'
import './filer'

const utils = window.Lib.utils.default

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$utils = utils
Vue.prototype.$api = api
Vue.prototype.$axios = utils.axios
Vue.prototype.$permission = utils.permission

/**
 * 统一面包屑前两个节点
 * @param {Array} breadcrumb
 * @param {String} type, default 'services' -> 员工服务
 */
Vue.prototype.$breadcrumb = (breadcrumb, type) => {
  const prop = type || 'services'
  const init = {
    services: [
      { name: '员工自助' },
      { name: '员工服务', to: '/pa/index' },
    ],
    attendance: [
      { name: '员工自助' },
      { name: '考勤管理', to: '/attendance' },
    ],
  }

  return init[prop].concat((breadcrumb || []))
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
  { sidebar: { active: 'services' } }
)
