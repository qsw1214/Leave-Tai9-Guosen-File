import Vuex from 'vuex'
import services from './modules/services'
import attendance from './modules/attendance'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    services,
    attendance,
  },
  strict: debug,
})
