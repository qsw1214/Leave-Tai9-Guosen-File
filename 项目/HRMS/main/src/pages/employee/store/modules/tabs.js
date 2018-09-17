import * as types from '../mutationTypes'
import api from '../../api'

const utils = window.Lib.utils.default

// tabs config
const tabs = {
  entry: [
    {
      label: '已发起的',
      name: 'EntryApplication',
      permission: '1030005',
    },
    {
      label: '待我审批',
      name: 'EntryApproving',
      permission: '1030005,1030006',
      badgeNumber: 0,
    },
    {
      label: '我已审批',
      name: 'EntryApproved',
      permission: '1030005,1030006',
    },
  ],
  toEntry: [
    {
      label: '已发起的',
      name: 'ToEntryApplication',
      permission: '1030003',
    },
    {
      label: '待我审批',
      name: 'ToEntryApproving',
      permission: '1030003,1030004',
      badgeNumber: 0,
    },
    {
      label: '我已审批',
      name: 'ToEntryApproved',
      permission: '1030003,1030004',
    },
  ],
  transfer: [
    { label: '已发起的', name: 'TransferApplication', permission: '1030009' },
    { label: '待我审批', name: 'TransferApproving', permission: '1030009,1030010', badgeNumber: 0 },
    { label: '我已审批', name: 'TransferApproved', permission: '1030009,1030010' },
  ],
  leave: [
    { label: '已发起的', name: 'LeaveApplication', permission: '1030007' },
    { label: '待我审批', name: 'LeaveApproving', permission: '1030007,1030008', badgeNumber: 0 },
    { label: '我已审批', name: 'LeaveApproved', permission: '1030007,1030008' },
  ],
  becomeRegular: [
    { label: '已发起的', name: 'BecomeRegularApplication', permission: '1030011' },
    { label: '待我审批', name: 'BecomeRegularApproving', permission: '1030011,1030012', badgeNumber: 0 },
    { label: '我已审批', name: 'BecomeRegularApproved', permission: '1030011,1030012' },
  ],
}

const upperName = (name) => {
  const upperName = name.split('')
  upperName[0] = upperName[0].toUpperCase()
  return upperName.join('')
}

export default class Tabs {
  constructor(name) {
    this.state = { tabs: tabs[name] }
    this.getActions(name)
    this.getMutations(name)
  }

  getActions(name) {
    this.actions = {
      [`fetch${upperName(name)}TabsBadge`]({ commit }) {
        utils.axios
          .post(api.employee.flow.tip, {}, { showProgressBar: false })
          .then(({ data }) => {
            let nameMap
            switch (name) {
            case 'transfer':
              nameMap = 'dd'
              break
            case 'toEntry':
              nameMap = 'drz'
              break
            case 'entry':
              nameMap = 'rz'
              break
            case 'leave':
              nameMap = 'lz'
              break
            case 'becomeRegular':
              nameMap = 'zz'
              break
            default:
              break
            }

            const approvingNumber = data[`flow_rldz_${nameMap}_approvaler`].count

            commit(types[`UPDATE_${name.toUpperCase()}_TABS_BADGE`], { approvingNumber })
          })
      },

      [`update${upperName(name)}TabsBadge`](context, { type, ids }) {
        let params = { }
        if (ids) {
          params = { type, ids }
        } else {
          params = { type }
        }
        return utils.axios.post(api.employee.updateTip, params, { showProgressBar: false })
      },
    }
  }

  getMutations(name) {
    this.mutations = {
      /* eslint no-shadow:0 */
      [types[`UPDATE_${name.toUpperCase()}_TABS_BADGE`]](state, { approvingNumber }) {
        if (typeof approvingNumber !== 'undefined') {
          this.state[name].tabs[1].badgeNumber = approvingNumber
        }
      },
    }
  }
}
