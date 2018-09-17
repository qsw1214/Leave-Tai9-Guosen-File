import Vue from 'vue'
import permission from './permission'

/**
 * @directive: v-permission
 * @value {String, Number}: '1010001,1010002', 1010001
 * @modifiers.hide: 对元素做隐藏，默认是移除
 * @modifiers.del: 对元素做删除
 */

Vue.directive('permission', {
  bind(el, binding) {
    const { hide, del } = binding.modifiers

    permission.valid(binding.value, () => {
      el.disabled = true
      el.classList.add('no-permission')

      const cloneNode = el.cloneNode(true)
      const parent = el.parentNode

      if (hide) {
        el.style.display = 'none'
      } if (del) {
        parent.removeChild(el)
      } else {
        parent.insertBefore(cloneNode, el)
        parent.removeChild(el)
      }
    })
  },
})
