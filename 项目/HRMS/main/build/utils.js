const path = require('path')
const glob = require('glob')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config')

const PAGE_PATH = path.resolve(__dirname, '../src/pages')

const prop = process.env.NODE_ENV === 'production'
  ? 'build'
  : (process.env.NODE_ENV === 'testing' ? 'test' : 'dev')

exports.entries = function () {
  const entryFiles = glob.sync(`${PAGE_PATH}/*/*.js`)
  const entries = {}

  entryFiles.forEach((filePath) => {
    const name = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    if (name !== 'api' && name !== 'filer') entries[name] = filePath
  })

  return entries
}

exports.htmlPlugin = function () {
  const interfaces = require('os').networkInterfaces()
  let baseURL = 'http://127.0.0.1:8081/'
  for(let devName in interfaces) {
    interfaces[devName].forEach((alias) => {
      if (
        alias.family === 'IPv4'
        && alias.address !== '127.0.0.1'
        && !alias.internal
      ) {
        baseURL = 'http://' + alias.address + ':8081/'
      }
    })
  }

  const entryHtml = glob.sync(`${PAGE_PATH}/*/*.html`)
  const html = []
  const config = function (filePath, name, theme) {
    const filename = theme ? `${theme}/${name}` : name
    let conf = {
      template: filePath,
      filename: `${filename}.html`,
      chunks: [name],
      inject: true,
    }

    if (prop !== 'dev') {
      conf = merge(conf, {
        chunks: ['vendors', name],
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        chunksSortMode: 'dependency'
      })
    } else {
      conf.baseURL = baseURL
    }

    return conf
  }

  entryHtml.forEach((filePath) => {
    const name = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    html.push(new HtmlWebpackPlugin(config(filePath, name)))
  })

  return html
}

exports.assetsPath = function (_path) {
  const assetsSubDirectory = config[prop].assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: prop !== 'dev',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
