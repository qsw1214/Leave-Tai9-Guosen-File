import flows from './flows'
import breadcrumb from './breadcrumb'
import processMixin from './process'
import router from './routerHook'
import routerQuery from './routerQuery'

import flowData from './flowData'
import flowMethods from './flowMethods'
import op from './op'
import tabs from './tabs'

const flow = {
  ...flowData,
  ...flowMethods,
}

export default {
  breadcrumb,
  flow,
  op,
  ...flows,
  ...processMixin,
  router,
  routerQuery,
  tabs,
}
