import Vue from 'vue'
import Router from 'vue-router'

import adjust from './adjust'
import legalPerson from './legalPerson'

const OrgQuery = () => import('~organization/components/maintain/Index')
const EmployeeList = () => import('~organization/components/department/EmployeeList')
const Department = () => import('~organization/components/department/Department')
const DepartmentHistory = () => import('~organization/components/department/DepartmentHistory')
const Organization = () => import('~organization/components/organizationGraph/Index')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/department/:id?',
      name: 'Department',
      component: Department,
      meta: {
        permission: '1010001,1010002',
        queryPermission: { edit: '1010001' },
      },
    },
    {
      path: '/department-history/:id?',
      name: 'DepartmentHistory',
      component: DepartmentHistory,
      meta: { permission: '1010001,1010002' },
    },
    {
      path: '/employee-list/:id',
      name: 'EmployeeList',
      component: EmployeeList,
      meta: { permission: '1030001,1030002' },
    },
    {
      path: '/query',
      name: 'OrgQuery',
      component: OrgQuery,
      meta: { permission: '1010001,1010002' },
    },
    {
      path: '/organization',
      name: 'Organization',
      component: Organization,
      meta: { permission: '1010001,1010002' },
    },
    ...adjust,
    ...legalPerson,
  ],
})
