/**
 * A Organization selected component.
 * Created on 2017/10/30
 * @module
 * @author Yangleilei
 */

import * as types from '../mutationTypes'

const state = {
  ids: [],
}

const actions = {
  updateIds({ commit }, { ids }) {
    commit(types.EMPLOYEE_UPDATE_ID, ids)
  },
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.EMPLOYEE_UPDATE_ID](state, ids) {
    state.ids = ids
  },
}

const getters = {
  /* eslint no-shadow:0 */
  getEmployeeIds: state => state.ids,
}

export default {
  state,
  actions,
  getters,
  mutations,
}
