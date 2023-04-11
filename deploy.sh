set -e

date=$(date +%Y%m%d)
datetime=$(date +%Y%m%d%H)
echo "\033[33;1m$(date '+%Y-%m-%d %H:%M:%S')\033[0m\033[34;1m 构建$1包程序开始...\033[0m"
npm run build

[ $1 == "test" ] && {
  zip -r test-vue3-dist.zip ./dist
}
[ $1 == "prod" ] && {
  zip -r prod-$date-dist.zip ./dist
}