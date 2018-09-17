import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import dialog from './modules/dialog'
import client from './modules/client'
import loader from './modules/loader'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions,
  getters,
  modules: {
    dialog,
    client,
    loader
  }
})

export default store

