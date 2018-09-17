let env = process.env.NODE_ENV
if (process.env.LOCAL) env = 'development'

/**
 * 验证权限
 * @param {Number, String} value, 权限值
 * @param {Function} success, 命中匹配后回调
 */

const valid = (value, success) => {
  let configs = window.CONFIGS || {}
  if (env === 'development') {
    configs = sessionStorage.getItem('CONFIGS')
    configs = configs ? JSON.parse(configs) : {}
  }

  const { permissions } = configs

  if (!permissions) return false

  let isMatch = false
  let param = `${value}`
  param = param.split(',')

  param.some((item) => {
    if (permissions.includes(item)) {
      isMatch = true
      return true
    }

    return false
  })

  if (isMatch) return true

  if (!window.app) throw new Error('需要暴露 Vue 实例 app！')

  window.app.$nextTick(() => {
    if (typeof success === 'function') success()
  })

  return false
}

/**
 * 路由权限检测，在 vue-router 的 beforeEach 中执行
 */

const router = to =>
  new Promise((resolve, reject) => {
    const { permission, queryPermission } = to.meta
    let pass = false

    if (!permission || valid(permission)) pass = true

    if (queryPermission) {
      Object.keys(queryPermission).some((prop) => {
        if (to.query[prop] && !valid(queryPermission[prop])) {
          pass = false
          return true
        }

        return false
      })
    }

    if (pass) return resolve()

    if (window.app) {
      window.app.$message({
        type: 'error',
        message: '你暂无权限访问该页面',
      })
    }
    return reject()
  })

export default {
  valid,
  router,
}
