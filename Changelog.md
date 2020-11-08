*Sun Nov 08 2020*

### ✨ New Features

* "Visible" checkbox at a type editor
* A toggle at room's settings to set a room as a UI layer
* Add `silent` option for ct.tween.add to suppress errors on non-vital animations
* Add a main menu entry to change data folder (Closes #238)
* Add basic Discord Rich Presence
* Add diamond-like partitioning for caching tile layers (`ct.tilemaps.cacheDiamond`)
* Add high-contrast black theme
* Add histogram, pessimistic and optimistic methods to `ct.random` catmod
* Add minify, obfuscate, and function wrap transforms for exports (#242 by @naturecodevoid)
* Add `storage` catmod
* Check for ct.js folder write permissions, and show a prompt when it is not writable
* `ct.backgrounds` API
* `ct.camera.contains` to check whether a copy (or another displayable object) is potentially visible on a screen
* `ct.noise` module for seeded Perlin and Simplex noise funcitons, useful for freeform procedural level generation.
* `ct.splashscreen` module (Closes #148)
* `ct.tilemaps` API
* `ct.types.isCopy(obj)` method to check whether a variable is a copy
* `ct.u.hexToPixi`, `ct.u.pixiToHex`
* F11 to toggle fullscreen
* Forest UI theme — an adaptation of https://github.com/sainnhe/forest-night-vscode by @sainnhe
* Jump to a texture from texture inputs
* Solid color fills and cross drawing at placeholder texture generator
* Specify multiple video formats at `ct.cutscene`
* Table inputs for modules — they allow users to create collections of complex objects with specified structure, readable in a module as an array
* Tracing methods for ct.place (Closes #232, #117)

### ⚡️ General Improvements

* Add preventive checks to `ct.sound.howler` to not throw errors if one tries to manipulate stopped/non-existent sound
* Add typings for `Room.uid` property
* Allow media access, pointerLock API, and download prompts for games inside the built-in debugger. Makes `ct.capture` work inside this debugger.
* Autocompletions for `ct.rooms.list`
* `Background.isUi` is now read-only and is calculated based on its parent's value. Fixes alignment issues for backgrounds that are added to UI layers.
* Controls for texture shape are working similarly to curve editors now: you can press in the middle of a line segment and drag out a new point, and delete points with right click
* `ct.res.getTexture('Name', null)` now returns the whole animation
* Foreign key unwrapping support for modules' settings and injections, plus recursive unwrapping for arrays
* Improve workflow for creating new theme, generalize theme-related code as a node-require module "themes".
* Put additional bleeding on transition's sides from `ct.transition` to mitigate rendering issues due to rounding
* Refurbish project selector and add Examples tab
* Refurbish the exporter
* Return copies in `ct.place.moveByAxes`. Fix issues with type definitions.
* Textures: Pressing Fill + To Center now produces the same result as To Center + Fill.
* Tweak typings for `ct.place`
* Vertical and horizontal lines in curve editors display more reliably

### 🐛 Bug Fixes

* Add a translation key to the english file, for Horizon theme
* At the room editor, fix eraser's size not falling back to some constant if a grid was disabled
* Don't show a context menu when right-clicking on curve points
* Fix a bug with replacement of `$'`, `$&` and other special RegExp tokens in injections and user-provided code
* Fix a memory leak that made the whole old IDE set not being freed on project change
* Fix a stupid issue with `ct.capture`
* Fix an issue about a timer not being destroyed if a game switched to a room with the same name (restarted a room).
* Fix broken `ct.camera` typings
* Fix `Camera.getBoundingBox`
* Fix horrible memory leak at `debugger-screen-embedded`
* Fix image transforms for thumbnails
* Fix issues with font loading if the project's full path contain spaces
* Fix issues with non-repeating UI backgrounds
* Fix subsequent `pause` calls on an emitter breaking this emitter entirely
* Fix `themeSpringSream` in Brazilian Protuguese translation file
* Fix typings for `ct.sound.follow`
* Fix usage of `viewWidth`/`viewHeight` in catmods
* Fix wrong default folder for the starting project selector
* Focused buttons should be highlighted
* I don't know what it was, but it is fixed
* Initialize `ct.mouse.x`, `ct.mouse.y`, and `ct.mouse.xui`, `ct.mouse.yui` with zero values.
* `SpringSream` -> `SpringStream` at i18n files
* Submenus should not disappear if their elements are focused by pressing Tab button
* Trim whitespace while creating new projects to avoid problems with build tools and sticky situations because of invisible symbols
* Type's name should change from default to texture name after texture selection
* Zero parallax value should be a valid one

### 🍱 Demos, Dependencies and Stuff

* Add a MoveBlocks example
* Add a DungeonCrawler example

### 📝 Docs

* :bug: Add missing part to platformer tutorial
* :bug: Explicitly note the removal of `this.move()` at platformer's robot character (Closes #33)
* :zap: Add gifs that explain how `ct.camera.realign(room)` works (Closes #21)
* :zap: Clarification for `ct.types.copy` (Closes #32)
* :zap: Rename properties at the platformer tutorial to standard names
* Format method names in `ct.place` docs. It looks better this way.

### 🌐 Website

* :zap: Update changelog

### 👽 Misc

* :fire: Remove ancient image files that are no longer used by ct.IDE

