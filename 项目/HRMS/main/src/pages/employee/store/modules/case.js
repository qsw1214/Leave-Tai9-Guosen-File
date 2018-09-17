/**
 * A Case Store.
 * Created on 2017/10/30
 * @module
 * @author Yangleilei
 */
import * as types from '../mutationTypes'

const state = {
  currentCase: {
    id: '',
    name: '',
    detail: {
      condition: [],
      head: [],
    },
    status: '',
  },
  options: {
    condition: [],
    head: [],
  },
  // 临时操作的选择字段
  tempHead: [],
}

const actions = {
  // 更新当前查询方案
  setCurrentCase({ commit }, caseValue) {
    commit(types.SET_CURRENT_CASE, caseValue)
  },
  // 删除一个条件
  delOneCondition({ commit }, index) {
    commit(types.DEL_ONE_CONDITION, index)
  },
  // 新增一个条件
  addOneCondition({ commit }) {
    commit(types.ADD_ONE_CONDITION)
  },
  // 更新一个条件
  update_one_condition({ commit }, { index, condition }) {
    commit(types.UPDATE_ONE_CONDITION, { index, condition })
  },
  // 更新一个条件里面某个字段
  update_one_condition_field({ commit }, { index, field, fieldValue }) {
    commit(types.UPDATE_ONE_CONDITION_FIELD, { index, field, fieldValue })
  },
  // 出事话默认选中数据
  init_options({ commit }, { condition, head }) {
    commit(types.INIT_OPTIONS, { condition, head })
  },
  // 展开条件筛选项目
  toggle_condition_options({ commit }, { pos, field, fieldValue }) {
    commit(types.TOGGLE_CONDITION_OPTIONS, { pos, field, fieldValue })
  },
  // 选中某一项
  choose_condition_options({ commit }, { oldField, pos, index }) {
    commit(types.CHOOSE_CONDITION_OPTIONS, { oldField, pos, index })
  },
  // 展开条件筛选项目
  toggle_head_options({ commit }, { pos, field, fieldValue }) {
    commit(types.TOGGLE_HEAD_OPTIONS, { pos, field, fieldValue })
  },
  // 选择head某一项
  choose_head_options({ commit }, { bool, pos, index }) {
    commit(types.CHOOSE_HEAD_OPTIONS, { bool, pos, index })
  },
  // 反选head
  choose_sub_all_node({ commit }, { pos }) {
    commit(types.CHOOSE_SUB_ALL_NODE, { pos })
  },
  // 确认选中head
  confirm_choose_head({ commit }) {
    commit(types.CONFIRM_CHOOSE_HEAD)
  },
  // 移除选中内容
  remove_head_choose({ commit }, { tag }) {
    commit(types.REMOVE_HEAD_CHOOSE, { tag })
  },
  reset_temphead({ commit }) {
    commit(types.RESET_TEMPHEAD)
  },
}

const mutations = {
  /* eslint no-shadow:0 */
  [types.SET_CURRENT_CASE](state, caseValue) {
    state.currentCase = caseValue
  },
  [types.DEL_ONE_CONDITION](state, index) {
    state.currentCase.detail.condition.splice(index, 1)
  },
  [types.ADD_ONE_CONDITION](state) {
    state.currentCase.detail.condition.push({
      field: '',
      name: '',
      data_type: '',
      op_type: '',
      label: '',
      option: '',
      value: [],
      showDropMenu: false,
    })
  },
  [types.UPDATE_ONE_CONDITION](state, { index, condition }) {
    state.currentCase.detail.condition.splice(index, 1, condition)
  },
  [types.UPDATE_ONE_CONDITION_FIELD](state, { index, field, fieldValue }) {
    state.currentCase.detail.condition[index][field] = fieldValue
  },
  [types.INIT_OPTIONS](state, { condition, head }) {
    if (condition) state.options.condition = condition
    if (head) state.options.head = head
  },
  [types.TOGGLE_CONDITION_OPTIONS](state, { pos, field, fieldValue }) {
    state.options.condition[pos][field] = fieldValue
  },
  [types.TOGGLE_HEAD_OPTIONS](state, { pos, field, fieldValue }) {
    state.options.head[pos][field] = fieldValue
  },
  [types.CHOOSE_CONDITION_OPTIONS](state, { oldField, pos, index }) {
    state.options.condition.some((condition) => {
      const isFound = condition.sub.some((sub) => {
        if (sub.field === oldField) {
          sub.isChoose = false
          return true
        }
        return false
      })
      return isFound
    })
    state.options.condition[pos].sub[index].isChoose = true
  },
  [types.CHOOSE_HEAD_OPTIONS](state, { bool, pos, index }) {
    state.options.head[pos].sub[index].isChoose = bool
    const option = state.options.head[pos].sub[index]
    // 临时变量里面存一下
    const temp = {
      name: option.name,
      field: option.field,
      disable: option.name !== 'tu-name',
    }
    if (bool) {
      console.log(temp.name)
      state.tempHead.push(temp)
    } else {
      state.tempHead.splice(state.tempHead.indexOf(temp), 1)
    }
  },
  [types.CHOOSE_SUB_ALL_NODE](state, { pos }) {
    state.options.head[pos].sub.forEach((sub) => {
      sub.isChoose = !sub.isChoose
      const temp = {
        name: sub.name,
        field: sub.field,
        disable: sub.name !== 'tu-name',
      }
      if (sub.isChoose && sub.isVisible) {
        state.tempHead.push(temp)
      } else {
        /* eslint no-lonely-if: 0 */
        if (sub.isVisible) state.tempHead.splice(state.tempHead.indexOf(temp), 1)
      }
    })
    console.dir(state.tempHead)
  },
  [types.CONFIRM_CHOOSE_HEAD](state) {
    // 操作数据选中
    state.options.head.forEach((head) => {
      head.sub.forEach((sub) => {
        if (sub.isChoose) {
          sub.isVisible = false
        }
      })
    })
    // 暂存推向currentCase
    state.currentCase.detail.head = state.currentCase.detail.head.concat(state.tempHead)
    // 重置为空
    state.tempHead = []
  },
  [types.REMOVE_HEAD_CHOOSE](state, { tag }) {
    const { field } = tag
    state.options.head.some((head) => {
      const isFound = head.sub.some((sub) => {
        if (sub.field === field) {
          sub.isChoose = false
          sub.isVisible = true
          return true
        }
        return false
      })
      return isFound
    })
    state.currentCase.detail.head.splice(state.currentCase.detail.head.indexOf(tag), 1)
  },
  [types.RESET_TEMPHEAD](state) {
    state.tempHead = []
  },
}

const getters = {
  /* eslint no-shadow:0 */
  getCurrentCase: state => state.currentCase,
  getConditionByIndex: state => index => state.currentCase.detail.condition[index],
  getConditionOptions: state => state.options.condition,
  getHeadOptions: state => state.options.head,
  searchOptions(state) {
    return (keyword) => {
      if (keyword) {
        keyword.trim()
        const tempArr = []
        state.options.head.forEach((head, pos) => {
          const temp = {}
          temp.pos = pos
          temp.name = head.name
          temp.sub = []
          temp.hasKeyword = false
          head.sub.forEach((sub, index) => {
            if (sub.name.indexOf(keyword) !== -1 && sub.isVisible) {
              temp.hasKeyword = true
              const item = Object.assign({}, sub, { index, pos })
              temp.sub.push(item)
            }
          })
          tempArr.push(temp)
        })
        return tempArr
      }
      return []
    }
  },
}

export default {
  state,
  actions,
  getters,
  mutations,
}
