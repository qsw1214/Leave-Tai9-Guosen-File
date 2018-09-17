import formatDate from './formatDate'

/**
 * 用于搜索框的输入中英文分号和空格去重去空后输出
 * @return Array
 */

const splitKeyword = (keyword) => {
  const str = keyword.trim()
  const arr = (str.replace(/,/gi, ' ').replace(/，/gi, ' ').split(' ')).filter(item => item !== '')
  const newArr = Array.from(new Set(arr))
  return newArr
}

/**
 * 用于转义需要做为RegExp()做为参数的字符串
 * @return Str
 */

/* eslint no-useless-escape: 0 */
const convertRegStr = str => str.replace(/[\*\.\?\+\$\^\[\]\(\)\{\}\|\\/]/g, '\\$&')

/**
 * 原生构建一个form表单提交到目标地址。避免window.open的弹窗被拦截
 * @porps name O 下载文件名称， 默认file
 * @props action M 跳转链接，需为全链接地址
 * @return undefined
 */

const windowOpen = (action, name) => {
  const $form = document.createElement('form')
  $form.method = 'POST'
  document.body.appendChild($form)
  const $input = document.createElement('input')
  $input.type = 'hidden'
  $form.appendChild($input)
  $input.value = 'filedownload'
  $input.name = name || 'file'
  const hasPramas = action.indexOf('?') !== -1
  const token = localStorage.getItem('token')
  $form.action = hasPramas ? `${action}&token=${token}` : `${action}?token=${token}`
  $form.submit()
  document.body.removeChild($form)
}

/*
 * 数组搜索
 * @params arr {Array} 需要筛选的数组
 * @params keys {Array} 进行筛选的对象属性列表
 * @params keyword {String} 关键字
 * @params isAccurate { Boolean } 精确搜索，默认：多个关键字精确搜索
 * @return 筛选的结果
 */

const arraySearch = (arr, keys, keyword, isAccurate) => {
  if (!arr || arr.length === 0) return []
  const keywordArr = splitKeyword(keyword)
  const keywordLength = keywordArr.length
  if (keywordLength === 0) return arr
  let accurate = false
  if (isAccurate !== undefined) {
    accurate = isAccurate
  } else {
    accurate = keywordLength > 1
  }
  const newArr = []
  const regxSpecial = new RegExp('[\\*\\.\\?\\+\\$\\^\\[\\]\\(\\)\\{\\}\\/]', 'g')
  if (accurate) {
    // 精确查找
    const newKeys = keywordArr.map(i => `^${i.replace(regxSpecial, '\\$&')}$`)
    const regx = new RegExp(newKeys.join('|'))
    arr.forEach((item) => {
      keys.forEach((k) => {
        if (regx.test(item[k])) {
          newArr.push(item)
        }
      })
    })
  } else {
    // 模糊查找
    const regx = new RegExp(keywordArr.join('|').replace(regxSpecial, '\\$&'))
    arr.forEach((item) => {
      const keyValues = []
      keys.forEach((k) => {
        if (item[k]) {
          keyValues.push(item[k])
        }
      })
      const str = keyValues.join(',')
      if (regx.test(str)) {
        newArr.push(item)
      }
    })
  }
  return newArr
}

/**
 * 基于elem的一个提示框
 * @porps message M 单/多行提示
 * @return undefined
 */

const messageHandler = (message, callback) => {
  let msg = message
  const app = window.app || window.vm
  if (app && app.$message) {
    msg = msg.split('||')

    if (msg.length > 1) {
      const h = app.$createElement
      const msgArr = []

      msg.forEach((item, index) => {
        msgArr.push(h('p', { style: 'line-height: 1.2; margin-top: 10px; font-size: 16px; color: #999;' }, `${index + 1}.${item}`))
      })

      app.$msgbox({
        title: '错误',
        customClass: 'message-box__multiple',
        message: h('div', { style: 'display: flex; align-items: top;' }, [
          h('div', { style: 'width: 40px; height: 40px; border-radius: 50%; background-color: #FF4949; position: relative; margin-right: 20px;' }, [
            h('div', { style: 'width: 22px; height: 4px; position: absolute; background-color: #fff; top: 18px; left: 10px; transform: rotate(45deg); border-radius: 1px;' }, []),
            h('div', { style: 'width: 22px; height: 4px; position: absolute; background-color: #fff; top: 18px; left: 10px; transform: rotate(-45deg); border-radius: 1px;' }, []),
          ]),
          h('div', { style: 'flex: 1;' }, [
            h('h2', { style: 'margin: 0px; padding: 0px; line-height: 2; font-size: 18px; font-weight: normal; color: #333;' }, '相关操作存在错误!'),
            h('div', { style: 'margin-top: 6px;' }, msgArr),
          ]),
        ]),
        showCancelButton: false,
      })
        .catch(() => {})
        .then(() => {
          if (callback) callback()
        })
    } else {
      app.$message({
        message: msg[0] || '出错了！且服务器没有返回错误信息。',
        type: 'error',
        showClose: true,
      })
    }
  }
}

/**
 * 回到页面顶部
 * @porps distance Number O 距离顶部多远
 * @return undefined
 */
const backToTop = (distance) => {
  const start = window.pageYOffset
  const top = distance ? Number(distance) : 80
  /* eslint no-mixed-operators: 0 */
  /* eslint no-param-reassign: 0 */
  /* eslint no-cond-assign: 0 */
  /* eslint no-plusplus: 0 */
  const easeInOutQuad = (t, b, c, d) => {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b
    return -c / 2 * (--t * (t - 2) - 1) + b
  }
  let i = 0

  window.interval = setInterval(() => {
    const next = Math.floor(easeInOutQuad(10 * i, start, -start, 500))
    if (next <= top) {
      window.scrollTo(0, top)
      clearInterval(window.interval)
    } else {
      window.scrollTo(0, next)
    }
    i += 1
  }, 16.7)
}

export default {
  splitKeyword,
  formatDate,
  windowOpen,
  arraySearch,
  convertRegStr,
  messageHandler,
  backToTop,
}
