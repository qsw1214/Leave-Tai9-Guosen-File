/**
 * web-app 配置文件
 * test环境和dev环境基本相同唯一区别在与访问接口路径不一致
 */
export default {
  // app名字
  appName: 'enterprise',
  // 版本号
  ver: '1.0',
  // 本地模拟数据
  mockUrl: '/api',
  // 开发环境访问域名
  devHostName: 'http://dev.op.gxtr9.com/ent',
  // 生产环境访问域名
  // proHostName: 'http://112.74.178.89:81/ent',
  // proHostName: 'http://api.op.tech11.cn/ent',
  proHostName: 'http://api.tj.guosen.com.cn/api/ent',
  // test环境访问域名
  // testHostName: 'http://test.api.op.gxtr9.com/ent',
  testHostName: 'http://test.tjapi.gxtr9.com:5390/ent',
  // app统一标题名称
  appTitle: '圈层',
  // 是否开启模拟数据
  mock: false,
  // 系统统一处理errorCode
  errorCodeArr: [202]
}
