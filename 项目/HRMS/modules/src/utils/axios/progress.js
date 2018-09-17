import nprogress from 'nprogress'

let totalRequests = 0
let requestsCompleted = 0
const latencyThreshold = 100

nprogress.configure({
  parent: '.m-progress',
  showSpinner: false,
  trickleSpeed: 200,
})

const init = () => {
  if (totalRequests === 0) {
    setTimeout(() => {
      nprogress.start()
    }, latencyThreshold)
  }

  totalRequests += 1
  nprogress.set(requestsCompleted / totalRequests)
}

const setComplete = () => {
  totalRequests = 0
  requestsCompleted = 0
  nprogress.done()
}

const increase = () => {
  setTimeout(() => {
    requestsCompleted += 1

    if (requestsCompleted >= totalRequests) {
      setComplete()
    } else {
      nprogress.set((requestsCompleted / totalRequests) - 0.1)
    }
  }, latencyThreshold + 50)
}

export default {
  increase,
  init,
}
