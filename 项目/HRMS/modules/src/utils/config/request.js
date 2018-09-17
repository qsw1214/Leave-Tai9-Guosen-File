/**
 * 数据请求的基本配置
 * @param baseURL
 * @param headers { device, token }
 */

const env = process.env.NODE_ENV
const isLocal = process.env.LOCAL
const version = env === 'production' ? '{{version}}' : env
let baseURL = 'http://hr.gxtr9.com'

if (env === 'development') {
  baseURL = 'http://localhost:8080'
} else if (isLocal) {
  baseURL = 'http://dev.hr.gxtr9.com'
} else if (env === 'testing') {
  baseURL = 'http://test.hr.gxtr9.com'
} else if (env === 'production') {
  baseURL = 'http://hr.gxtr9.com'
}

export default {
  baseURL,

  headers: {
    device: `client=web&ver=${version}`,
    token: localStorage.getItem('token'),
  },
}
