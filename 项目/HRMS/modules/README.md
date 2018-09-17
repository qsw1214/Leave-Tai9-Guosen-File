# hr-system_modules

Release [![Release build status](http://gitlab.gxtr9.com:8980/t9_frontend/hrms/modules/badges/release/build.svg)](http://gitlab.gxtr9.com:8980/t9_frontend/hrms/modules/commits/release), Test [![Test build status](http://gitlab.gxtr9.com:8980/t9_frontend/hrms/modules/badges/test/build.svg)](http://gitlab.gxtr9.com:8980/t9_frontend/hrms/modules/commits/test)

> 人力资源系统公共组件：Modules、Utils

## 开发模式

* 开发按模块创建分支（如：dev-header）
* 模块命名：用 M 开头（代表 Module），后面名字驼峰法，如 `MHeader`
* 开发自测完成后，push 该分支并在 gitlab 发起 merge request 由其他合作开发同事 review 后合并到 master 分支

## 外链模式

* 本地起静态服务：`npm run static`

参考 index.html 和 webpack confg 中的 htmlWebpackPlugin 配置的 baseURL

## Build Setup

``` bash
# install dependencies
yarn

# initialize, copy comman lib modules to dist/vendor
# vue, vuex, vue-router, element-ui, etc.
npm run init && npm run theme-default

# serve with hot reload at localhost:8080
# for Modules, utils development
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## mock

``` bash
# install mock server
npm i -g mock-api

# run mock server
npm run mock
```
