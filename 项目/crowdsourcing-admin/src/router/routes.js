/**
 * Created by Yangleilei on 17/04/20
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from 'components/common/Login.vue'
import NotFound from 'components/common/404'
import Home from 'components/Home'
import ExcelUploader from 'components/uploader'
import RenameHowBuy from 'components/uploader/RenameHowBuy.vue'
import RenamePaiPai from 'components/uploader/RenamePaiPai.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    hidden: true,
    alias: '/'
  },
  {
    path: '/',
    component: Home,
    name: '数据配置',
    // hidden: true,
    // 图标样式class
    iconCls: 'fa fa-cogs',
    children: [
      {path: '/uploader/excel_uploader', component: ExcelUploader, name: 'Excel上传'},
      {path: '/uploader/rename_paipai', component: RenamePaiPai, name: '排排网机构简称填写'},
      {path: '/uploader/rename_howbuy', component: RenameHowBuy, name: '好买网机构简称填写'}
    ]
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]
const router = new VueRouter({
  routes
})

// 预留做为全局拦截处理
router.beforeEach((to, from, next) => {
  next()
})

export default router
