import Vue from 'vue'

/* eslint no-shadow:0 */
const state = {
  list: [],
  loading: false,
}

const getters = {
  get: state => state.list,
}

const mutations = {
  update(state, list) {
    state.list = list
  },
  loading(state, type) {
    state.loading = type
  },
}

const actions = {
  get({ commit, getters, state }) {
    if (state.loading) {
      return Promise.resolve()
    }
    if (state.list.length) {
      return Promise.resolve(getters.get)
    }
    commit('loading', true)
    const { $axios, $api, $message } = Vue.prototype
    return $axios.get($api.settings.role.authList)
      .then(({ data: { list } }) => {
        commit('update', list)
        return getters.get
      })
      .catch((err) => {
        $message({
          message: err.message || `${err.code}，${err.msg}`,
          type: 'error',
        })
      })
      .then((list) => {
        commit('loading', false)
        return list || null
      })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
