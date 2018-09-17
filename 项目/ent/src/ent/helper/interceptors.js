import Config from './config'
import Vue from 'vue'
import md5 from 'md5'
import JSBridge from 'helper/JSBridge'
// 此处直接向客户端请求token(android拿不到改成直接参数传递 ios走的是回调js方法)
JSBridge.native('getToken')

export const Interceptors = (errorHandler) => {
  // 避免请求多次发送
  let frozenUrl = {}
  Vue.http.options.emulateJSON = true
  const getCommonParams = function () {
    let params = {}
    let secondsUnix = parseInt((new Date().getTime()) / 1000).toString()
    // 客户端设备相关信息
    // 包含：系统信息(sys)、版本号(ver)、IP地址(ip)、设备类型(devtype)
    // 其中设备类型(devtype)包含：1-H5、2-PC、4-微信、8-andriod、16-IOS
    // 数据格式如： sys=mx10&ver=1.0&ip=127.0.0.1&devtype=1
    params.device = 'sys=&ver=' + Config.ver + '&ip=&devtype=1'
    // 系统平台编号，统一分配. 圈层102
    params.plat = 112
    // 请求ID唯一性
    params.reqid = secondsUnix
    // 请求时间戳
    params.ts = secondsUnix
    // 请求签名鉴权 详见wiki
    params.sign = md5(md5(params.plat + params.reqid + params.ts))
    // 用户token|| '31aab64ae4c7d83393cd7014a6040fea'
    params.token = window.localStorage.getItem('TOKEN')
    // window.alert(window.localStorage.getItem('TOKEN'))
    // console.log(JSON.stringify(params))
    return encodeURI(JSON.stringify(params))
  }

  Vue.http.interceptors.push((request, next) => {
    // 请求url处理
    if (Config.mock) {
      request.url = '/api' + request.url
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
    request.body.comm_params = getCommonParams()
    if (frozenUrl[ request.url ]) return false
    frozenUrl[ request.url ] = true
    next((response) => {
      frozenUrl[ request.url ] = false
      if (!response.ok) {
        console.error('跨域访问失败,网络或者跨域存在问题。')
      } else {
        // window.alert('异步数据成功')
        let res = null
        if (typeof response.body === 'string') {
          res = JSON.parse(response.body)
        } else {
          res = response.body
        }
        let code = res.code
        if (code !== 0) {
          window.alert(res.message)
          if (Config.errorCodeArr.indexOf(code) !== -1) {
            errorHandler && errorHandler(res)
          }
        }
      }
    })
  })
}
