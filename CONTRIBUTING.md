I'm glad to see you there, mate 🎉 You are on a path of making a better world for game developers!

ct.js consists of several modules and repos, so make sure you post to a correct repo:

* If you found an error in docs, or would like to add a new tutorial, doc piece, or other improvements to docs.ctjs.rocks, then open an issue in [this repo](https://github.com/ct-js/docs.ctjs.rocks) instead.
* Similarly, if you want to contribute to the website ctjs.rocks, visit [this repository](https://github.com/ct-js/ct-js-site).
* If you have a question about programming games in ct.js, or have general questions, it is better to ask it on our [Discord server](https://discord.gg/CggbPkb), as you are more likely to get answers there faster ⚡

## Submitting an issue

Please select an appropriate template for an issue. Screenshots and reproduction steps will help us fix bugs quicker, so do take some pretty shots of… error messages :D A sample project will come in handy as well.

## Contributing by code

### Vision and general guidelines

ct.js aims to make learning programming fun and game development easy. In practice, it all breaks down into good pipelines, smooth workflow, high-quality docs, approachability of the engine, and a healthy community. So,

* If you are adding changes that make the workflow more complicated without any visible advantage, you are doing something wrong.
* New API or functionality that has no docs is **non-existent for users**. Do write docs. Tutorials and example projects are also cool.
* If possible, write tests. Until we don't come up with a better solution, write test projects in ct.js.

Make sure you comply to style guides — a uniform style is one of the necessities for a maintainable project! Use `gulp lint` to highlight code style issues locally.

Make your commits reasonably atomic, so you don't fix two or more bugs in one commit and such, so they can be reviewed easily and merged to the main branch quickly. They can also be picked for patching parallel versions, which is great.

> Use [Gitmoji-flavored Comigoji guide](https://comigo.gitlab.io/comigoji/#gitmoji) for naming your commits. One of its features is creating beautiful changelogs!

Before sending a merge request, make sure ct.js builds and lints successfully, meaning that commands `gulp build` and `gulp lint` run without errors. Name merge requests in the same fashion as commits.

If you have any problems, ask for help! Add `:construction:` to your pull request's name, link it to relevant issues, so you can get interest from other developers.