import * as types from '../mutationTypes'

const state = {
  // 分享列表
  listShare: [],
}

const actions = {
  updateBooksShareList({ commit }, data) {
    commit(types.books.updateListShare, data)
  },
}

const mutations = {
  /* eslint no-shadow: 0 */
  [types.books.updateListShare](state, data) {
    state.listShare = data
  },
}

export default {
  state,
  mutations,
  actions,
}
