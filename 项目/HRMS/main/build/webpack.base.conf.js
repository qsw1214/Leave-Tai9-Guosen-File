'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const env = process.env.NODE_ENV
const prop = env === 'production'
  ? 'build'
  : (env === 'testing' ? 'test' : 'dev')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: utils.entries(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: config[prop].assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '~organization': resolve('src/pages/organization'),
      '~employee': resolve('src/pages/employee'),
      '~position': resolve('src/pages/position'),
      '~settings': resolve('src/pages/settings'),
      '~services': resolve('src/pages/services'),
      '~index': resolve('src/pages/index'),
      '~oa': resolve('src/pages/oa'),
      '~report': resolve('src/pages/report'),
      '~manager': resolve('src/pages/manager'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBabel',
        exclude: [resolve('node_modules')],
        include: [resolve('src')]
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader?cacheDirectory=true',
      //   include: [resolve('src')]
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happyBabel',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool,
    })
  ],
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
  }
}
