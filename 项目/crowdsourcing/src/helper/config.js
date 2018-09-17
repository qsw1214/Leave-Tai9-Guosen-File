/**
 * Created by Yangleilei on 2017/5/3
 * 项目配置文件，包含http请求链接地址基础配置信息
 */
var isDEV = Env == 'dev'
export default {
  version: 'v1.0.0',
  baseURL: isDEV ? 'http://test.twisted.fincgo.com' : 'http://wx.tech11.cn'
}
