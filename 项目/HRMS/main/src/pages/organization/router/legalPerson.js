const Index = () => import('~organization/components/legalPerson/Index')
const Create = () => import('~organization/components/legalPerson/Create')
const Details = () => import('~organization/components/legalPerson/Details')
const History = () => import('~organization/components/legalPerson/History')

const routes = [
  {
    name: 'legal-person-index',
    path: '/legalperson',
    component: Index,
    meta: { permission: '1010003,1010004' },
  },
  {
    name: 'legal-person-create',
    path: '/legalperson/create/:id?',
    component: Create,
    meta: { permission: '1010003' },
  },
  {
    name: 'legal-person-details',
    path: '/legalperson/details/:id',
    component: Details,
    meta: { permission: '1010003,1010004' },
  },
  {
    name: 'legal-person-history',
    path: '/legalperson/history/:id',
    component: History,
    meta: { permission: '1010003,1010004' },
  },
]
export default routes
