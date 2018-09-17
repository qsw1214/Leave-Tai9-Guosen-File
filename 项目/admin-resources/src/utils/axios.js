/**
 * Created by Yangleilei on 2017/7/10
 */
import axios from 'axios'
import cfg from './config'
import router from '@/router'
import { MessageBox } from 'element-ui'
import Qs from 'qs'

// 创建axios的实例
let instance = axios.create({
  baseURL: cfg.baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'device': cfg.device
  },
  transformRequest: [(data) => {
    return Qs.stringify(data)
  }]
})

// 请求拦截
instance.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) config.headers.token = token
  return config
})

// 响应拦截
instance.interceptors.response.use(reponse => {
  const {code, error} = reponse.data
  if (code === 0) {
    return reponse.data
  } else {
    const msg = error || '服务器报错，但是并没有下发错误信息！'
    MessageBox.alert(msg, '错误信息', {
      confirmButtonText: '确定',
      callback: action => {
        if (code === 202) {
          router.push('/login')
        }
      }
    })
    return reponse.data
  }
}, error => {
  return Promise.reject(error.response.data)
})

export default instance
