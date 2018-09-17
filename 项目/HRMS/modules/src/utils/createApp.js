import config from './config'

const host = config.staticHost
const template = ({ sidebar, header }) => {
  const active = sidebar ? sidebar.active : 'organization'
  const isSearchUser = header && header['is-search-user']

  return '<div id="app" class="container">'
    + '<m-progress />'
    + `<m-header :is-search-user="${isSearchUser}" v-show="cssReady" />`
    + `<m-sidebar v-show="cssReady" current="${active}" />`
    + '<router-view v-show="cssReady" />'
    + '</div>'
}


// 动态加载 css
const cssLoader = path =>
  new Promise((resolve, reject) => {
    const { head } = document
    const link = document.createElement('link')

    link.href = path
    link.rel = 'stylesheet'
    link.onload = resolve
    link.onerror = reject
    head.appendChild(link)
  })

/**
 * 创建 window.app
 * @param {Object} options: { router, store }
 * @param {Object} ctx: { sidebar } 等其他参数
 */

const createApp = (options, ctx) => {
  let themeName = localStorage.getItem('CURRENT_THEME_NAME')
  if (!themeName) themeName = 'default'

  window.app = new window.Vue({
    el: '#app',
    ...options,
    template: template(ctx),
    data: {
      cssReady: false,
    },
    created() {
      Promise.all([
        cssLoader(`${host}/theme/${themeName}/index.css?v{{version}}`),
        cssLoader(`${host}/static/css/modules.css?v{{version}}`),
      ])
        .then(() => { this.cssReady = true })
    },
  })
}

export default createApp
