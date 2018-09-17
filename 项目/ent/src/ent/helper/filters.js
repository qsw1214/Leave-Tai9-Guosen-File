/**
 * 全局过滤函数
 */
import Vue from 'vue'
export const Filters = () => {
  Vue.filter('test', (val) => {
    let sexArr = {
      '-1': '未知',
      '1': '男',
      '2': '女'
    }
    return sexArr[val]
  })
}
