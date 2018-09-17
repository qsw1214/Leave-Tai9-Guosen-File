var express = require('express')
var app  = express()

var doLogin = {
  "error": 0,
  "data": {
    "usersecret": "738458c8eddb2b10404c4f74a8705"
  }
}
var sendVerifyMsg = {
  "error": 0,
  "msg": "短信发送失败，失败消息：IP没有权限"
}

var findPasswordBack = {
  "error": 0,
  "msg": "验证码不一致"
}

app.post('/api/ajax/WechatService/Index/doLogin', function (req, res) {
  res.send(doLogin)
})

app.post('/api/ajax/WechatService/Index/sendVerifyMsg', function (req, res) {
  res.send(sendVerifyMsg)
})

app.post('/api/ajax/WechatService/Index/findPasswordBack', function (req, res) {
  res.send(findPasswordBack)
})

app.listen(3001, function () {
  console.log('Mock Server listening on port 3001!');
})