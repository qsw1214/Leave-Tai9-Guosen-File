/**
 * web-app 配置文件
 * test环境和dev环境基本相同唯一区别在与访问接口路径不一致
 */
export default {
  // app名字
  appName: 'wechat_service',
  // app统一标题名称
  appTitle: '微信小助手',
  // 版本号
  ver: '1.0',
  // 开发环境访问域名
  devHostName: 'http://local.saas.fincgo.com/',
  // 生产环境访问域名
  proHostName: '未配置',
  // test环境访问域名
  testHostName: '未配置',
  // 是否开启模拟数据
  mock: false,
  // 本地模拟数据
  mockUrl: '/api',
  // 系统统一处理errorCode
  errorCodeArr: [202]
}
