var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var config = require('../config')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

var prop = process.env.NODE_ENV === 'production' ? 'build' : 'test'
var env = config[prop].env
if (process.env.LOCAL) env.LOCAL = `'${process.env.LOCAL}'`

// config element-ui css output name, default is index.css
var elementPath = path.resolve(__dirname, '../dist/vendor/element-ui/index.css')

Object.assign(baseWebpackConfig, {
  entry: {
    modules: './src/modules.js',
    utils: './src/utils/index.js'
  },
})

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  performance: false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config[prop].productionSourceMap,
      sourceMap: true,
      extract: true
    })
  },
  devtool: config[prop].productionSourceMap ? '#source-map' : false,
  output: {
    path: config[prop].assetsRoot,
    filename: utils.assetsPath('js/lib.[name].js'),
    library: ['Lib', '[name]'],
    libraryTarget: 'window',
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static/vendor'),
        to: path.resolve(config[prop].assetsRoot, 'vendor'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../static/favicon.png'),
        to: path.resolve(config[prop].assetsRoot, 'static')
      }
    ]),
    new StylelintPlugin({
      files: ['src/**/*.vue', 'src/**/*.scss'],
      syntax: 'scss'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
})

if (config[prop].productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config[prop].productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config[prop].bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
