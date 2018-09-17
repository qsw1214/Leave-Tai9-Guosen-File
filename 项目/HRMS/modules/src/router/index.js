import Vue from 'vue'
import VueRouter from 'vue-router'

import Sidebar from '@/components/Sidebar'
import Axios from '@/components/Axios'
import Element from '@/components/Element'
import Table from '@/components/Table'
import MImport from '@/components/Import'
import Progress from '@/components/Progress'
import Breadcrumb from '@/components/Breadcrumb'
import Muserinfo from '@/components/MUserinfo'
import Icons from '@/components/Icons'
import Section from '@/components/Section'
import ImgCropper from '@/components/ImgCropper'
import OrgSelected from '@/components/OrganzitionSelect'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/sidebar',
      name: 'Sidebar',
      component: Sidebar,
    },
    {
      path: '/axios',
      name: 'Axios',
      component: Axios,
    },
    {
      path: '/element',
      name: 'Element',
      component: Element,
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
    },
    {
      path: '/import',
      name: 'MouduleImport',
      component: MImport,
    },
    {
      path: '/progress',
      name: 'MProgress',
      component: Progress,
    },
    {
      path: '/breadcrumb',
      name: 'Breadcrumb',
      component: Breadcrumb,
    },
    {
      path: '/userinfo',
      name: 'Muserinfo',
      component: Muserinfo,
    },
    {
      path: '/icons',
      name: 'Icons',
      component: Icons,
    },
    {
      path: '/section',
      name: 'Section',
      component: Section,
    },
    {
      path: '/img-cropper',
      name: 'ImgCropper',
      component: ImgCropper,
    },
    {
      path: '/org-select',
      name: 'OrgSelected',
      component: OrgSelected,
    },
  ],
})
