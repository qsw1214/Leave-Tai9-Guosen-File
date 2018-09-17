# wechatsevice

> This is a Vue2 Project. wechat service

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

# Mock
## dev环境的模拟
直接设置hepler/config下的mock为false,走的就是dev环境数据。域名已经直接配置在了config里面。

## 前端mock环境配置
直接设置hepler/config下的mock为true,走的就是前端我们自己设置的接口。当后台报错，或者其接口为实现。我们自己走到前面也是可以的。
```bash
# run mock server 运行服务接口
npm run mock
```
自己需要模拟的数据全部填写在helper/mock.js中。 如何写，自己参考文件已实现的部分。
(ps. 每次添加接口都需要重启下server。 即重新跑上面的接口。)
For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
