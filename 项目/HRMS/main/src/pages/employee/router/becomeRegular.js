import Application from '~employee/components/becomeRegular/Application'
import ApplicationDetail from '~employee/components/becomeRegular/ApplicationDetail'
import Approving from '~employee/components/becomeRegular/Approving'
import ApprovingDetail from '~employee/components/becomeRegular/ApprovingDetail'
import Approved from '~employee/components/becomeRegular/Approved'
import ApprovedDetail from '~employee/components/becomeRegular/ApprovedDetail'
import Index from '~employee/components/becomeRegular/Index'

export default [
  {
    path: '/become-regular',
    name: 'BecomeRegularIndex',
    component: Index,
  },
  {
    path: '/become-regular/application',
    name: 'BecomeRegularApplication',
    component: Application,
    meta: { permission: '1030011' },
  },
  {
    path: '/become-regular/application/:code/:id',
    name: 'BecomeRegularApprlicationDetail',
    component: ApplicationDetail,
    meta: { permission: '1030011' },
  },
  {
    path: '/become-regular/approving',
    name: 'BecomeRegularApproving',
    component: Approving,
    meta: { permission: '1030011,1030012' },
  },
  {
    path: '/become-regular/approving/:code/:id',
    name: 'BecomeRegularApprovingDetail',
    component: ApprovingDetail,
    meta: { permission: '1030011,1030012' },
  },
  {
    path: '/become-regular/approved',
    name: 'BecomeRegularApproved',
    component: Approved,
    meta: { permission: '1030011,1030012' },
  },
  {
    path: '/become-regular/approved/:code/:id',
    name: 'BecomeRegularApprovedDetail',
    component: ApprovedDetail,
    meta: { permission: '1030011,1030012' },
  },
]
