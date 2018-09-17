import Application from '~employee/components/leave/Application'
import ApplicationDetail from '~employee/components/leave/ApplicationDetail'
import Approving from '~employee/components/leave/Approving'
import ApprovingDetail from '~employee/components/leave/ApprovingDetail'
import Approved from '~employee/components/leave/Approved'
import ApprovedDetail from '~employee/components/leave/ApprovedDetail'
import Index from '~employee/components/leave/Index'

export default [
  {
    path: '/leave',
    name: 'LeaveIndex',
    component: Index,
  },
  {
    path: '/leave/application',
    name: 'LeaveApplication',
    component: Application,
    meta: { permission: '1030007' },
  },
  {
    path: '/leave/application/:code/:id',
    name: 'LeaveApprlicationDetail',
    component: ApplicationDetail,
    meta: { permission: '1030007' },
  },
  {
    path: '/leave/approving',
    name: 'LeaveApproving',
    component: Approving,
    meta: { permission: '1030007,1030008' },
  },
  {
    path: '/leave/approving/:code/:id',
    name: 'LeaveApprovingDetail',
    component: ApprovingDetail,
    meta: { permission: '1030007,1030008' },
  },
  {
    path: '/leave/approved',
    name: 'LeaveApproved',
    component: Approved,
    meta: { permission: '1030007,1030008' },
  },
  {
    path: '/leave/approved/:code/:id',
    name: 'LeaveApprovedDetail',
    component: ApprovedDetail,
    meta: { permission: '1030007,1030008' },
  },
]
