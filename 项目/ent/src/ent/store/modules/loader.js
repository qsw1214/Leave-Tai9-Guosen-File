/**
 * 局部loader组件
 */
import * as types from '../mutation-types'

// initial state
const state = {
  // 默认为false
  status: true
}

// actions
const actions = {
  // 设置为转菊花
  setLoadding ({ commit }) {
    commit(types.SHOW_LOADER)
  },
  hideLoader ({ commit }) {
    commit(types.HIDE_LOADER)
  }
}

// mutations
const mutations = {
  // 设置客户Overview
  [types.SHOW_LOADER] (state) {
    state.status = true
  },
  [types.HIDE_LOADER] (state) {
    state.status = false
  }
}

// getters
const getters = {
  getLoaderStatus: state => state.status
}

export default {
  state,
  actions,
  getters,
  mutations
}
