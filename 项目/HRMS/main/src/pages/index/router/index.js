import Vue from 'vue'
import Router from 'vue-router'
import Index from '~index/components/Index'
import Notification from '~index/components/Notification'
import Profile from '~employee/components/maintain/Profile'
import feedback from './feedback'

const setPermission = (routes) => {
  routes.forEach((route) => {
    if (!route.meta) route.meta = {}
    route.meta.permission = '1000001,1000002'
  })

  return routes
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      meta: { permission: '1000001,1000002' },
    },
    {
      path: '/notification/:id',
      name: 'Notification',
      component: Notification,
      meta: { permission: '1000001,1000002' },
    },
    {
      path: '/profile/:id',
      name: 'IndexProfile',
      component: Profile,
      meta: { permission: '1000001,1000002' },
    },
    ...setPermission(feedback),
  ],
})
