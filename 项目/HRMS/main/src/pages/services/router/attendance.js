import Index from '../components/attendance/Index'
import Approved from '../components/attendance/Approved'
import Approving from '../components/attendance/Approving'
import Application from '../components/attendance/Application'

import CreateAskForLeave from '../components/attendance/create/AskForLeave'
import CreateAwayForBusiness from '../components/attendance/create/AwayForBusiness'
import CreateBusinessTravel from '../components/attendance/create/BusinessTravel'
import CreatePunchCardCompaint from '../components/attendance/create/PunchCardCompaint'
import CreatePunchCardMethod from '../components/attendance/create/PunchCardMethod'
import CreateGroupReport from '../components/attendance/create/GroupReport'

import ApplicationPunchCardMethod from '../components/attendance/application/PunchCardMethod'
import ApplicationBusinessTravel from '../components/attendance/application/BusinessTravel'
import ApplicationPunchCardCompaint from '../components/attendance/application/PunchCardCompaint'
import ApplicationAwayForBusiness from '../components/attendance/application/AwayForBusiness'
import ApplicationAskForLeave from '../components/attendance/application/AskForLeave'
import ApplicationGroupReport from '../components/attendance/application/GroupReport'

import ApprovingPunchCardMethod from '../components/attendance/approving/PunchCardMethod'
import ApprovingBusinessTravel from '../components/attendance/approving/BusinessTravel'
import ApprovingPunchCardCompaint from '../components/attendance/approving/PunchCardCompaint'
import ApprovingAwayForBusiness from '../components/attendance/approving/AwayForBusiness'
import ApprovingAskForLeave from '../components/attendance/approving/AskForLeave'
import ApprovingGroupReport from '../components/attendance/approving/GroupReport'

import ApprovedPunchCardMethod from '../components/attendance/approved/PunchCardMethod'
import ApprovedBusinessTravel from '../components/attendance/approved/BusinessTravel'
import ApprovedPunchCardCompaint from '../components/attendance/approved/PunchCardCompaint'
import ApprovedAwayForBusiness from '../components/attendance/approved/AwayForBusiness'
import ApprovedAskForLeave from '../components/attendance/approved/AskForLeave'
import ApprovedGroupReport from '../components/attendance/approved/GroupReport'

export default [
  {
    path: '/attendance',
    name: 'attendance',
    component: Index,
  },
  {
    path: '/attendance/application',
    name: 'attendanceApplication',
    component: Application,
  },
  // -------------create---------------
  {
    path: '/attendance/create/ask-for-leave/:code/:id?',
    name: 'CreateAskForLeave',
    component: CreateAskForLeave,
  },
  {
    path: '/attendance/create/away-for-business/:code/:id?',
    name: 'CreateAwayForBusiness',
    component: CreateAwayForBusiness,
  },
  {
    path: '/attendance/create/business-travel/:code/:id?',
    name: 'CreateBusinessTravel',
    component: CreateBusinessTravel,
  },
  {
    path: '/attendance/create/punch-card-compaint/:code/:id?',
    name: 'CreatePunchCardCompaint',
    component: CreatePunchCardCompaint,
  },
  {
    path: '/attendance/create/punch-card-method/:code/:id?',
    name: 'CreatePunchCardMethod',
    component: CreatePunchCardMethod,
  },
  {
    path: '/attendance/create/group-report/:code/:id?',
    name: 'CreateGroupReport',
    component: CreateGroupReport,
  },
  // -------------application---------------
  {
    path: '/attendance/application/punch-card-method/:code/:id',
    name: 'ApplicationPunchCardMethod',
    component: ApplicationPunchCardMethod,
  },
  {
    path: '/attendance/application/business-travel/:code/:id',
    name: 'ApplicationBusinessTravel',
    component: ApplicationBusinessTravel,
  },
  {
    path: '/attendance/application/punch-card-compaint/:code/:id',
    name: 'ApplicationPunchCardCompaint',
    component: ApplicationPunchCardCompaint,
  },
  {
    path: '/attendance/application/away-for-business/:code/:id',
    name: 'ApplicationAwayForBusiness',
    component: ApplicationAwayForBusiness,
  },
  {
    path: '/attendance/application/ask-for-leave/:code/:id',
    name: 'ApplicationAskForLeave',
    component: ApplicationAskForLeave,
  },
  {
    path: '/attendance/application/group-report/:code/:id',
    name: 'ApplicationGroupReport',
    component: ApplicationGroupReport,
  },
  // ------------approving----------------
  {
    path: '/attendance/approving',
    name: 'attendanceApproving',
    component: Approving,
  },
  {
    path: '/attendance/approving/punch-card-method/:code/:id',
    name: 'ApprovingPunchCardMethod',
    component: ApprovingPunchCardMethod,
  },
  {
    path: '/attendance/approving/business-travel/:code/:id',
    name: 'ApprovingBusinessTravel',
    component: ApprovingBusinessTravel,
  },
  {
    path: '/attendance/approving/punch-card-compaint/:code/:id',
    name: 'ApprovingPunchCardCompaint',
    component: ApprovingPunchCardCompaint,
  },
  {
    path: '/attendance/approving/away-for-business/:code/:id',
    name: 'ApprovingAwayForBusiness',
    component: ApprovingAwayForBusiness,
  },
  {
    path: '/attendance/approving/ask-for-leave/:code/:id',
    name: 'ApprovingAskForLeave',
    component: ApprovingAskForLeave,
  },
  {
    path: '/attendance/approving/group-report/:code/:id',
    name: 'ApprovingGroupReport',
    component: ApprovingGroupReport,
  },
  // ------------approved----------------
  {
    path: '/attendance/approved',
    name: 'attendanceApproved',
    component: Approved,
  },
  {
    path: '/attendance/approved/punch-card-method/:code/:id',
    name: 'ApprovedPunchCardMethod',
    component: ApprovedPunchCardMethod,
  },
  {
    path: '/attendance/approved/business-travel/:code/:id',
    name: 'ApprovedBusinessTravel',
    component: ApprovedBusinessTravel,
  },
  {
    path: '/attendance/approved/punch-card-compaint/:code/:id',
    name: 'ApprovedPunchCardCompaint',
    component: ApprovedPunchCardCompaint,
  },
  {
    path: '/attendance/approved/away-for-business/:code/:id',
    name: 'ApprovedAwayForBusiness',
    component: ApprovedAwayForBusiness,
  },
  {
    path: '/attendance/approved/ask-for-leave/:code/:id',
    name: 'ApprovedAskForLeave',
    component: ApprovedAskForLeave,
  },
  {
    path: '/attendance/approved/group-report/:code/:id',
    name: 'ApprovedGroupReport',
    component: ApprovedGroupReport,
  },
]
