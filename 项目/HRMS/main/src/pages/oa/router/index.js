import Vue from 'vue'
import Router from 'vue-router'
import meeting from './meeting'
import books from './books'
import share from './share'
import Contact from '../components/contact/Index'

const setPermission = (routes, permission) => {
  routes.forEach((route) => {
    if (!route.meta) route.meta = {}
    route.meta.permission = permission
  })

  return routes
}

Vue.use(Router)

export default new Router({
  routes: [
    ...setPermission(meeting, '1070001'),
    ...books,
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: { permission: '1070002' },
    },
    ...share,
  ],
})
