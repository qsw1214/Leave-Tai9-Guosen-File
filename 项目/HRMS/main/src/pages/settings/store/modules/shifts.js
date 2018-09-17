import * as types from '../mutationTypes'

const state = {
  ids: [],
}

const actions = {
  // 更新当前查询方案
  updateShiftsIds({ commit }, { ids }) {
    commit(types.SHIFTS_UPDATE_ID, { ids })
  },
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.SHIFTS_UPDATE_ID](state, { ids }) {
    state.ids = ids
  },
}

const getters = {
  /* eslint no-shadow:0 */
  getShiftsIds: state => state.ids,
}

export default {
  state,
  actions,
  getters,
  mutations,
}
