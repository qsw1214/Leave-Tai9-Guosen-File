var express = require('express')
var app  = express()
var json = {
  "code": 0,
  "message": "success",
  "data": {
    "num": "3",
    "name": "北京乐瑞资产管理有限公司",
    "user_name": "kobe",
    "time": "2016-10-25",
    "local": "企业机构客户",
    "region": "上海",
    "record_detail": [
      {
        "id": "58352ff7dd4d7",
        "time": "2016-10-25",
        "theme": "投资",
        "status": "首次拜访",
        "mode": "电话",
        "detail_record": "kobe"
      },
      {
        "id": "58352f8dc6eab",
        "time": "2016-10-25",
        "theme": "投资",
        "detail_record": "hahass"
      }
    ]
  }
}

app.post('/api/record/recordDetail', function (req, res) {
  res.send(json)
})

app.listen(3001, function () {
  console.log('Mock Server listening on port 3001!');
})