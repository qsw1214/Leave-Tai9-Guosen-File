import * as mutationTypes from '../mutationTypes'

const mutations = {
  // 更新法人列表数据
  [mutationTypes.legalPerson.updateList](state, value) {
    state.list = value
  },
  // 更新当前选中的法人信息
  [mutationTypes.legalPerson.updateCurrent](state, value) {
    state.current = value
  },
}

const state = {
  // 法人列表数据
  list: [],
  // 选中跳转法人设置信息，只用于数据传送，几个页面都有update，不能watch监听
  current: null,
}

export default {
  mutations,
  state,
}
