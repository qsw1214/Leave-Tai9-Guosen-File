import Meeting from '../components/meeting/Index'
import MeetingCheck from '../components/meeting/CheckRoom'
import MeetingEdit from '../components/meeting/BookRoom'
import MeetingDetail from '../components/meeting/BookDetail'

export default [
  {
    path: '/meeting',
    name: 'MeetingIndex',
    component: Meeting,
  },
  {
    path: '/meeting/check',
    name: 'MeetingCheck',
    component: MeetingCheck,
  },
  {
    path: '/meeting/book/:id?',
    name: 'MeetingEdit',
    component: MeetingEdit,
  },
  {
    path: '/meeting/book-detail/:id',
    name: 'MeetingDetail',
    component: MeetingDetail,
  },
]
