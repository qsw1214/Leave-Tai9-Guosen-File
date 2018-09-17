import * as mutationTypes from '../mutationTypes'

const mutations = {
  // 设置列表显示数据
  [mutationTypes.process.updateSettingList](state, value) {
    state.settingList = value
  },
  // 更新设置列表选中查看项目
  [mutationTypes.process.updateSettingCurrent](state, value) {
    state.settingCurrent = value
  },
}

const state = {
  settingList: [],
  settingCurrent: null,
}

export default {
  mutations,
  state,
}
