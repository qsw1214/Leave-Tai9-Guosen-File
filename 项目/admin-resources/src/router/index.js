import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

// 用户管理模块
import AllUser from '@/components/User/AllUser'
import UnCheckUser from '@/components/User/UnCheckUser'
// 项目资源管理
import Project from '@/components/Project'
import ProjectDetail from '@/components/Project/Detail'
// 反馈管理
import FeedBack from '@/components/FeedBack'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      alias: '/',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      // 图标样式class
      iconCls: 'fa fa-users',
      children: [
        { path: '/all-user', component: AllUser, name: '所有用户' },
        { path: '/uncheck-user', component: UnCheckUser, name: '未审核用户' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '项目资源',
      // 图标样式class
      iconCls: 'fa fa-rocket',
      children: [
        { path: '/project', component: Project, name: '项目资源管理' },
        { path: '/project/:id', component: ProjectDetail, name: '项目详情', hidden: true }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '其它',
      // 图标样式class
      iconCls: 'fa fa-code-fork',
      children: [
        { path: '/feedback', component: FeedBack, name: '反馈管理' }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('token')
  }
  // let token = sessionStorage.getItem('token')
  // if (!token && to.path !== '/login') {
  //   next({ path: '/login' })
  // } else {
  //   next()
  // }
  next()
})

export default router
