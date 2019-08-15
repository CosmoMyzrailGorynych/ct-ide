![](https://img.shields.io/badge/license-GPL--3-informational?style=flat-square) ![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/ct-js/ct-js?label=version&style=flat-square) ![Travis (.org) branch](https://img.shields.io/travis/ct-js/ct-js/master?style=flat-square) ![Travis (.org) branch](https://img.shields.io/travis/ct-js/ct-js/develop?label=dev%20build&style=flat-square)

[![](https://img.shields.io/discord/490052958310891520?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/CggbPkb) ![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:to%20do?style=flat-square&label=todo%20issues) ![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:current%20release?style=flat-square&label=current%20release%20issues)
 ![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/help%20wanted?style=flat-square&label=help%20wanted)

Ct.js is a 2D game editor that makes its bet on good documentation, visual tools and smooth workflow.

For bugs, feature requests, developing questions, please use [GitHub issues](https://github.com/ct-js/ct-js/issues) so we can better track  them. For general support about making games, ask a question at our [discord server](https://discord.gg/CggbPkb).

# Repo structure & tools

* `app` — an [NW.js app](https://nwjs.io/), with its configs and static files.
* `src` — a source folder that compile into `/app` folder at a build time.
    * `js` — different top-level scripts, including 3rd-party libraries.
    * `pug` — HTML sources of editor's windows, written in [Pug](https://pugjs.org/).
    * `riotTags` — components that drive all the logic in ct.js. Written in [Pug](https://pugjs.org/) and [Riot.js v3](https://v3.riotjs.now.sh/).
    * `styl` — style sheets, written in [Stylus](http://stylus-lang.com/).
* `branding` — logos and icons belong here.
* `docs` — official docs of ct.js. Edit them [here](https://github.com/ct-js/docs.ctjs.rocks).
* `DragonBonesJS` — a dependency for enabling DragonBones' skeletal animation support in ct.js.
* `SSCD.js` — [a fork](https://github.com/CosmoMyzrailGorynych/SSCD.js) of a collision library for ct.place.

# Forking and installing the dev environment

Building ct.js requires [Node and npm](https://nodejs.org/en/download/) installed on your machine.

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

# Running ct.js from sources

```sh
gulp
```

# Releasing ct.js

```sh
# Builds docs and adds them to ct.js app
gulp docs
# Recompiles source files, bundles docs, and bakes binaries
gulp release

# Publishes prebuilt binaries to itch.io
# This assumes that you have an access to ct.js at itch.io :)
gulp deployOnly
gulp deployOnly --channel next # deploy to a specific itch.io channel

# Combines `gulp release` and `gulp deployOnly`
gulp deploy
```

The first run will be slow as it will download nw.js binaries. Next runs will use cached files.

# Naming conventions for commits

Use [Gitmoji-flavored Comigoji](https://comigo.gitlab.io/comigoji/#gitmoji) for naming your commits.