#!/bin/bash
# for testing sh script only

GREEN=\033[32m
RED=\033[31m
YELLOW=\033[33m
BLUE=\033[34m
COLOR_END=\033[0m


# opts testing
# -r rsync 到 tai9.org 服务器
RSYNC=false

while getopts "b:r" OPT; do
  case $OPT in
    r)
      RSYNC=true
      ;;
    b)
      BRANCH_NAME=$OPTARG
      ;;
    ?)
      echo "  - 参数错误：./t.sh -b [branch name]"
      exit 1
      ;;
  esac
done

if [[ ! $BRANCH_NAME ]]; then
  echo "  - 缺少打包所在分支名称"
  exit 1
fi

if [[ $RSYNC == true ]]; then
  echo "  - do rsync!!!"
fi


#--------- Split Line ----------

getProp() {
  echo $2 | jq ".$1" | grep -o '[^"].*[^"]'
}

PKG=`cat ./package.json`
CONFIG=`cat ./config.json`

VERSION=`getProp version "$PKG"`
BASIC_PATH=`getProp basePath "$CONFIG"`

MODULES=$BASIC_PATH`getProp modules "$CONFIG"`
INDEX=$BASIC_PATH`getProp index "$CONFIG"`
ORGANIZATION=$BASIC_PATH`getProp organization "$CONFIG"`
POSITION=$BASIC_PATH`getProp position "$CONFIG"`

TARGET=$BASIC_PATH`getProp release "$CONFIG"`

echo -e "\\$GREEN  - 版本号：$VERSION\\$COLOR_END"
echo -e "\\$RED  - BASIC 路径：$BASIC_PATH\\$COLOR_END"
echo -e "\\$YELLOW  - Index 页路径：$INDEX\\$COLOR_END"
echo "  - Modules 路径：$MODULES"
echo "  - 组织管理路径：$ORGANIZATION"
echo "  - 打包路径：$TARGET"



# 检查目录
# ------------------------------

checkFolder() {
  if [ ! -d "$1" ]; then
    echo -e "\\$RED  !!! 没有找到 $2 项目地址：$1\\$COLOR_END"
    exit 1
  fi
}

checkFolder $MODULES 'Modules'



# 检查分支
# -----------------------------

checkBranch() {
  cd $2 && git fetch

  CURRENT_BRANCH=`git branch | awk '/^\*/{print $2}'`
  CHECKED_BRANCH=`git branch | grep -n "$BRANCH_NAME" | cut -d ' ' -f3`
  FLAG=false

  if [[ $CURRENT_BRANCH == $BRANCH_NAME ]]; then
    FLAG=true
  elif [[ $CHECKED_BRANCH ]]; then
    FLAG=true
    git checkout $BRANCH_NAME && git pull origin $BRANCH_NAME
  elif [[ `git branch -a | grep "$BRANCH_NAME"$` ]]; then
    FLAG=true
    git checkout -b $BRANCH_NAME remotes/origin/$BRANCH_NAME
  fi

  if [ "$FLAG" != true ]; then
    echo "  - $1 仓库不存在分支：$BRANCH_NAME"
    exit 1
  fi
}

# checkBranch "Modules" $MODULES
# checkBranch "Index" $INDEX
# checkBranch "Organization" $ORGANIZATION

# echo "  - check branches done."


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

# needBuildIndex=`confirmBuild "Index"`
# echo $needBuildIndex