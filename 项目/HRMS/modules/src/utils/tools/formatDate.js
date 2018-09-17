const formatNumber = (num) => {
  const n = num.toString()
  return n[1] ? n : `0${n}`
}

const dateHandler = (date, format, toLocal) => {
  const year = date.getFullYear()
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())
  let type = format
  let split = '-'

  if (/\//.test(format)) split = '/'

  type = type.split(split)
  const inputArray = []
  type.forEach((item) => {
    if (item === 'YYYY') inputArray.push(toLocal ? `${year}年` : year)
    else if (item === 'MM') inputArray.push(toLocal ? `${month}月` : month)
    else if (item === 'DD') inputArray.push(toLocal ? `${day}日` : day)
  })

  return inputArray.join((toLocal ? '' : split))
}

const timeHandler = (date, format) => {
  if (!format) return ''

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const split = ':'
  const type = format.split(split)
  const inputArray = []

  type.forEach((item) => {
    if (item === 'hh') inputArray.push(hours)
    else if (item === 'mm') inputArray.push(minutes)
    else if (item === 'ss') inputArray.push(seconds)
  })

  return inputArray.map(formatNumber).join(split)
}

/**
 * 时间格式化
 * @param value {Number, String} 10 或 13 位数时间戳，required: true
 * @param format {String} 格式，required: false, default: 'YYYY-MM-DD'
 * @param toLocal {Boolean} 是否转化为`年月日`格式，default: false, required: false
 */

const formatDate = (value, format, toLocal) => {
  let date = value.toString().length === 13 ? value : (value * 1000)
  date = new Date(value)

  let type = format || 'YYYY-MM-DD'
  type = type.split(' ')

  const DATE = dateHandler(date, type[0], toLocal)
  const TIME = timeHandler(date, type[1])
  let res

  if (DATE && TIME) res = `${DATE} ${TIME}`
  else if (DATE) res = DATE
  else if (TIME) res = TIME

  return res
}

export default formatDate
