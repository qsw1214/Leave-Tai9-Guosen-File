/**
 * Created by Yangleilei on 2017/5/3
 */
import axios from 'axios'
import config from './config'
import Qs from 'qs'
import router from '../router'

// 创建axios的实例
let instance = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [(data) => {
    if (!data) return data
    if (data instanceof FormData) return data
    data = Qs.stringify(data)
    return data
  }]
})
// 请求拦截
instance.interceptors.request.use(config => {
  return config
})
// 响应拦截
instance.interceptors.response.use(reponse => {
  const {code, error} = reponse
  // console.log(error)
  if (code !== 0) {
    if (code == 202) {
      router.replace({
        path: '/404',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
  }
  return reponse
}, error => {
  return Promise.reject(error.response.data)
})

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$http', {value: instance})
  }
}
