![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/ct-js/ct-js?label=version&style=flat-square) ![](https://img.shields.io/badge/license-GPL--3-informational?style=flat-square) [![](https://img.shields.io/discord/490052958310891520?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/CggbPkb)
![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:to%20do?style=flat-square&label=todo%20issues) ![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:current%20release?style=flat-square&label=current%20release%20issues)
 ![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/help%20wanted?style=flat-square&label=help%20wanted)

Ct.js is a 2D game editor that makes its bet on good documentation, visual tools and smooth workflow.

For general support, ask a question at our [discord server](https://discord.gg/CggbPkb).

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
gulp deploy # combines `gulp release` and `gulp deployOnly`
gulp deployOnly --channel next # deploy to a specific itch.io channel
```

The first run will be slow as it will download nw.js binaries. Next runs will use cached files.

# Naming conventions for commits

Use [Gitmoji-flavored Comigoji](https://comigo.gitlab.io/comigoji/#gitmoji) for naming your commits.