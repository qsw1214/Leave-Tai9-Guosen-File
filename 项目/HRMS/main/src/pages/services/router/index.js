import Vue from 'vue'
import Router from 'vue-router'
import Helper from '~services/components/Helper'
import op from './op'
import pa from './pa'
import approved from './approved'
import approving from './approving'
import attendance from './attendance'
import application from './application'

const setPermission = (routes) => {
  routes.forEach((route) => {
    if (!route.meta) route.meta = {}
    route.meta.permission = '1060001'
  })

  return routes
}

Vue.use(Router)

export default new Router({
  routes: [
    ...setPermission(pa),
    ...setPermission(approving),
    ...setPermission(approved),
    ...setPermission(application),
    ...setPermission(op),
    ...setPermission(attendance),
    {
      path: '/helper/:id?',
      name: 'Helper',
      component: Helper,
      meta: { permission: '1060001' },
    },
  ],
})
