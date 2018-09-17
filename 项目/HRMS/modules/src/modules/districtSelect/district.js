import Vue from 'vue'

/* eslint no-shadow:0 */
function state() {
  return {
    list: [],
    loading: false,
    modulesCount: 0,
    queue: [],
  }
}

const getters = {
  get: state => state.list,
  isLoading: state => state.isLoading,
  modulesCount: state => state.modulesCount,
}

const mutations = {
  update(state, list) {
    state.list = list
  },
  loading(state, type) {
    state.loading = type
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
  waited(state) {
    state.queue = []
  },
}


const makeValue = (item) => {
  // 兼容选择器字段
  item.value = item.code
  item.label = item.name
  if (item.children && !item.children.length) delete item.children
  if (!item.children) return false
  // 递归便利所有子列表
  return item.children.every((value) => {
    makeValue(value)
    return true
  })
}

const actions = {
  get({ commit, getters, state }) {
    if (state.loading) {
      return new Promise((resolve) => {
        const queueItem = function* queueItem() {
          yield
          resolve(getters.get)
        }
        const isWait = queueItem()
        isWait.next()
        commit('waiting', isWait)
      })
    }
    if (state.list.length) {
      return Promise.resolve(getters.get)
    }
    commit('loading', true)
    const { $axios, $api, $message } = Vue.prototype
    return $axios.get($api.common.districtList)
      .then(({ data: { list } }) => {
        list.forEach(makeValue)
        commit('update', list)
        state.queue.forEach(item => item.next())
        commit('waited')
        commit('loading', false)
        return getters.get
      })
      .catch((err) => {
        commit('loading', false)
        // 非渲染错误接口已处理
        if (err.constructor !== Error) return []
        $message({
          message: err.message || `${err.code}，${err.msg}`,
          type: 'error',
        })
        console.dir(err)
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
