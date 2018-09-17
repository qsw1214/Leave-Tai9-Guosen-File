import Pa from '~employee/components/toEntry/Pa'
import Application from '~employee/components/toEntry/Application'
import ApplicationDetail from '~employee/components/toEntry/ApplicationDetail'
import Approving from '~employee/components/toEntry/Approving'
import ApprovingDetail from '~employee/components/toEntry/ApprovingDetail'
import Approved from '~employee/components/toEntry/Approved'
import ApprovedDetail from '~employee/components/toEntry/ApprovedDetail'
import Index from '~employee/components/toEntry/Index'

export default [
  {
    path: '/to-entry',
    component: Index,
  },
  {
    path: '/to-entry/pa/:code/:id?',
    component: Pa,
    name: 'ToEntryPa',
    meta: { permission: '1030003' },
  },
  {
    path: '/to-entry/application',
    component: Application,
    name: 'ToEntryApplication',
    meta: { permission: '1030003' },
  },
  {
    path: '/to-entry/application/:code/:id',
    name: 'ToEntryApplicationDetail',
    component: ApplicationDetail,
    meta: { permission: '1030003' },
  },
  {
    path: '/to-entry/approving',
    component: Approving,
    name: 'ToEntryApproving',
    meta: { permission: '1030003,1030004' },
  },
  {
    path: '/to-entry/approving/:code/:id',
    name: 'ToEntryApprovingDetail',
    component: ApprovingDetail,
    meta: { permission: '1030003,1030004' },
  },
  {
    path: '/to-entry/approved',
    component: Approved,
    name: 'ToEntryApproved',
    meta: { permission: '1030003,1030004' },
  },
  {
    path: '/to-entry/approved/:code/:id',
    name: 'ToEntryApprovedDetail',
    component: ApprovedDetail,
    meta: { permission: '1030003,1030004' },
  },
]
