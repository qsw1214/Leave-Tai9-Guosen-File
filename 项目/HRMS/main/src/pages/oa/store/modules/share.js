import * as types from '../mutationTypes'

const state = {
  mineIds: [],
  warehouseIds: [],
}

const actions = {
  saveMineIds({ commit }, { ids }) {
    commit(types.SET_MINE_IDS, { ids })
  },

  saveWarehouseIds({ commit }, { ids }) {
    commit(types.SET_WAREHOUSE_IDS, { ids })
  },
}

const mutations = {
  /* eslint no-shadow: 0 */
  [types.SET_MINE_IDS](state, { ids }) {
    state.mineIds = ids
  },

  /* eslint no-shadow: 0 */
  [types.SET_WAREHOUSE_IDS](state, { ids }) {
    state.warehouseIds = ids
  },
}

export default {
  state,
  actions,
  mutations,
}
