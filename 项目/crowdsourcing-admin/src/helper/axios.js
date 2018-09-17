import axios from 'axios'
import config from './config'
import Qs from 'qs'
import router from '../router/routes'
import { Message } from 'element-ui'

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

instance.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.token = token
    config.headers.device = 'appName=backend'
  }
  return config
})

// http response 拦截器
instance.interceptors.response.use(
  response => {
    const errorCode = typeof response.data.code !== 'undefined' ? response.data.code : -1000
    const errorMsg = response.data.error ? response.data.error : '未知错误'
    if (errorCode !== 0) {
      if (errorCode == 202) {
        Message.warning(errorMsg)
        router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
      } else {
        Message.error(errorMsg)
      }
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(error.response.data)
  })

export default instance
