import Application from '~employee/components/transfer/Application'
import ApplicationDetail from '~employee/components/transfer/ApplicationDetail'
import Approving from '~employee/components/transfer/Approving'
import ApprovingDetail from '~employee/components/transfer/ApprovingDetail'
import Approved from '~employee/components/transfer/Approved'
import ApprovedDetail from '~employee/components/transfer/ApprovedDetail'
import Index from '~employee/components/transfer/Index'

export default [
  {
    path: '/transfer',
    name: 'TransferIndex',
    component: Index,
  },
  {
    path: '/transfer/application',
    name: 'TransferApplication',
    component: Application,
    meta: { permission: '1030009' },
  },
  {
    path: '/transfer/application/:code/:id',
    name: 'TransferApprlicationDetail',
    component: ApplicationDetail,
    meta: { permission: '1030009' },
  },
  {
    path: '/transfer/approving',
    name: 'TransferApproving',
    component: Approving,
    meta: { permission: '1030009,1030010' },
  },
  {
    path: '/transfer/approving/:code/:id',
    name: 'TransferApprovingDetail',
    component: ApprovingDetail,
    meta: { permission: '1030009,1030010' },
  },
  {
    path: '/transfer/approved',
    name: 'TransferApproved',
    component: Approved,
    meta: { permission: '1030009,1030010' },
  },
  {
    path: '/transfer/approved/:code/:id',
    name: 'TransferApprovedDetail',
    component: ApprovedDetail,
    meta: { permission: '1030009,1030010' },
  },
]
