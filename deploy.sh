#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e


# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://.github.io  USERNAME=你的用户名 
git push -f https://github.com/Dujishi/blog.git master

# 如果发布到 https://.github.io/  REPO=github上的项目
# git push -f git@github.com:/.git master:gh-pages

cd -