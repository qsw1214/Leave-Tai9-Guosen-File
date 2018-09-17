import * as types from '../mutation-types'

// initial state
const state = {
  show: false,
  cancleText: '取消',
  confirmText: '确认',
  hasCloseBtn: false
}

// mutations
const mutations = {
  [types.SHOW_DIALOG] (state, obj) {
    Object.assign(state, obj)
  },
  [types.HIDE_DIALOG] (state, obj) {
    this.show = false
  }
}

export default {
  state,
  mutations
}
