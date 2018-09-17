/**
 * 客户数据
 */
import * as types from '../mutation-types'
import Vue from 'vue'

// initial state
const state = {
  // 全部列表
  list: null,
  // 根据条件筛选列表
  filterList: null,
  // 主题
  topic: [],
  // 基本信息
  overview: null,
  // tabs
  tabs: [],
  // 当前topic是否展开
  showTopic: false,
  // 详细信息
  details: null,
  // 当前用户id
  customerID: null,
  // 工商、基协信息
  baseinfo: null,
  // 当前试图模式
  isPreview: false
}

// actions
const actions = {
  // 获取用户大纲信息
  getOverviewById ({ commit }, { customerID, uid }) {
    let data = {}
    if (uid) data.uid = uid
    if (customerID) data.customerID = customerID
    // 发起异步请求
    return Vue.http.post('/record/recordHead', data).then((response) => {
      let res = response.body
      if (res.code === 0) {
        let data = res.data
        // 全部数据
        let overview = res.data
        let id = data.local.id
        commit(types.CLINET_OVERVIEW, { overview })
        commit(types.CLINET_TABS, { id })
      }
    })
  },
  // 获取跟进列表
  fetchClientList ({ commit, dispatch }, { customerID, uid }) {
    let data = {}
    if (uid) data.uid = uid
    if (customerID) data.customerID = customerID
    // 发起异步请求
    return Vue.http.post('/record/recordDetail', data).then((response) => {
      let res = response.body
      if (res.code === 0) {
        let data = res.data
        // 基本列表
        let list = data.record_detail
        // 主题
        let topic = data.theme_list.map((item) => {
          return {
            id: item.id,
            name: item.name,
            choose: false
          }
        })
        commit(types.CLINET_LIST, { list })
        commit(types.CLINET_TOPIC, { topic })
        dispatch('hideLoader')
      }
    })
  },
  // 开关主题
  toggle ({ commit }) {
    commit(types.TOGGLE_TOPIC)
  },
  // 选择一个主题
  pickTopic ({ commit }, topic) {
    commit(types.PICK_TOPIC, { topic })
    commit(types.UPDATE_LIST)
  },
  // 获取客户详细信息
  getDetails ({ commit, dispatch }, {local, customerID}) {
    // 发起异步请求
    return Vue.http.post('/customer/detailRecord', {local, customerID}).then((response) => {
      let res = response.body
      if (res.code === 0) {
        let info = res.data
        commit(types.GET_DETAILS, { info })
        dispatch('hideLoader')
      }
    })
  },
  // 存储用户customerID
  saveCustomerID ({ commit }, customerID) {
    commit(types.SAVE_CUSTOMERID, customerID)
  },
  // 获取工商信息或者基协信息
  fetchBaseinfo ({ commit, dispatch }, {basicsId, local}) {
    // 发起异步请求
    return Vue.http.post('/customer/entMessage', {basics_id: basicsId, local: local}).then((response) => {
      let res = response.body
      if (res.code === 0) {
        let baseinfo = res.data
        commit(types.GET_BASE_INFO, { baseinfo })
        dispatch('hideLoader')
      }
    })
  },
  // 是否app填写需求时候跳转过H5
  isPreview ({ commit }) {
    commit(types.SET_PREVIEW)
  },
  // 清空client里面tab标签的数据
  clearClient ({ commit }) {
    commit(types.CLEAR_CLIENT)
  }
}

// mutations
const mutations = {
  // 设置客户Overview
  [types.CLINET_OVERVIEW] (state, { overview }) {
    state.overview = overview
  },
  // 设置客户列表
  [types.CLINET_LIST] (state, { list }) {
    state.list = [...list]
    state.filterList = [...list]
  },
  // 设置客户主题
  [types.CLINET_TOPIC] (state, { topic }) {
    state.topic = topic
  },
  // 初始化tab
  [types.CLINET_TABS] (state, { id }) {
    let commonTab = {
      path: '/client/followrecord',
      name: '跟进记录'
    }
    let otherTab = []
    switch (id) {
      // 企业客户
      case '10000':
        otherTab = [
          {
            path: '/client/details',
            name: '详细情况'
          },
          {
            path: '/client/baseinfo',
            name: '工商信息'
          }
        ]
        break
      // 企业机构
      case '10001':
        otherTab = [
          {
            path: '/client/details',
            name: '详细情况',
            current: false
          }
        ]
        break
      // 私募
      case '10002':
        otherTab = [
          {
            path: '/client/details',
            name: '详细情况'
          },
          {
            path: '/client/baseinfo',
            name: '基协信息'
          }
        ]
        break
      // 私募机构
      case '10003':
        otherTab = [
          {
            path: '/client/details',
            name: '详细情况'
          }
        ]
        break
      // 个人
      case '10004':
        otherTab = [
          {
            path: '/client/details',
            name: '详细情况'
          },
          {
            path: '/client/baseinfo',
            name: '工商信息'
          }
        ]
        break
    }
    state.tabs = state.isPreview ? [...otherTab] : [commonTab, ...otherTab]
  },
  // 设置主题的收起和隐藏
  [types.TOGGLE_TOPIC] (state) {
    state.showTopic = !state.showTopic
  },
  // 选择某个主题
  [types.PICK_TOPIC] (state, { topic }) {
    let number = state.topic.indexOf(topic)
    state.topic[number].choose = !state.topic[number].choose
  },
  // 获取用户详情
  [types.GET_DETAILS] (state, { info }) {
    state.details = info
  },
  // 保存customerID
  [types.SAVE_CUSTOMERID] (state, customerID) {
    state.customerID = customerID
  },
  // 依据筛选的主题更新展示列表
  [types.UPDATE_LIST] (state) {
    let temp = []
    state.topic.forEach((item) => {
      if (item.choose) {
        temp.push(item.name)
      }
    })
    if (temp.length === 0) {
      state.filterList = [...state.list]
    } else {
      let tempArr = []
      state.list.forEach((item) => {
        // 判断是否为theme数组
        if (Array.isArray(item.theme)) {
          for (let i = 0; i < item.theme.length; i++) {
            if (temp.indexOf(item.theme[i]) !== -1) {
              tempArr.push(item)
              break
            }
          }
        }
      })
      state.filterList = tempArr
    }
  },
  // 清空客户信息
  [types.CLEAR_CLIENT] () {
    state.details = null
    state.overview = null
    state.baseinfo = null
    state.list = null
    state.filterList = null
    state.showTopic = false
    state.topic = []
  },
  // 获取工商信息或者基协信息
  [types.GET_BASE_INFO] (state, { baseinfo }) {
    state.baseinfo = baseinfo
  },
  // 设置当前页面为预览过来的页面
  [types.SET_PREVIEW] (state) {
    state.isPreview = true
  }
}

// getters
const getters = {
  getOverview: state => state.overview,
  getTabs: state => state.tabs,
  getCustomerId: state => state.customerID,
  getTopicState: state => state.showTopic,
  gettopicList: state => state.topic,
  getList: state => state.list,
  getFilterList: state => state.filterList,
  getDetails: state => state.details,
  getBaseinfo: state => state.baseinfo,
  getClientModel: state => state.overview.local.id
}

export default {
  state,
  actions,
  getters,
  mutations
}
