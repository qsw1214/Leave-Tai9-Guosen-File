/**
 * 全局过滤函数
 */
import Vue from 'vue'
Vue.filter('test', (val) => {
  let sexArr = {
    '-1': '未知',
    '1': '男',
    '2': '女'
  }
  return sexArr[val]
})