const Toast = (msg, timeout) => {
  let $el = document.getElementById('toast_origin')
  if (!$el) {
    $el = document.createElement('div')
    $el.id = 'toast_origin'
    document.body.appendChild($el)
  }
  $el.innerHTML = msg
  $el.classList.add('toast_origin')
  $el.classList.remove('hide')
  if (window.toastTimeout) clearTimeout(window.toastTimeout)
  window.toastTimeout = setTimeout(() => {
    $el.classList.add('hide')
  }, (timeout || 2000))
}

export default Toast
