# How to set up

```sh
git clone git@gitlab.com:CoMiGo/ctjs.git ctjs
cd ./ctjs
git submodule update --init --recursive
npm install gulp-cli -g
npm install
cd ./docs
npm install
cd ./../app
npm install
cd ./../
```

# How to run

```sh
gulp
```

# Builds and publishing

```sh
gulp docs # to build docs site and add it to ct.js app
gulp release # to recompile source files, bundle docs, and to make binaries
gulp deployOnly # publishes prebuilt binaries to itch.io
gulp deploy # combines `gulp build` and `gulp deployOnly`
gulp deployOnly --channel next # deploy to a specific itch.io channel
```

The first run will be slow as it will download nw.js binaries. Next runs will use cached files.

# Naming conventions for commits

Make commits reasonably atomic.

Use [Gitmoji](https://gitmoji.carloscuesta.me/) and imperative mood, e.g. `:zap: Improve graphics import performance`. You can use more than one emoji if it falls into two categories at once.