cd ./docs
hexo generate
cp -r -v ./public/. ./../app/docs/
cp -v ./jquery-3.2.1.min.js ./../app/docs/
cp -v ./lunr.min.js ./../app/docs/
cd ./../