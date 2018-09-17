'use strict'
const utils = require('./utils')
const config = require('../config')
const env = process.env.NODE_ENV
const isProduction = env === 'production' || env === 'testing'
const prop = env === 'production'
  ? 'build'
  : (env === 'testing' ? 'test' : 'dev')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: config[prop].cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
