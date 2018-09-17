let baseURL
switch (process.env.NODE_ENV) {
  case 'development':
    // baseURL = 'http://dev.api.zy.gxtr9.com/admin'
    baseURL = 'http://test.api.zy.fincgo.com/admin'
    break
  case 'test':
    baseURL = 'http://test.api.zy.fincgo.com/admin'
    break
  case 'production':
    baseURL = 'http://api.zy.fincgo.com/admin'
    break
  default:
}

export default {
  baseURL,
  device: 'appName=mp&ver=1.0&client=web'
}
