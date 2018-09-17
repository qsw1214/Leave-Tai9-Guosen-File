/**
 * Modules 人力资源系统公共组件
 */

import MHeader from './modules/header'
import MSidebar from './modules/sidebar'
import MTable from './modules/table'
import MCascader from './modules/cascader'
import MEmployeeSelect from './modules/employeeSelect'
import MLegalEntitySelect from './modules/legalEntitySelect'
import MJobSelect from './modules/jobSelect'
import MPositionSelect from './modules/positionSelect'
import MImport from './modules/import'
import MProgress from './modules/progress'
import MDistrictSelect from './modules/districtSelect'
import MBreadcrumb from './modules/breadcrumb'
import MUserinfo from './modules/userinfo'
import MIcons from './modules/icons'
import MSection from './modules/section'
import MultipleSelect from './modules/multipleSelect'
import MImgCropper from './modules/imgCropper'
import MUpload from './modules/upload'
import MAttachment from './modules/attachment'
import MOrganzitionSelect from './modules/organzitionSelect'
import MAsyncEmployeeSelect from './modules/asyncEmployeeSelect'
import MAsyncEmployeeSelectedWithDialog from './modules/asyncEmployeeSelectedWithDialog'
import MTableTagMultiple from './modules/tableTagMultiple'
import MTeamSelect from './modules/teamSelect'

import './assets/common.scss'

const Modules = {
  MHeader,
  MSidebar,
  MTable,
  MCascader,
  MEmployeeSelect,
  MLegalEntitySelect,
  MJobSelect,
  MPositionSelect,
  MImport,
  MProgress,
  MDistrictSelect,
  MBreadcrumb,
  MUserinfo,
  ...MIcons,
  ...MSection,
  MultipleSelect,
  MImgCropper,
  MUpload,
  MAttachment,
  MOrganzitionSelect,
  MAsyncEmployeeSelect,
  MAsyncEmployeeSelectedWithDialog,
  ...MTableTagMultiple,
  MTeamSelect,
}

const install = (Vue) => {
  Object.keys(Modules).forEach((key) => {
    Vue.component(key, Modules[key])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Object.assign(Modules, { install })
