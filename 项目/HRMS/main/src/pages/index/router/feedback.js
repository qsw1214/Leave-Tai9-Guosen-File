import Index from '../components/feedback/Index'
import Create from '../components/feedback/Create'
import Details from '../components/feedback/Details'

export default [
  // 建议反馈首页
  {
    path: '/feedback/list/:tab?',
    name: 'Feedback',
    component: Index,
  },
  {
    path: '/feedback/create/:id?',
    name: 'FeedbackCreate',
    component: Create,
  },
  {
    path: '/feedback/details/:id/:process?',
    name: 'FeedbackDetails',
    component: Details,
  },
]
