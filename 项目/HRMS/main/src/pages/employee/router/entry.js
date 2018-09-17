import Application from '~employee/components/entry/Application'
import ApplicationDetail from '~employee/components/entry/ApplicationDetail'
import Approving from '~employee/components/entry/Approving'
import ApprovingDetail from '~employee/components/entry/ApprovingDetail'
import Approved from '~employee/components/entry/Approved'
import ApprovedDetail from '~employee/components/entry/ApprovedDetail'
import Index from '~employee/components/entry/Index'

export default [
  {
    path: '/entry',
    component: Index,
  },
  {
    path: '/entry/application',
    component: Application,
    name: 'EntryApplication',
    meta: { permission: '1030005' },
  },
  {
    path: '/entry/application/:code/:id',
    component: ApplicationDetail,
    name: 'EntryApplicationDetail',
    meta: { permission: '1030005' },
  },
  {
    path: '/entry/approving',
    component: Approving,
    name: 'EntryApproving',
    meta: { permission: '1030005,1030006' },
  },
  {
    path: '/entry/approving/:code/:id',
    component: ApprovingDetail,
    name: 'EntryApprovingDetail',
    meta: { permission: '1030005,1030006' },
  },
  {
    path: '/entry/approved',
    component: Approved,
    name: 'EntryApproved',
    meta: { permission: '1030005,1030006' },
  },
  {
    path: '/entry/approved/:code/:id',
    component: ApprovedDetail,
    name: 'EntryApprovedDetail',
    meta: { permission: '1030005,1030006' },
  },
]
