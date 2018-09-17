import packageJson from '@/../package.json'
import axios from './axios'
import config from './config'
import api from './api'
import tools from './tools'
import permission from './permission'
import createApp from './createApp'

const name = 'Utils'
const { version } = packageJson
const dev = (process.env.LOCAL && process.env.LOCAL !== 'false') || process.env.NODE_ENV === 'development'

export default {
  env: dev ? 'development' : 'production',
  name,
  version,
  axios,
  config,
  api,
  tools,
  permission,
  createApp,
}
