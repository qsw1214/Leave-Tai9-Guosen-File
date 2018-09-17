import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'

import maintian from './modules/maintian'
import legalPerson from './modules/legalPerson'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    maintian,
    legalPerson,
  },
  strict: debug,
})
