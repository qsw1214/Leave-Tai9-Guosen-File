/**
 * The store of position page.
 * Created on 2017/10/11
 * @module
 * @author Yangleilei
 */

import * as types from '../mutationTypes'

const state = {
  ids: [],
}

const actions = {
  updateIds({ commit }, { ids }) {
    commit(types.POSITION_UPDATE_ID, ids)
  },
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.POSITION_UPDATE_ID](state, ids) {
    state.ids = ids
  },
}

const getters = {
  /* eslint no-shadow:0 */
  getPositionIds: state => state.ids,
}

export default {
  state,
  actions,
  getters,
  mutations,
}
