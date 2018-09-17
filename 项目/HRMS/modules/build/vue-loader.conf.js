var utils = require('./utils')
var config = require('../config')
var env = process.env.NODE_ENV
var isProduction = env === 'production' || env === 'testing'
var prop = env === 'producion' ? 'build' : 'test'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config[prop].productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
