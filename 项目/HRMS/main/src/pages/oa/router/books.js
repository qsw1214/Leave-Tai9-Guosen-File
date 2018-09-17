import Index from '../components/books/Index'
import Create from '../components/books/Create'
import Details from '../components/books/Details'

export default [
  {
    path: '/books/list/:tab?',
    name: 'BookIndex',
    component: Index,
    meta: { permission: '1070003,1070004' },
  },
  {
    path: '/books/create/:id?',
    name: 'BookCreate',
    component: Create,
    meta: { permission: '1070004' },
  },
  {
    path: '/books/details/:id',
    name: 'BookDetails',
    component: Details,
    meta: { permission: '1070004' },
  },
]
