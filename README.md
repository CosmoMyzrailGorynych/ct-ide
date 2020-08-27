![](https://raw.githubusercontent.com/ct-js/ct-js/develop/branding/GithubHeader.png)

[![](https://img.shields.io/badge/license-MIT-informational?style=flat-square)](https://github.com/ct-js/ct-js/blob/develop/LICENSE) [![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/ct-js/ct-js?label=version&style=flat-square)](https://github.com/ct-js/ct-js/releases) [![Travis (.org) master branch](https://img.shields.io/travis/ct-js/ct-js/master?style=flat-square)](https://travis-ci.org/ct-js/ct-js/branches) [![Travis (.org) develop branch](https://img.shields.io/travis/ct-js/ct-js/develop?label=dev%20build&style=flat-square)](https://travis-ci.org/ct-js/ct-js)

[![](https://img.shields.io/discord/490052958310891520?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/CggbPkb) [![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:to%20do?style=flat-square&label=todo%20issues)](https://github.com/ct-js/ct-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22state%3Ato+do%22) [![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:current%20release?style=flat-square&label=current%20release%20issues)](https://github.com/ct-js/ct-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22state%3Acurrent+release%22)
 [![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/help%20wanted?style=flat-square&label=help%20wanted)](https://github.com/ct-js/ct-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

Ct.js is a 2D game editor that makes its bet on good documentation, visual tools and smooth workflow.

---

For bugs, feature requests, developing questions, please use [GitHub issues](https://github.com/ct-js/ct-js/issues) so we can better track  them. For general support about making games, ask a question at our [discord server](https://discord.gg/CggbPkb).

---

## Contributors needed!

Ct.js is a project maintained by CoMiGo, and programmed mainly by them as well, with little support from [dear contributors](https://github.com/ct-js/ct-js/graphs/contributors) and translators. And *it sucks!* Ct.js is a good game editor, but can be the best one, and one developer is not enough to transition it from a dream to a reality.

If you are willing to participate in ct.js' future, contact me at Discord (CoMiGo#7821) or Telegram (@CoMiGo). Or jump straightly to the [main dev board](https://github.com/orgs/ct-js/projects/1) for current issues.

## Support ct.js on product-hunting sites:

* [Like ct.js on AlternativeTo](https://alternativeto.net/software/ct-js/)
* [Rate ct.js on Slant in different questions](https://www.slant.co/options/30242/~ct-js-review)

# Production builds

See the [releases page](https://github.com/ct-js/ct-js/releases) or [jump to itch.io page](https://comigo.itch.io/ct). Available for Windows, Mac and Linux.

# Nightly builds

We have [daily builds at itch.io](https://comigo.itch.io/ct-nightly). This page will have nightly versions that are built from the `develop` branch from our repository. It means that you will get the latest features, improvement, bug fixes, and new bugs daily, out of the oven. [Itch.io app](https://itch.io/app) is strongly recommended.

# Repo structure & tools

* `app` — an [NW.js app](https://nwjs.io/), with its configs and static files.
    * `data`
        * `ct.release` — the ct.js game library, aka its "core"
        * `ct.libs` — catmods (modules) that ship with ct.js. Feel free to create a pull request with your module!
        * `i18n` — UI language schemes. Open for pull requests! :)
* `src` — a source folder that compile into `/app` folder at a build time.
    * `js` — different top-level scripts, including 3rd-party libraries.
    * `node_requires` — these are copied as is to the `/app` directory upon building ct.js, contain reusable code, and are meant to be used by `require('./data/node_requires/…')`.
    * `pug` — HTML sources of editor's windows, written in [Pug](https://pugjs.org/).
    * `riotTags` — components that drive all the logic in ct.js. Written in [Pug](https://pugjs.org/) and [Riot.js v3](https://v3.riotjs.now.sh/).
    * `styl` — style sheets, written in [Stylus](http://stylus-lang.com/).
* `branding` — logos and icons belong here.
* `docs` — official docs of ct.js. Edit them [here](https://github.com/ct-js/docs.ctjs.rocks).
* `DragonBonesJS` — a dependency for enabling DragonBones' skeletal animation support in ct.js.
* `SSCD.js` — [a fork](https://github.com/CosmoMyzrailGorynych/SSCD.js) of a collision library for ct.place.

# Developing ct.js

## Planning

See the [main dev board](https://github.com/orgs/ct-js/projects/1) for hot issues and plans for next releases. Prioritize the "Current release" column, then "To Do", then "Backlog", though if you really want a feature from a backlog to come true right here, right now, no one can stop you :)

Please leave a comment in issues you want to work on so that we can assign you to them and avoid occasional double work from several contributors.

## Forking and installing the dev environment

Building ct.js requires [Node and npm](https://nodejs.org/en/download/) installed on your machine.

```sh
git clone https://github.com/ct-js/ct-js.git ctjs
cd ./ctjs
npm install gulp-cli -g
npm install
gulp -f devSetup.gulpfile.js
```

## Running ct.js from sources

```sh
gulp
```

VSCode can use [this extension](https://marketplace.visualstudio.com/items?itemName=ruakr.vsc-nwjs) to run ct.js with an attached debugger. Use `gulp dev` instead of just `gulp` to run a dev service with live-reloading without opening ct.js in its default manner.

## Releasing ct.js

This is left for emergencies only, as Travis should prepare binaries for github and send them to itch.io as well

```sh
# Builds docs and adds them to ct.js app
gulp docs
# Recompiles source files, bundles docs, and bakes binaries
gulp packages

# Publishes prebuilt binaries to itch.io
# This assumes that you have an access to ct.js at itch.io :)
gulp deployOnly
gulp deployOnly --channel next # deploy to a specific itch.io channel

# Combines `gulp packages` and `gulp deployOnly`
gulp deploy
```

The first run will be slow as it will download nw.js binaries. Next runs will use cached files.

## Naming conventions for commits

Use [Gitmoji-flavored Comigoji](https://comigo.gitlab.io/comigoji/#gitmoji) for naming your commits.
