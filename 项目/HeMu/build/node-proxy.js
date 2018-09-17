var http = require('http');
var httpProxy = require('http-proxy');
  
var proxy = httpProxy.createProxyServer({});
  
// 捕获异常  
proxy.on('error', function (err, req, res) {  
  res.writeHead(500, {  
    'Content-Type': 'text/plain'  
  });  
  res.end('Something went wrong. And we are reporting a custom error message.');  
});  
  
var server = require('http').createServer(function(req, res) {  
  // 在这里可以自定义你的路由分发  
  var url = req.url;
  if(url.indexOf('/ajax/') != -1){
    console.log(url);
    proxy.web(req, res, { target: 'http://local.saas.fincgo.com' });
  }else{
    proxy.web(req, res, { target: 'http://localhost:8080' });
  }
});  
  
console.log("listening on port 80")
server.listen(80);  