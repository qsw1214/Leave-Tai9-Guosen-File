import TransferDetail from '~employee/components/transfer/ApplicationDetail'
import LeaveDetail from '~employee/components/leave/ApplicationDetail'
import BecomeRegularDetail from '~employee/components/becomeRegular/ApplicationDetail'
import Index from '../components/op/Index'
import InitiatedTransfer from '../components/op/InitiatedTransfer'
import InitiatedLeave from '../components/op/InitiatedLeave'
import InitiatedBecomeRegular from '../components/op/InitiatedBecomeRegular'
import ApprovingBecomeRegular from '../components/op/ApprovingBecomeRegular'

export default [
  // 组织人事首页
  {
    path: '/op/:tab?',
    name: 'OrganizePersonnel',
    component: Index,
  },
  // 发起调动申请流程
  {
    path: '/op/initiated/transfer/:id?',
    name: 'InitiatedTransfer',
    component: InitiatedTransfer,
  },
  // 调动申请详情
  {
    path: '/op/transfer/:code/:id',
    name: 'TransferDetail',
    component: TransferDetail,
  },
  // 发起离职申请流程
  {
    path: '/op/initiated/leave/:id?',
    name: 'InitiatedLeave',
    component: InitiatedLeave,
  },
  // 离职详情
  {
    path: '/op/leave/:code/:id',
    name: 'LeaveDetail',
    component: LeaveDetail,
  },
  // 重新发起转正申请
  {
    path: '/op/initiated/become-regular/:id?',
    name: 'InitiatedBecomeRegular',
    component: InitiatedBecomeRegular,
  },
  // 审批转正申请
  {
    path: '/op/approving/become-regular/:id?',
    name: 'ApprovingBecomeRegular',
    component: ApprovingBecomeRegular,
  },
  // 转正详情
  {
    path: '/op/become-regular/:code/:id',
    name: 'BecomeRegularDetail',
    component: BecomeRegularDetail,
  },
]
