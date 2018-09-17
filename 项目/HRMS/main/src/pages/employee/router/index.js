import Vue from 'vue'
import Router from 'vue-router'

import Maintain from '~employee/components/Maintain'
import MaintainCase from '~employee/components/maintain/case/Index'
import EmployeeCreate from '~employee/components/maintain/Create'
import Profile from '~employee/components/maintain/Profile'

import transferRoutes from './transfer'
import toEntryRoutes from './toEntry'
import entryRoutes from './entry'
import leaveRoutes from './leave'
import becomeRegular from './becomeRegular'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/maintain',
      name: 'Maintain',
      component: Maintain,
      meta: { permission: '1030001,1030002' },
    },
    {
      path: '/maintain/case',
      name: 'MaintainCase',
      component: MaintainCase,
      meta: { permission: '1030001,1030002' },
    },
    {
      path: '/maintain/create/:type?/:id?',
      name: 'EmployeeCreate',
      component: EmployeeCreate,
      meta: { permission: '1030001' },
    },
    {
      path: '/maintain/profile/:id/:type?',
      name: 'employeeProfile',
      component: Profile,
      meta: { permission: '1030001,1030002' },
    },
    ...toEntryRoutes,
    ...entryRoutes,
    ...transferRoutes,
    ...leaveRoutes,
    ...becomeRegular,
  ],
})
