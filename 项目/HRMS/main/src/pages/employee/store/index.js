import Vuex from 'vuex'
import employee from './modules/employee'
import casePage from './modules/case'
import Tabs from './modules/tabs'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    employee,
    casePage,
    toEntry: new Tabs('toEntry'),
    entry: new Tabs('entry'),
    transfer: new Tabs('transfer'),
    leave: new Tabs('leave'),
    becomeRegular: new Tabs('becomeRegular'),
  },
  strict: debug,
})
