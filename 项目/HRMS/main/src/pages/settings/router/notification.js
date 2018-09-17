import Jumper from '../components/notification/Jumper'
import Index from '../components/notification/Index'
import Approving from '../components/notification/Approving'
import Approved from '../components/notification/Approved'
import Create from '../components/notification/Create'
import Detail from '../components/notification/Detail'

export default [
  // 通知公告，此模块非流程配置，审核模式为系统写死
  {
    path: '/notification',
    name: 'Notification',
    component: Jumper,
    meta: { permission: '1050004,1050005,1050006' },
  },
  {
    path: '/notification/index',
    name: 'NotificationIndex',
    component: Index,
    meta: { permission: '1050004,1050005' },
  },
  {
    path: '/notification/approving',
    name: 'NotificationApproving',
    component: Approving,
    meta: { permission: '1050006' },
  },
  {
    path: '/notification/approved',
    name: 'NotificationApproved',
    component: Approved,
    meta: { permission: '1050006' },
  },
  {
    path: '/notification/create/:id?/:status?',
    name: 'NotificationCreate',
    component: Create,
    meta: { permission: '1050004' },
  },
  {
    path: '/notification/detail/:id/:status?',
    name: 'NotificationDetail',
    component: Detail,
    meta: { permission: '1050004,1050005,1050006' },
  },
  {
    path: '/notification/approving/:id',
    name: 'NotificationApprovingDetail',
    component: Detail,
    meta: { permission: '1050006' },
  },
]
