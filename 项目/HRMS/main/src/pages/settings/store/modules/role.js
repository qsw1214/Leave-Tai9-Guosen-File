/**
 * A Role Store.
 * Created on 2017/11/30
 * @module
 * @author Yangleilei
 */
import * as types from '../mutationTypes'

const state = {
  ids: [],
}

const actions = {
  // 更新当前查询方案
  updateRoleIds({ commit }, { ids }) {
    commit(types.ROLE_UPDATE_ID, { ids })
  },
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.ROLE_UPDATE_ID](state, { ids }) {
    state.ids = ids
  },
}

const getters = {
  /* eslint no-shadow:0 */
  getRoleIds: state => state.ids,
}

export default {
  state,
  actions,
  getters,
  mutations,
}
