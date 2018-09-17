import Vue from 'vue'
import Router from 'vue-router'

import Attendance from '~report/components/attendance/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/attendance/:tab?',
      name: 'Attendance',
      component: Attendance,
      meta: { permission: '1080001,1080002,1080003' },
    },
  ],
})
