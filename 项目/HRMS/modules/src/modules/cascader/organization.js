/* eslint no-shadow:0 */
function state() {
  return {
    options: [],
    isLoading: false,
    isLoaded: false,
    modulesCount: 0,
    queue: [],
  }
}

const getters = {
  options: state => state.options,
  isLoading: state => state.isLoading,
  isLoaded: state => state.isLoaded,
  modulesCount: state => state.modulesCount,
}

const mutations = {
  options(state, options) {
    state.options = options
  },
  isLoading(state, status) {
    state.isLoading = status
  },
  isLoaded(state, status) {
    if (status) {
      state.queue.forEach(item => item.next())
      state.queue = []
    }
    state.isLoaded = status
  },
  modulesCountPlus(state) {
    state.modulesCount += 1
  },
  modulesCountMinus(state) {
    state.modulesCount -= 1
  },
  waiting(state, queueItem) {
    state.queue.push(queueItem)
  },
}

const actions = {
  options({ commit, getters, state }) {
    if (state.isLoading) {
      return new Promise((resolve) => {
        const queueItem = function* queueItem() {
          yield
          resolve(getters.options)
        }
        const isWait = queueItem()
        isWait.next()
        commit('waiting', isWait)
      })
    }

    return Promise.resolve(getters.options)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
