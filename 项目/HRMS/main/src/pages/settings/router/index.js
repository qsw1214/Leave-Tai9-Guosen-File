import Vue from 'vue'
import Router from 'vue-router'
import Permission from '~settings/components/permission/Index'
import Role from '~settings/components/role/Index'
import PermissionDetails from '~settings/components/permission/Details'
import RoleDetails from '~settings/components/role/Details'
import ProcessIndex from '~settings/components/process/Index'
import MeetingIndex from '~settings/components/meeting/Index'
import ProcessDetails from '~settings/components/process/Details'
import OrderFood from '~settings/components/data/OrderFood'
import Helper from '~settings/components/data/Helper'
import Navigator from '~settings/components/navigator/Index'
import AttendanceIndex from '~settings/components/attendance/Index'
import AttendanceShiftsEdit from '~settings/components/attendance/ShiftsEdit'
import AttendanceShiftsDetails from '~settings/components/attendance/ShiftsDetail'

import notification from './notification'

Vue.use(Router)

export default new Router({
  routes: [
    // 基础配置
    {
      path: '/permission',
      name: 'Permission',
      component: Permission,
      meta: { permission: '1040002' },
    },
    {
      path: '/permission/details/:id?',
      name: 'PermissionEdit',
      component: PermissionDetails,
      meta: { permission: '1040002' },
    },
    {
      path: '/role',
      name: 'Role',
      component: Role,
      meta: { permission: '1040001' },
    },
    {
      path: '/role/create',
      name: 'RoleCreate',
      component: RoleDetails,
      meta: { permission: '1040001' },
    },
    {
      path: '/role/details/:id?',
      name: 'RoleEdit',
      component: RoleDetails,
      meta: { permission: '1040001' },
    },
    {
      path: '/process',
      redirect: '/process/index/monitor',
      meta: { permission: '1040003,1040004' },
    },
    {
      // tab 默认流程设置，流程监控：monitor
      path: '/process/index/:tab?',
      name: 'ProcessIndex',
      component: ProcessIndex,
      meta: { permission: '1040003,1040004' },
    },
    {
      // 流程节点详情页，流程节点配置页+ ?edit=true
      path: '/process/details/:id',
      name: 'ProcessEdit',
      component: ProcessDetails,
      meta: {
        permission: '1040003,1040004',
        queryPermission: { edit: '1040003' },
      },
    },
    {
      path: '/attendance',
      redirect: '/attendance/correction',
      meta: { permission: '1040005' },
    },
    {
      // tab 默认考勤数据修正
      path: '/attendance/:tab?',
      name: 'AttendanceIndex',
      component: AttendanceIndex,
      meta: { permission: '1040005' },
    },
    {
      // 考勤班次编辑
      path: '/attendance/shifts/edit/:id?',
      name: 'AttendanceShiftsEdit',
      component: AttendanceShiftsEdit,
      meta: { permission: '1040005' },
    },
    {
      // 考勤班次详情
      path: '/attendance/shifts/details/:id',
      name: 'AttendanceShiftsDetails',
      component: AttendanceShiftsDetails,
      meta: { permission: '1040005' },
    },
    // 数据配置
    {
      path: '/order/food',
      name: 'OrderFood',
      component: OrderFood,
      meta: { permission: '1050001,1050002' },
    },
    {
      path: '/helper',
      name: 'Helper',
      component: Helper,
      meta: { permission: '1050003' },
    },
    {
      path: '/meeting',
      redirect: '/meeting/index/room',
      meta: { permission: '1050009,1050010' },
    },
    {
      // tab 默认流程设置，会议管理：room
      path: '/meeting/index/:tab?',
      name: 'MeetingIndex',
      component: MeetingIndex,
      meta: { permission: '1050009,1050010' },
    },
    ...notification,
    {
      path: '/navigator',
      name: 'Navigator',
      component: Navigator,
      meta: { permission: '1050007,1050008' },
    },
  ],
})
