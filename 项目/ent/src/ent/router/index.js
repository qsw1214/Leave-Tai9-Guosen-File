import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 404 page
import NotFoundComponent from 'components/NotFoundComponent.vue'

// client page
import Client from 'components/Client'
import InputPerson from 'components/Client/InputPerson'
import FollowRecord from 'components/Client/subs/FollowRecord'
import Details from 'components/Client/subs/Details'
import BaseInfo from 'components/Client/subs/BaseInfo'
import FollowRecordDetails from 'components/Client/FollowRecordDetails'
import PageFinance from 'components/Client/subs/PageFinance'
import BaseinfoSubPage from 'components/Client/subs/Subpage'

export default new Router({
  // mode: 'history',
  routes: [
    { path: '/', component: Client },
    { path: '/client',
      component: Client,
      children: [
        {
          path: 'followrecord',
          component: FollowRecord
        },
        {
          path: 'details',
          component: Details
        },
        {
          path: 'baseinfo',
          component: BaseInfo
        }
      ]
    },
    { path: '/client/followrecord/picker', component: InputPerson },
    { path: '/client/followrecord/details', component: FollowRecordDetails },
    { path: '/client/details/finance', component: PageFinance },
    { path: '/client/baseinfo/:id', name: 'BaseinfoSub', component: BaseinfoSubPage },
    // { path: '/client/baseinfo/report', component: PageReport },
    // { path: '/client/baseinfo/shareholder', component: PageShareholder },
    // 404页面配置
    { path: '*', component: NotFoundComponent }
  ],

  scrollBehavior (to, from, savedPosition) {
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   return { x: 0, y: 0 }
    // }
    return false
  }
})
