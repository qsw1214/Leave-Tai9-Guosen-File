/**
 * 公共配置初始化
 */

import basic from '../basic'
import axios from '../../axios'
import api from '../../api'
import map from './map'

let env = process.env.NODE_ENV
if (process.env.LOCAL) env = 'development'

/**
 * 边栏菜单数据初始化
 * @param {Object} menus
 */

const setupMenus = (menus) => {
  const res = []
  menus.forEach((menu) => {
    const { children, code } = menu

    if (!map[code]) return false

    Object.assign(menu, map[code])

    if (children && children.length && menu.path) {
      menu.path = `${basic.publicPath}/${menu.path}.html`
    } else {
      menu.path = `${basic.publicPath}/${menu.index}.html`
    }

    if (children && children.length) {
      children.forEach((child) => {
        Object.assign(child, map[child.code])
        child.route = child.path
        child.path = `${menu.path}#${child.path}`
      })
    }

    return res.push(menu)
  })

  return res
}

const fetchConfigs = () => axios.get(api.common.configs)

// 配置存储 -> window.CONFIGS
const handler = (data) => {
  const menus = setupMenus(data.menu_list)
  const permissions = data.auth_list
  const cfg = {
    menus,
    permissions,
  }

  if (env === 'development') {
    sessionStorage.setItem('CONFIGS', JSON.stringify({ menus, permissions }))
  }

  window.CONFIGS = cfg
}


const init = () =>
  new Promise((resolve, reject) => {
    const configs = window.CONFIGS

    if (!configs) {
      fetchConfigs()
        .then((res) => {
          handler(res.data)
          resolve()
        })
        .catch((e) => {
          reject(new Error(e))
        })
    } else {
      resolve()
    }
  })

export default init
