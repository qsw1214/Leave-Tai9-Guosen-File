import * as types from './mutation-types'

export const showDialog = ({ commit }, obj) => {
  commit(types.SHOW_DIALOG, obj)
}

export const hideDialog = ({commit}) => {
  commit(types.HIDE_DIALOG)
}
