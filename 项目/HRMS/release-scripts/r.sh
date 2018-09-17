#!/bin/bash
# release test/production build

GREEN=\033[32m
RED=\033[31m
YELLOW=\033[33m
BLUE=\033[34m
COLOR_END=\033[0m

USAGE='./r.sh -t [test / prod] -b [branch name]'
BRANCH_NAME="master"

# -b for branch name, default is "master", -t should be production
# -t for release type, "test" || "production", reqruired.
# -h help
while getopts "ht:b:" opt; do
  case $opt in
    h)
      echo $USAGE
      exit 0
      ;;
    t)
      RTYPE=$OPTARG
      ;;
    b)
      BRANCH_NAME=$OPTARG
      ;;
    ?)
      echo -e "\\$RED  - 参数错误：$USAGE\\$COLOR_END"
      exit 1
      ;;
  esac
done

if [[ ! $RTYPE ]]; then
  echo -e "\\$RED  缺少参数:\\$COLOR_END -t [test / prod] -b [branch name]"
  exit 1
elif [[ $RTYPE == "prod" && $BRANCH_NAME != "master"  ]]; then
  echo -e "\\$RED  参数错误:\\$COLOR_END 发布正式版，请使用 '-b master'"
  exit 1
elif [[ $RTYPE == "test" && $BRANCH_NAME == "release" ]]; then
  echo -e "\\$RED  参数错误:\\$COLOR_END 发布测试版，请使用 '-t test'"
  exit 1
fi



# path var
# -----------------------------
getProp() {
  echo `cat $2 | grep -n \"$1\" | cut -d ' ' -f4 | grep -o '[^"].*[^",]'`
}

BASIC_PATH=`getProp basePath ./config.json`
MODULES=$BASIC_PATH`getProp modules ./config.json`
MAIN=$BASIC_PATH`getProp main ./config.json`
TARGET=$BASIC_PATH`getProp release ./config.json`


RUN_SCRIPT="npm run release"
DIST="$TARGET/production"
COMMIT_MSG="production release"

if [[ $RTYPE == "test" ]]; then
  RUN_SCRIPT="npm run release-test"
  DIST="$TARGET/testing"
  COMMIT_MSG="testing release"
fi

if [[ $RTYPE == "dev" ]]; then
  RUN_SCRIPT="npm run release-dev"
  DIST="$TARGET/dev"
  COMMIT_MSG="testing release"
fi



# 确认需要编译的仓库
# ------------------------------

confirmBuild() {
  read -p "  是否需要编译 $1 (y/n)：" REPLY

  case $REPLY in
    Y | y | N | n)
      ;;
    "")
      REPLY="y"
      ;;
    *)
      echo -e "\\$RED  !!! 请输入 y/n\\$COLOR_END"
      exit 1
      ;;
  esac

  echo "$REPLY"
}

# needBuildModules=`confirmBuild "Modules"`


# 检查目录
# ------------------------------

checkFolder() {
  if [ ! -d "$1" ]; then
    echo -e "\\$RED  !!! 没有找到 $2 项目地址：$1\\$COLOR_END"
    exit 1
  fi
}

# checkFolder $MODULES 'Modules'
checkFolder $TARGET 'Release'



# 检查分支
# -----------------------------

checkBranch() {
  echo -e "\n\\$YELLOW  - fetch：$2 $BRANCH_NAME 分支\\$COLOR_END"

  cd $1 && git fetch

  CURRENT_BRANCH=`git branch | awk '/^\*/{print $1}'`
  CHECKED_BRANCH=`git branch | grep -n "$BRANCH_NAME" | cut -d ' ' -f3`
  FLAG=false

  if [[ $CURRENT_BRANCH == $BRANCH_NAME ]]; then
    FLAG=true
  elif [[ $CHECKED_BRANCH ]]; then
    FLAG=true
    echo -e "\\$YELLOW  - checkout: $2 $BRANCH_NAME 分支\\$COLOR_END"
    git checkout $BRANCH_NAME
  elif [[ `git branch -a | grep "$BRANCH_NAME"$` ]]; then
    FLAG=true
    echo -e "\\$YELLOW  - checkout: $2 $BRANCH_NAME 分支\\$COLOR_END"
    git checkout -b $BRANCH_NAME remotes/origin/$BRANCH_NAME
  fi

  if [ "$FLAG" != true ]; then
    echo -e "\\$RED  - $1 仓库不存在分支：$BRANCH_NAME\\$COLOR_END"
    exit 1
  fi

  echo -e "\\$YELLOW  - pull: $2 $BRANCH_NAME 分支\\$COLOR_END"
  git pull origin $BRANCH_NAME
}

# checkBranch $MODULES "Modules"


# bump release version 
# -----------------------------

cd $TARGET
echo -e "\n\\$YELLOW  Start bumping version for release target.\\$COLOR_END"

if [[ $RTYPE == "test" ]]; then
  bump --prompt --commit "$COMMIT_MSG" --push
elif [[ $RTYPE == "prod" ]]; then
  bump --prompt --commit "$COMMIT_MSG" --tag --push
fi

echo -e "\\$GREEN  !!! bumping version complete.\\$COLOR_END"

VERSION=`getProp version ./package.json`
ZIP=$RTYPE.$VERSION.zip

sleep 0.2s


# run build script 
# -----------------------------

if [ ! -d "$TARGET/tmp" ]; then
  mkdir $TARGET/tmp
fi

if [ ! -d "$TARGET/dev" ]; then
  mkdir $TARGET/dev
fi

if [ ! -d "$TARGET/testing" ]; then
  mkdir $TARGET/testing
fi

if [ ! -d "$TARGET/production" ]; then
  mkdir $TARGET/production
fi

checkFolder $MODULES "Modules"
checkBranch $MODULES "Modules"
cd $MODULES/ && $RUN_SCRIPT && \
echo -e "\\$GREEN  !!! build Modules complete.\\$COLOR_END"

sleep .5s
cp -rf $MODULES/dist/* $TARGET/tmp/ 


checkFolder $MAIN "Main"
checkBranch $MAIN "Main"

cd $MAIN/ && $RUN_SCRIPT && \
echo -e "\\$GREEN  !!! build HRMS complete.\\$COLOR_END"

sleep .5s
cp -rf $MAIN/dist/* $TARGET/tmp/ 

cd $TARGET/tmp/
grep "{{version}}" -R ./* | awk -F":" '{print $1}' | xargs sed -i"" -e "s/{{version}}/$VERSION/g"

zip -q -r $ZIP ./* -r && \
echo -e "\\$GREEN  - zip $ZIP complete.\\$COLOR_END" && \
mv $TARGET/tmp/$ZIP $DIST/ && \
echo -e "\\$GREEN  - mv $ZIP to $DIST\\$COLOR_END"

sleep 0.5s

rm -rf $TARGET/tmp/* && \
echo -e "\\$GREEN  - remove files in $TARGET/tmp\\$COLOR_END"

sleep 0.5s

if [[ $RTYPE == "dev" ]]; then
  echo -e "\\$GREEN  - publishing dev-backend...\\$COLOR_END"

  rm -rf $MODULES/dist
  rm -rf $MODULES/static/vendor
  rm -rf $MAIN/dist
  scp $TARGET/dev/$ZIP root@172.19.220.34:/home/t9_app/dev.hr.gxtr9.com/current/public
  
ssh root@172.19.220.34 -tt << remotessh
  cd /home/t9_app/dev.hr.gxtr9.com/current/public
  rm -rf web/ && unzip ./$ZIP -d ./web/
  rm -rf ./$ZIP
  exit
remotessh

  rm -rf $TARGET/dev/$ZIP
  
  echo -e "\\$GREEN  !!! publish dev-backend complete.\\$COLOR_END"
  
fi

echo -e "\\$GREEN  - Missions complete.\\$COLOR_END"
