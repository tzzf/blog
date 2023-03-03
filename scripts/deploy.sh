# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

cp googlec22ceb3107cf5e3e.html ./docs/.vuepress/dist
cp ads.txt ./docs/.vuepress/dist
cp CNAME ./docs/.vuepress/dist

# 进入生成的文件夹
cd docs/.vuepress/dist


# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git checkout -b master

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:tzzf/tzzf.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -