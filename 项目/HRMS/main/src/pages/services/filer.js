import Vue from 'vue'

Vue.filter('digitUppercase', (value) => {
  let v = value
  const fraction = ['角', '分']
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖',
  ]
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  const head = v < 0 ? '欠' : ''
  v = Math.abs(v)
  let s = ''

  for (let i = 0; i < fraction.length; i += 1) {
    /* eslint no-restricted-properties: 0 */
    s += (digit[Math.floor(v * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  v = Math.floor(v)

  for (let i = 0; i < unit[0].length && v > 0; i += 1) {
    let p = ''
    for (let j = 0; j < unit[1].length && v > 0; j += 1) {
      p = digit[v % 10] + unit[1][j] + p
      v = Math.floor(v / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }

  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
})
