/**
 * The store of matian page.
 * Created on 2017/9/12
 * @module
 * @author Yangleilei
 */
/* eslint no-shadow: 0 */
import * as types from '../mutationTypes'

const state = {
  ids: [],
}

const actions = {
  updateIds({ commit }, { ids }) {
    commit(types.MAINTIAN_UPDATE_ID, ids)
  },
}

const mutations = {
  [types.MAINTIAN_UPDATE_ID](state, ids) {
    state.ids = ids
  },
}

const getters = {
  getMaintianIds: state => state.ids,
}

export default {
  state,
  actions,
  getters,
  mutations,
}
