GREEN=\033[32m
COLOR_END=\033[0m
SERVER_SIDE=false

while getopts "ht:s" opt; do
  case $opt in
    h)
      echo "./ci.sh -t [test / prod]"
      exit 0
      ;;
    t)
      RTYPE=$OPTARG
      ;;
    s)
      SERVER_SIDE=true
      ;;
    ?)
      echo -e "  参数错误：./ci.sh -t [test / prod]"
      exit 1
      ;;
  esac
done


VERSION=`cat ./package.json | grep -n \"version\" | cut -d ' ' -f4 | grep -o '[^"].*[^",]'`
MSG="production release"
SERVER="alan@fe.tai9.org:/home/alan/projects/hrms"
DIST="production"
ZIP=$RTYPE.$VERSION.zip


if [[ $RTYPE == "test" ]]; then
  MSG="testing release"
  DIST="testing"
fi

if [[ $SERVER_SIDE == true ]]; then
  mkdir -p tmp
  rsync -aP $SERVER/$DIST/modules/* tmp
  rsync -aP $SERVER/$DIST/index/* tmp
  rsync -aP $SERVER/$DIST/organization/* tmp
  rsync -aP $SERVER/$DIST/position/* tmp
  rsync -aP $SERVER/$DIST/employee/* tmp
  rsync -aP $SERVER/$DIST/settings/* tmp
  grep "{{version}}" -R ./tmp/* | awk -F":" '{print $1}' | xargs sed -i '' -e "s/{{version}}/$VERSION/g"

  cd ./tmp
  zip -q -r $ZIP ./* -r
  echo -e "\\$GREEN !! zip completed.\\$COLOR_END"
  rsync -aP $ZIP $SERVER/release/$DIST
elif [[ $RTYPE == "prod" ]]; then
  bump --prompt --commit "$MSG" --tag --push
elif [[ $RTYPE == "test" ]]; then
  bump --prompt --commit "$MSG" --push
fi