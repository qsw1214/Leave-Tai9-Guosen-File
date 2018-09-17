import Vue from 'vue'

/* eslint no-shadow:0 */
const state = {
  options: {},
  loading: false,
}

const getters = { get: state => state.options }

const mutations = {
  update(state, options) {
    state.options = options
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
    if (JSON.stringify(state.options) !== '{}') {
      return Promise.resolve(getters.get)
    }
    commit('loading', true)
    const { $axios, $api, $message } = Vue.prototype
    return $axios.get($api.common.dictionaryEmployee)
      .then(({ data: { array, object } }) => {
        const options = Object.assign({}, array, object)
        commit('update', options)
        commit('loading', false)
        return getters.get
      })
      .catch((err) => {
        commit('loading', false)
        $message({
          message: err.message || `${err.code}，${err.msg}`,
          type: 'error',
        })
        return []
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
