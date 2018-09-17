var path = require('path')
var express = require('express')
var http = require('http')
var proxyMiddleware = require('http-proxy-middleware')
var cors = require('cors')

var app = express()
var port = 8081

app.use(proxyMiddleware('/web', {
  target: 'http://127.0.0.1:8081',
  pathRewrite: { '^/web': '' }
}))

app.use(cors())
// serve pure static assets
app.use(express.static('./dist'))

var uri = 'http://localhost:' + port

console.log('> Starting static server...')
console.log('> Listening at ' + uri + '\n')
http.createServer(app).listen(port)
