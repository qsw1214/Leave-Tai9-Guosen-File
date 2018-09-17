import Vuex from 'vuex'
import permission from './modules/permission'
import role from './modules/role'
import processManage from './modules/process'
import notification from './modules/notification'
import shifts from './modules/shifts'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    permission,
    role,
    process: processManage,
    notification,
    shifts,
  },
  strict: debug,
})
