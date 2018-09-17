## HRMS 人力资源系统一键打包

* 安装依赖

```shell
# 安装依赖 yarn OR npm i
yarn
```

* 配置 `config.json` 文件

```shell
cp config-example.json config.json
# 根据自己的项目目录更改地址
```

* 本地打包，步骤如下：

```shell
# -t test for testing build
# -t prod for production build

# -b [branch name] only for testing build
./r.sh -t [test/prod] -b [branch name]
```

* dev环境发布：

```shell
# 账号密码
# root good@2012
# 服务地址
# 172.19.220.34
# 文件目录
# /home/t9_app/dev.hr.gxtr9.com/current/public

scp ./testing/test.{{version}}.zip root@172.19.220.34:/home/t9_app/dev.hr.gxtr9.com/current/public
ssh root@172.19.220.34
cd /home/t9_app/dev.hr.gxtr9.com/current/public
rm -rf web/ && unzip test.{{version}}.zip -d ./web/
```

* 测试环境发布：http://jenkins.gxtr9.com/job/【H5】test.hr.gxtr9.com_web/

* 正式环境发布：发包给后端人员
