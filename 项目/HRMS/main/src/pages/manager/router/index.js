import Vue from 'vue'
import Router from 'vue-router'

import Attendance from '~manager/components/attendance/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/attendance',
      name: 'Attendance',
      component: Attendance,
      meta: { permission: '1090001' },
    },
  ],
})
