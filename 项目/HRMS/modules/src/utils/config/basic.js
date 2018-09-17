const { location } = window
const { protocol, hostname } = location
let env = process.env.NODE_ENV
if (process.env.LOCAL) env = 'development'
if (process.env.LOCAL === 'false') env = 'development-backend'

const publicPath = env !== 'development' ? '/web' : ''
const port = env !== 'development' ? '' : ':8081'
const staticHost = `${protocol}//${hostname}${port}${publicPath}`

export default {
  env,
  publicPath,
  staticHost,
}
