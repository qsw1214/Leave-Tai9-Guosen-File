#!/bin/bash
#--------------------------------------------
# 功能：发布代码到测试环境
# 发布代码到正式环境
#--------------------------------------------
server="172.18.135.185"
port=21
# 本地路径
pwd
cd ../dist/ent
# 远程路径
remotePath="root@$server:/mnt/www/dev.op.gxtr9.com/system-web/ent"
/usr/bin/rsync -aP -O -e "ssh" ./ ${remotePath}