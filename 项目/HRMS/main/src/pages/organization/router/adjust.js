const Index = () => import('~organization/components/adjust/Index')
const HigherChange = () => import('~organization/components/adjust/HigherChange')
const Split = () => import('~organization/components/adjust/Split')
const Merge = () => import('~organization/components/adjust/Merge')
const HigherDetail = () => import('~organization/components/adjust/HigherDetail')
const MergeDetail = () => import('~organization/components/adjust/MergeDetail')
const SplitDetail = () => import('~organization/components/adjust/SplitDetail')

const routes = [
  {
    name: 'adjust-index',
    path: '/adjust',
    component: Index,
    meta: { permission: '1010001' },
  },
  {
    name: 'adjust-higher-change',
    path: '/adjust/higher/change/:id?/:status?',
    component: HigherChange,
    meta: { permission: '1010001' },
  },
  {
    name: 'adjust-higher-detail',
    path: '/adjust/higher/detail/:id/:status?',
    component: HigherDetail,
    meta: { permission: '1010001' },
  },
  {
    name: 'adjust-higher-split',
    path: '/adjust/split/:id?/:status?',
    component: Split,
    meta: { permission: '1010001' },
  },
  {
    name: 'adjust-higher-split-detail',
    path: '/adjust/split/detail/:id?/:status?',
    component: SplitDetail,
    meta: { permission: '1010001' },
  },
  {
    name: 'adjust-higher-merge',
    path: '/adjust/merge/:id?/:status?',
    component: Merge,
    meta: { permission: '1010001' },
  },
  {
    name: 'adjust-higher-merge-detail',
    path: '/adjust/merge/detail/:id?/:status?',
    component: MergeDetail,
    meta: { permission: '1010001' },
  },
]
export default routes
