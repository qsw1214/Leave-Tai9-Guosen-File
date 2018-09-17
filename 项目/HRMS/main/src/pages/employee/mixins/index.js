import flows from './flows'
import routerHook from './routerHook'
import routerQuery from './routerQuery'
import breadcrumb from './breadcrumb'

import flowData from './flowData'
import flowMethods from './flowMethods'

import tabs from './tabs'
import formType from './formType'

const flow = {
  ...flowData,
  ...flowMethods,
}

export default {
  flow,
  ...flows,
  routerHook,
  routerQuery,
  tabs,
  breadcrumb,
  formType,
}
