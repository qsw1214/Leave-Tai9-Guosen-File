/**
 * A Permisson Store.
 * Created on 2017/12/15
 * @module
 * @author Yangleilei
 */
import modulesMapping from '@/components/flowMap'
import commonActions from './commonActions'
import * as types from '../mutationTypes'
import api from '../../api'

const utils = window.Lib.utils.default
const state = {
  ids: [],

  // 流程初始化数据
  initData: {},
  userinfo: {},
  districts: null,

  // 待处理未读信息
  approvingNumber: 0,
  applicationNumber: 0,
  // code对应莫模块
  modulesMapping,
}

const actions = {
  // 更新当前查询方案
  services_update_id({ commit }, { ids }) {
    commit(types.SERVICES_UPDATE_ID, { ids })
  },

  // 查询角标
  fetch_unread_message({ commit }) {
    return utils.axios.post(api.services.pa.tip, {}, { showProgressBar: false }).then((res) => {
      const { flow_approvaler, flow_applier } = res.data
      const approvingNumber = flow_approvaler.count
      const applicationNumber = flow_applier.count
      commit(types.SET_UNREAD_MESSAGE_UNM, { approvingNumber, applicationNumber })
    })
  },

  // 获取初始化信息
  get_initial_data({ commit, state }) {
    if (state.districts) return false

    return utils.axios
      .get(api.services.pa.init)
      .then((res) => {
        const {
          avatar_url,
          mobile,
          name,
          job_name,
          org_name,
          sex,
          emp_code,
          district,
        } = res.data

        commit(types.SET_INITIAL_DATA, {
          userinfo: {
            avatar_url, mobile, name, job_name, org_name, sex, emp_code,
          },
          districts: district,
          initData: res.data,
        })
      })
  },
  ...commonActions,
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.SERVICES_UPDATE_ID](state, { ids }) {
    state.ids = ids
  },
  [types.SET_UNREAD_MESSAGE_UNM](state, { approvingNumber, applicationNumber }) {
    if (typeof approvingNumber !== 'undefined') state.approvingNumber = approvingNumber
    if (typeof applicationNumber !== 'undefined') state.applicationNumber = applicationNumber
  },

  [types.SET_INITIAL_DATA](state, { userinfo, districts, initData }) {
    if (userinfo) state.userinfo = userinfo
    if (districts) state.districts = districts
    if (initData) state.initData = initData
  },
}

const getters = {
  /* eslint no-shadow:0 */
  getAssertIds: state => state.ids,
}

export default {
  state,
  actions,
  getters,
  mutations,
}
