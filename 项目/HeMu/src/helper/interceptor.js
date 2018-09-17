import Config from './config'
import Vue from 'vue'
export const Interceptor = (errorHandler) => {
  // 避免请求多次发送
  let frozenUrl = {}
  Vue.http.options.emulateJSON = true
  Vue.http.interceptors.push((request, next) => {
    // 请求url处理
    if (Config.mock) {
      request.url = Config.mockUrl + request.url
    } else {
      // 开发和测试环境都需读取test的接口
      if (process.env.NODE_ENV === 'testing') {
        request.url = Config.testHostName + request.url
      } else if (process.env.NODE_ENV === 'development') {
        request.url = Config.devHostName + request.url
      } else {
        request.url = Config.proHostName + request.url
      }
    }
    if (frozenUrl[ request.url ]) return false
    frozenUrl[ request.url ] = true
    next((response) => {
      let res = response.body
      let code = res.code
      frozenUrl[ request.url ] = false
      if (!response.ok) {
        window.alert('网络或者其它原因导致数据接口拉去失败！请重试。')
      } else if (Config.errorCodeArr.indexOf(code) !== -1) {
        errorHandler && errorHandler(res)
      }
    })
  })
}
