import Vue from 'vue'
import Config from './config'

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 拼接跳转url
Vue.filter('jumpUrl', (value) => {
  return Config.jumpHostUrl + value
})
