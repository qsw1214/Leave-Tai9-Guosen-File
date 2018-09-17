'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const os = require('os')

const prop = process.env.NODE_ENV === 'testing' ? 'test' : 'build'
const env = config[prop].env

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  performance: false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config[prop].productionSourceMap,
      extract: true
    })
  },
  devtool: config[prop].productionSourceMap ? '#source-map' : false,
  output: {
    path: config[prop].assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
    splitChunks: {
			cacheGroups: {
				vendors: {
					name: "vendors",
					chunks: "initial",
					minChunks: 2,
					minSize: 0
				}
			}
		},
		occurrenceOrder: true
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // replace officially maintained compression tools
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        mangle: true,
        output: { comments: false },
        compress: { warnings: false }
      },
      sourceMap: true,
      cache: true,
      parallel: os.cpus().length * 2
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash].css'),
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    ...utils.htmlPlugin(),

    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config[prop].assetsSubDirectory + '/static',
        ignore: ['.*']
      }
    ]),
    new StylelintPlugin({
      files: ['src/**/*.vue', 'src/**/*.scss'],
      syntax: 'scss'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // print the progress
    // new webpack.ProgressPlugin(function handler(percentage, msg) {
    //   console.log(percentage, msg)
    // })
  ]
})

if (config[prop].productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

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
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
