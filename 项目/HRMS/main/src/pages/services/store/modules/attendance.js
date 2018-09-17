import api from '../../api'
import * as types from '../mutationTypes'
import commonActions from './commonActions'

const utils = window.Lib.utils.default
const state = {
  tabs: [
    {
      label: '流程发起',
      name: 'attendance',
      permission: '1060001',
    },
    {
      label: '待我审批',
      name: 'attendanceApproving',
      permission: '1060001',
      badge: 0,
    },
    {
      label: '我已审批',
      name: 'attendanceApproved',
      permission: '1060001',
    },
    {
      label: '已发起的',
      name: 'attendanceApplication',
      permission: '1060001',
      badge: 0,
    },
  ],
}

const actions = {
  fetchAttendanceTabsBadge({ commit }) {
    utils.axios
      .post(api.services.pa.tip, {}, { showProgressBar: false })
      .then(({ data }) => {
        const { flow_kq_applier, flow_kq_approvaler } = data
        const approvingNum = Number(flow_kq_approvaler.count)
        const applicationNum = Number(flow_kq_applier.count)

        commit('FETCH_ATTENDANCE_BADGE', { approvingNum, applicationNum })
      })
  },
  ...commonActions,
}

const mutations = {
  /* eslint no-shadow: 0 */
  [types.FETCH_ATTENDANCE_BADGE](state, { approvingNum, applicationNum }) {
    state.tabs[1].badge = Number(approvingNum)
    state.tabs[3].badge = Number(applicationNum)
  },
}

export default {
  state,
  actions,
  mutations,
}
