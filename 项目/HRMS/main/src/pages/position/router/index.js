import Vue from 'vue'
import Router from 'vue-router'

import JobList from '~position/components/job/Index'
import PositionList from '~position/components/position/Index'
import PositionDetails from '~position/components/position/Details'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/job',
      name: 'JobList',
      component: JobList,
      meta: { permission: '1020001,1020002' },
    },
    {
      path: '/position',
      name: 'PositionList',
      component: PositionList,
      meta: { permission: '1020001,1020002' },
    },
    {
      path: '/position/details/:id?',
      name: 'PositionDetails',
      component: PositionDetails,
      meta: {
        permission: '1020001,1020002',
        queryPermission: { edit: '1020001' },
      },
    },
  ],
})
