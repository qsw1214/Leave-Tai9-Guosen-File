/**
 * @module utils.axios
 * @desc axios 实例封装，使用方法：Vue.prototype.$axios = utils.axios
 */

import axios from 'axios'
import config from '../config'
import progress from './progress'
import tools from '../tools'

const { location } = window
const { baseURL, headers } = config
const { messageHandler } = tools
const env = process.env.NODE_ENV
const isLocal = process.env.LOCAL

const instance = axios.create({
  baseURL,
  headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, headers),
  transformRequest: [(data) => {
    if (data instanceof FormData || !data) {
      return data
    }

    const query = []
    Object.keys(data).forEach((item) => {
      query.push(`${item}=${encodeURIComponent(data[item])}`)
    })

    return query.join('&')
  }],
})


// 请求拦截
instance.interceptors.request.use((request) => {
  request.headers.token = localStorage.getItem('token') || ''

  // { showProgressBar } 传入方式
  // 'GET': axios.get(url, { params: { ... }, showProgressBar })
  // 'POST': axios.post(url, { ...data }, { showProgressBar })
  if (!('showProgressBar' in request)) request.showProgressBar = true
  if (request.showProgressBar) progress.init()

  return request
})

// 登录过期请求
const loginHandler = (response) => {
  let login = 'http://op.gxtr9.com/'

  if (env === 'development' || isLocal) {
    login = 'http://dev.op.gxtr9.com/'
  } else if (env === 'testing') {
    login = 'http://test.op.gxtr9.com/'
  }

  localStorage.removeItem('token')
  sessionStorage.clear()
  location.replace(login)
  return response
}

// 响应拦截
instance.interceptors.response.use((response) => {
  const { code, msg } = response.data
  if (response.config.showProgressBar) progress.increase()

  if (code === 0) {
    return response.data
  } else if (code === 1001) {
    return loginHandler(response)
  }

  /**
   * 调用 element-ui $message
   * 应用对象（app 或者 vm）需要挂载到 window 对象上
   */
  messageHandler(msg)

  /* eslint prefer-promise-reject-errors: [0, {"allowEmptyReject": true}] */
  return Promise.reject({ code, msg })
}, (error) => {
  const app = window.app || window.vm
  if (app && app.$message) {
    app.$message({
      message: '网络异常，请稍候重试。',
      type: 'error',
    })
  }

  return Promise.reject(error.response.data)
})

export default instance
