import api from '../../api'

const utils = window.Lib.utils.default
const update_unread_message = (context, { type, ids, module }) => {
  let params = {}

  if (ids) {
    params = { type, ids, module }
  } else {
    params = { type, module }
  }

  return utils.axios.post(api.services.pa.updateTip, params, { showProgressBar: false })
}

export default {
  update_unread_message,
}
