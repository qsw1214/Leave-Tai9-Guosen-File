
// 暴露到window对象
var JSBridge = window.JSBridge || {}

/**
 * native methods: http://gitlab.fincgo.com:8000/fincgo/fincgo-webapp/wikis/js-跟-native-交互
 * 注意：Android 调用 JSBridge[methodName]，iOS 调用 [methodName]
 * 下面方法把 iOS 方法注入到 JSBrdige 对象中
 */
const methods = [
  'getToken',
  'setFlag',
  'setHeadTitle',
  'addRecord',
  'scanPhoto',
  'showRightButton',
  'editCompletedCallback',
  'delCompletedCallback',
  'setTransparent',
  'goToBoard',
  'publishNeed',
  'publishCompleteCallback'
]
methods.forEach((name) => {
  if (name in window) JSBridge[name] = window[name]
})

Object.assign(JSBridge, {
  // 客户端回调方法
  client: {
    setToken (token) {
      window.localStorage.setItem('TOKEN', token)
    },
    editCompletedCallback () {
      // 一个编辑完重新渲染详情页面
      console.log('编辑完重新渲染详情页面')
      window.recordDetails.someActionComplete()
    },
    delCompletedCallback () {
      window.recordDetails.goBack()
    },
    publishCompleteCallback () {
      // 一个发布完重新渲染详情页面
      console.log('编辑完重新渲染详情页面')
      window.recordDetails.someActionComplete()
    }
  },
  // 判断客户端是否存在这个方法
  native (method, ctx) {
    // window.alert(method)
    if (typeof JSBridge[method] === 'function') {
      if (typeof ctx !== 'undefined') {
        JSBridge[method](ctx)
      } else {
        JSBridge[method]()
      }
    }
  }
})
window.JSBridge = JSBridge
export default JSBridge
