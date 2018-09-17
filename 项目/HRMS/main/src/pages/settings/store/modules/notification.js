import * as types from '../mutationTypes'
import api from '../../api'

const utils = window.Lib.utils.default
const state = {
  badge: 0,
}

const actions = {
  getNotificationBadge({ commit }) {
    return utils.axios
      .get(api.settings.notification.badge, { showProgressBar: false })
      .then(({ data }) => {
        commit(types.GET_NOTIFICATION_BADGE, { badge: data.count })
      })
  },
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.GET_NOTIFICATION_BADGE](state, { badge }) {
    state.badge = badge
  },
}

export default {
  state,
  actions,
  mutations,
}
