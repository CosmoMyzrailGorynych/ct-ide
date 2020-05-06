## v1.3.0

*Wed May 06 2020*

### ✨ New Features

* :globe_with_meridians: Add a Chinese Simplified translation (#164 by @emaoshushu)
* :globe_with_meridians: Add a Polish translation by Voltinus from Discord :tada:
* :globe_with_meridians: Add Dutch language to IDE (#182 by @BartInTheField)
* Add a "troubleshooting" submenu to main ct.js menu
* Add a `reset()` method to CtAction
* Add `ct.deltaUi` for steady UI animations at slowmo effects
* Add `ct.gamepad` module, made by collective efforts from @leedigital, SN from Discord, and Comigo
* Add touch controls for catformer and catsteroids (#178 by @naturecodevoid)
* Allow to set depth through extensions in `ct.types.copy` fourth parameter
* An onboarding screen when creating a new project
* Catmods can now express their dependencies on other mods with `dependencies` and `optionalDependencies` fields
* Configure texture's padding to avoid bleeding artifacts on strongly scaled textures
* `ct.camera`, UI and game coordinates, and nested rooms
* `ct.fs` - a module for working with files and game saves
* `ct.transitions` for nice and smooth transitions in your game!
* `ct.types.exists` to check whether a given copy exists in game's world
* `ct.timer` (#179 by @naturecodevoid)
* Dark theme support in docs panel
* Favicons and customizable loader for your games, at your project's Settings tab
* New injection for catmods — `rooms.js`
* Particle systems, yaaay! :tada:
* Reorder scripts at your project's Settings tab (#181 by @naturecodevoid)
* Rotate copies in the room editor through a context menu
* Stretch debugger's console and flip its layout
* The sidebar in the room editor is now resizeable
* UI scale in ct.IDE (#180 by @naturecodevoid, see it in the hamburger menu > Settings)

### ⚡️ General Improvements

* :globe_with_meridians: Update Debug and Russian translation files
* :globe_with_meridians: Update French translation (#176 by @FoobarIT)
* :globe_with_meridians: Update German translation (#153 and #172 by @Wend1go)
* `ct.flow`, `ct.u.wait`, `ct.tween` now operate based on ct.delta, with optional ct.deltaUi mode (#179 by @naturecodevoid)
* Add a bit of logic to reset crop size on single-frame textures
* Add a spacer between "Image's center" and "Isometrify" buttons in the texture editor
* Add home-brewed i18n coverage reports and language file checkers to CI
* Add simple typings for `window` and `document`
* Add typings for `ct.rooms.list`
* Change cursor to "progress" state when exporting a project
* Export games as electron app. Bonus: new supported architectures! :sparkles:
* Forbid building for Mac from Windows, because Windows is shit
* Improve error message with broken TTF fonts
* Improve typings for `Copy.tex`
* Improve typings for `ct.camera`
* Lay out language menu in two columns
* Remove the extra border at a room's script editor
* Remove unnecessary update after a skeleton was imported
* Replace icons for rooms and textures
* Run some tasks of the exporter in parallel, shortening the time it takes to compile your games
* Set starting mode for desktop games: windowed, fullscreen, or maximized
* Store projects in YAML format: better conflict resolving in git and more human-readable source files
* Types now automatically rename to the name of a picked sprite
* UI: Add a margin to the "Settings" header on the same-called tab
* Update `ct.vkeys` to work with the new UI coordinate system
* Update typings for `ct.tween`
* Variables defined in scripts at the settings tab are now visible by code editors. No more red squiggles!

### 🐛 Bug Fixes

* Add missing typings for sessionStorage and localStorage, that are needed for saving game data in a browser
* Add missing typings for xstart and ystart in copies
* Add the missing `depth` property of the `Copy` class
* Add the missing typing for `ct.rooms.current`
* Ensure that "includes" folder exists when opening it through the main menu, as it may be absent, e.g. after pulling a new project from a git repo
* Fix 3D sounds of `sound.howler`
* Fix a case when `this.kill` is applied to backgrounds or tilesets and ct.js can't delete them
* Fix broken button that moves all copies in a room editor
* Fix broken ct.mouse `Wheel` input
* Fix context menu in the Fonts section > "rename" command doing nothing
* Fix issues with re-imported textures
* Fix OnDestroy not always being called on copies that got deleted because of others' OnDestroy code
* Fix shadow style on notepad panel on dark themes
* Fix style issues at html.js
* Fix the bug when importing a module if it does not contain a parent directory (#157 by @leedigital)
* Fix the incorrect typing for `ct.speed`
* In `ct.touch`, mouse clicks should trigger `Any`, `Double`, `Triple` inputs
* Prevent images in a room's type picker from dragging
* Remove extra border at the top of type's code editor
* Show imported fonts immediately
* Update ct.fittoscreen to work with high density screens

### 🍱 Demos and Stuff

* Add full JettyCat example
* High-quality textures for Memocats
* Improvements of examples
* Pull the latest docs
* Refurbish Catsteroids example: add a boss battle, new bonus, and new graphics
* Update Yarn Spinner example

### 📝 Docs

* :sparkles: New tutorial: JettyCat
* Indent the warning about shape optimizations in `ct.place.tile`
* Add a link to Discord server at the issue creating screen
* Add missing quotation mark in mouse catmod changelog (#173 by @Wend1go)
* Fix "optionable" in docs for `ct.transition`

### 🌻 Misc

* :fire: Remove ct.libs property from exported games


## v 1.2.1

*Tue Nov 26 2019*

### 🐛 Bug Fixes

*  ct.IDE should use pixi.js-legacy internally as well, otherwise style editor breaks everything

## v 1.2.0

*Tue Nov 26 2019*

### ✨ New Features

* A new, better code editor with live type checks, built-in doc popups, and more!
* Add a render option to include a legacy renderer for older browsers
* Choose a custom folder for a project when creating it (#138 by @leedigital)
* Hotkeys for most tabs and resource creation
* Import modules from a *.zip file, in the Catmods tab (#142 by @leedigital)
* Patreon screen
* Resize the viewport with ct.width and ct.height
* Show/Hide the mouse cursor with ct.mouse.show, ct.mouse.hide (#143 by @Wend1go)

### ⚡️ General Improvements

* Add a `finally` method for cutscene's promise-like objects
* Add patreon translation to German (#140 by @Wend1go)
* Allow to change ct.fittoscreen's scaling mode at game's runtime
* Create dummy typedefs for modules that don't provide them

### 🐛 Bug Fixes

* An asset should not be allowed to apply if it has an already occupied name
* Fix broken zipped projects on windows
* Fix multiple tiles not being placed while the Shift key is pressed
* Fix non-working export settings on really old projects
* Show proper error message when switching to a non-existent room (#144 by @Wend1go)
* Update DragonBones and fix issues with skeleton import

### 🍱 Demos and Stuff

* Add typedefs for `ct.tween`
* Add typings for `ct.cutscene`
* Add typings for `ct.random`
* Add typings for `ct.vkeys`
* Complete typings for `ct.eqs`
* Typedefs for `ct.flow`
* Typedefs for `ct.touch`
* Typedefs for `ct.yarn`
* Typings for `ct.fittoscreen`
* Typings for `ct.sprite`

### 📝 Docs

*  Document `ct.width` and `ct.height`
* :bug: Fix mistakes in `ct.eqs`' docs
* :sparkles: Complete translation of Pt-BR docs
* :zap: Add a clarification to the second variant of a platform's code at tut-making-platformer
* :zap: Document the process of adding typedefs for modules
* :zap: Update tut-making-platformer.md (by @Eilandis)

### 🌐 Website

* :bug: Fix a link to site's code license in the footer
* :bug: Fix emojis in 1.1.0 changelog entry
* :bug: Fix links in reusable stuff
* :sparkles: A proper language selector
* :sparkles: PT-BR translation on ct.js-site (by @GumpFlash)
* :zap: Add a translated contact form for Russian locale
* :zap: Better adaptivity
* :zap: Better handling of optionally translated pages
* :zap: Make the page "made with ct.js" dynamic and based on itch.io engine page
* :zap: Tons of improvements here and there
* :zap: Tons of new icons

## v 1.1.0

*15 October 2019*

### ✨ New Features

* Add a debug mode to ct.place (you can find it in the settings tab)
* texture-editor: Add the Symmetry tool for polygonal shapes (by @schadocalex)
* Add Iosevka as a default typeface for code, allow setting your own typeface, control line height and ligatures
* Open the `includes` folder from the hamburger menu
* Support for nested copies (#127) by @schadocalex
* Support for Yarn (a tool for making dialogues and interactive fiction), powered by bondage.js
* texture-editor: Directly add/remove shape points on texture with your mouse. Add a point by clicking on the yellow line segments, delete points by clicking on them (by @schadocalex)

### ⚡️ General Improvements

* Add Pt-Br translation of UI by Folha de SP from Discord
* Better checkboxes, radio inputs, and other fields
* Better styling of inline code fragments in the modules panel
* Better texture-editor layout
* Better, more readeable tables in module's docs
* Change Horizon colors a bit to make it more pleasant to look at
* Highlight code blocks at modules panel
* Improve texture packing
* Make module list and their details scroll independently
* Remove excess borders in nested views
* Remove excess borders on module panels
* Remove old language keys, add Comments.json, Debug.json
* Rename "Is tiled" property of textures to "Use as background", hide splitting tools if used as background
* texture-editor: Make the axis handle squared (by @schadocalex)
* texture-editor: Zooming in/out now works when scrolling outside the texture as well (by @schadocalex)
* Tiny UI improvements, here and there

### 🐛 Bug Fixes

* :pencil: Replace Lato's license with Open Sans', as we don't use Lato
* Color inputs should show white value on a dark background from the very start
* Fix broken style editor
* Fix numerous collision problems that appeared with rotated entities
* Fix the checkbox "close the shape", as it didn't change the actual state before
* Stop chromium from messing up with color profiles and colors in ct.js

### 🍱 Demos and Stuff

* Add a Yarn demo

### 📝 Docs

* Document the `alpha` property of copies
* :zap: Update Troubleshooting — teared backgrounds
* :bug: Update tut-making-shooter.md
* Pt-Br translation :tada:

### 🌐 Website

* :bug: Fix an outdated link to downloads in the header
* :sparkles: Add partial Russian translation
* :zap: Align social icons at the footer to the right


## v 1.0.2

*25 September 2019.*

### 🐛 Bug fixes

* Fix broken desktop export, as well as uncatched errors
* Fix textures' "frame count" property not working (#120) by @island205 🎉
* Update parameter names in ct.sprite's readme

### ⚡ General improvements

* Add support for OGG audio files

### Docs

* 🐛 Fix the use of ct.height in Making Shooter tutorial when ct.viewHeight is needed
* ⚡ Change the title of "Troubleshooting: Background splits into squares!" so that it covers tiles as well
* Add a page "Troubleshooting: Sounds don't play at game start!"
* Document `ct.u.degToRad`, `ct.u.radToDeg`
* Document `ct.u.rotate`, `ct.u.rotateRad`


## v 1.0.1

*5 September 2019.*

### 🐛 Bug Fixes

* Fix the broken sound import
* Fix improper movement of vertically repeating backgrounds
* Add actions to new projects. Fixes the issue with "project.actions are not iterable"

### ⚡ General improvements

* Update Open Sans font, so it supports extended Latin characters

### 🐙 Misc

* Remove the deprecated copies' method `this.draw`

## v 1.0.0

*1 September 2019.*

### 🐛 Bug Fixes

* Debugger should never run in fullscreen mode
* Fix broken packages for MacOS
* Fix MacOS access issues
* Fix `ct.sound.globalVolume` method
* Fix Ctrl-plus and Ctrl-minus hotkeys on code editors
* Fix improper archives generated by "export to zip" command
* Fix migration code that was re-applied on already updated/newly created projects
* Fix module settings panel not working for modules with dots in their name
* Fix security issues in npm packages
* Fix unstable movement under different FPS in the Catformer example

### 📝 Docs

* Add an entry about pausing a game, in "Tips & tricks"
* Document `ct.sound.spawn` options for `ct.sound.howler`
* Make a vague description of `ct.sound.howler` use relative to `ct.sound` more clear
* Fix links that led to a now deprecated name of `PIXI.AnimatedSprite`

### 🍱 Examples & Demos

* Add a scale-in animation to cards in Memocats example
* Refresh Catformer project file

### ⚡ General improvements

* Add a parameter for `ct.touch.hovers` to ease handling touchend (touch release) events.
* Add a party carrot to the "new version available" notice at the starting screen
* Add `ct.delta` to code completions
* Add `ct.touch.enabled` property to determine whether a device is using touch events
* Better alignment of the project selector
* Better highlighting of paired brackets, by @qualitymanifest
* Better QR code legibility on dark themes in the integrated debugger
* Catch the case of `mouse.legacy` with manually updated projects made in a dev version between next-2 and next-3
* `ct.sound.howler`: Update `howler.js` to v2.1.2
* Enable local code completions
* Make ct.js message in console even prettier
* Update PIXI to v5
* Set a max width to a project selector, so that it is usable on smaler screens

### 🌐 Internationalization

* Add a German translation by Wend1go from GitHub.
* Add a Spanish translation by FoxamStudios (Stunx from Discord).
* Add a Romanian translation by andithemudkip aka ((andi)) from Discord.

Nice work, mates!

### ✨ New Features

* Add a `ct.cutscene` module
* Add a setting control to support retina screens
* Add a settings field for max FPS
* Add an ability to set a custom font for code editors, currently by devtools only with `localStorage.fontFamily = '...'`
* Add `ct.flow` module for easier asynchronous flow control
* Add `ct.u.degToRad`, `ct.u.radToDeg`
* Add virtual joysticks to `ct.vkeys`
* Control the rate of sounds at ct.sound.spawn
* Horizon UI theme
* Spacial plugin for Howler.js: add 3D sounds to the ct.sound.howler module
* Support `ct.touch` module in `ct.vkeys`
* Update `ct.touch` to v2.0.0: support for Actions system, pinch, rotation and panning gestures


## v 1.0.0-next-3

*1 April 2019. Not a joke.*

### ✨ New Features

* Introduce Actions — a new unified system for any input methods

### ⚡ General Improvements

* Add a pool for killed copies to limit garbage collection calls
* Remove non-existent modules from a project, if there are such

### 🍱 Demos and Modules

* Add keyboard.polyfill for IE and old browsers. Enable it by default in new projects
* Update demos and tutorials

### 🐛 Bug Fixes

* Bundle scripts of catmods on one level with ct.js (this solves issues with itch.io and GameJolt games)
* Clarify a cryptic error that appears if one provides a non-existing type name to `ct.types.copy`
* Clear input value to be able to reselect the same font
* Display a catmod's license on the "Info" tab
* Fix a font not showing up after being renamed
* Fix an issue when you can't import the same texture twice in a row
* Fix ct.mouse.down not working
* Fix ct.room.followDrift overshooting on low values and low FPS
* Fix ct.touch that used `ct.width` and `ct.height` instead of `ct.viewWidth` and `ct.viewHeight`, resulting in incorrect coordinates on some scaling methods
* Fix ct.u.ext not returning the extended object
* Fix flawed `this.xprev`, `this.yprev` handling in ct as it is and in ct.place
* Fix UI problems of font deletion
* Fix importing font on Windows
* Fix mouse coordinates not updating on view shift (in-game)
* Fix non-working "Open" options in context menus for rooms, sounds and textures
* Fix wrong calculation of rotated rects in ct.place, that turned rectangles into points
* Prevent unwanted name change when importing a sound
* Remove this.updateList(); call that caused a UI update error after deleting a font
* Update ace.js autocomplete list
* Update graphics, sounds, rooms panels after opening a project from a hamburger menu
* Update shape and anchor of a copy while changing a texture
* Update the type picker in the room editor after deleting a type
* Refresh the preview immediately when activating fill and selecting diffuse in a style

### 💄 UI Improvements

* 🎨 Rename "graphic assets" into "Textures"
* Add a zoom control to graphics editor
* Add an icon in the module info that shows that a module provides additional input methods

### 📝 Docs & Tutorials

* Add an example to ct.inputs.addAction
* Document actions and ct.inputs
* Document ct.sound.playing
* Document ct.vkeys
* Document the way of adding new input methods with catmods
* Fix `ct.keyboard.clear();` docs
* Provide docs for the new ct.mouse
* Rename "Graphic assets" into "Textures"
* Tons of minor fixes in tut-making-platformer
* Update Platformer_tutorial
* Update Space Shooter tutorial
* ⚡️ Add a link to ct.u that shows a difference between a shallow and a deep copy
* ⚡️ Clarify ct.u.unlerp
* ⚡️ Minor fixes and clarifications at Making Space Shooter tutorial
* ⬆️ Update vuepress to 1.0@next
* 🌐 Add ct.md for Ru locale
* 🌐 Add readme.md and tut-making-platformer for RU locale
* 🌐 Translate "Making Space Shooter" tutorial to Russian
* 🌐 Translate catmoddocs.md to Ru
* 🌐 Translate ct.inputs.md to Ru locale
* 🌐 Translate ct.res.md to Ru locale
* 🌐 Translate ct.rooms.md to Ru locale
* 🌐 Translate ct.sound.md to Ru locale
* 🌐 Translate ct.styles.md to Ru locale
* 🌐 Translate ct.types.md to Ru locale
* 🌐 Translate ct.u.md to Ru locale
* 🐛 Move a note about event sequence and `this.kill` to the right place at ct.types.md
* 🐛 Update ct.md to reflect v1.0
* 🐛 Update ct.res.md
* 🐛 Update description of ct.rooms.switch
* 💥 Remove ct.mouse. Document the change in the migration guide.

### 👽 Misc

* ⌛ Provide docs for ct.mouse.legacy
* ⌛ Add a legacy version of ct.keyboard
* ⌛ Connect legacy versions of ct.keyboard and ct.mouse to older projects
* ✏ A typo in autocompletion: ct.types.addSpeed has (copy, speed, dir) parameters
* 🍎 Add long-press menus for Mac

## v 1.0.0-next-2

*28 January 2019*

### ✨ New Features

* Add `ct.room.followShiftY`, `ct.room.followShiftX`
* Add a `ct.place.moveAlong` method that allows for continuous movement in a given direction.
* Add horizontally and non-repeating backgrounds to rooms
* Add support for complex collision shapes
* Add support for DragonBones skeletal animation
* Catmods: add a 'radio' input type
* Catmods: define additional fields in the type editor
* ct.place: Add `this.moveContinuous` to all copies
* Multiple copy editing in room editor
* Repeat-x, repeat-y and no-repeat options for backgrounds

### ⚡ General Improvements

* Add a `multiple` flag to ct.place.occupied, ct.place.meet that allows to get all the copies that participated in collision.
* 💄 (x,y) position of the mouse in the room editor.
* 💄 Add an HTML/CSS preloader to exported games
* 💄 Add "Recent Projects" to the hamburger menu
* 💄 Add an ability to forget projects in the "Recent Projects" list
* Add `ct.place`, `ct.fittoscreen`, `ct.keyboard`, `ct.sound.howler` and `ct.akatemplate` by default to all the new projects
* Add `ct.sound.exists` method
* Add support for sound events in DragonBones skeletons
* Allow to set an empty sprite to a copy by changing `this.graph = -1;`
* `ct.place`: add a ctype input to type editors
* Introduce `ct.viewWidth`, `ct.viewHeight`.
* Make backgrounds resilient to missing extends
* Remember window position on load (ct.IDE)
* Update `ct.place`
* Update fittoscreen to v2.0: add more scaling methods for fine quality at a wide variety of resolutions
* ⬆ Update Pixi.js to v4.8.5

### 💄 UI Improvements

* ⚡ Autofocus code editors on tab change
* ⚡ Make text and code in module panel selectable
* Add nifty sounds to notifications
* Crop long paths to recent projects on the left side
* Show a message about where the project and the exported version were zipped, because some systems (e.g. Windows 10) don't show the files in file managers

### 🐛 Bug Fixes

* 💄 Add a "cancel" button while selecting a tileset
* Fix desktop exporter not picking the first room as the starting one if no room was marked as such
* Fix exporter for desktop platforms
* Fix parallax + non-repeat background behaviour
* Fix project loader not loading the most old ct.js projects
* Fix unwanted interpolation on stretched sprites if "Disable image smoothing..." is checked
* Remove autosave errors in dev console that appeared while no project was loaded

### 🍱 Demos and Stuff

* Update catformer demo to v1.0.0-next-2
* Update demos and examples

### 📝 Docs

* Add a deprecation notice to `ct.place.legacy`
* Add a notice about dragonBones animation events
* Add tips & tricks for effective viewport management
* Document new catmods' capabilities
* Document the import process and usage of skeletal animations
* Document `this.moveContinuous` at ct.place readme
* Finish JS Intro, pt 2
* Fix flipped directions in a tip at https://docs.ctjs.rocks/tut-making-shooter.html#moving-hostiles-and-asteroids
* Rename `ct.place.go` attribute `speed` to `length`
* Update tutorials to v1.0.0-next-2


### 📄 License

* Add a ct.js version with website link to console output
* Add SSCD license
* Adding a Pixi.js license (3rd-party)
* Formatting license, adding a Termination section
* License: Add DragonBonesJS license (3rdparty)

### 👽 Misc

* 🌐 Add a link for crowd-sourced translations
* 🌐 Add a partial French translations by Vactro
* ⁉ Add `./` to all resource paths to load, because itch.io
* 💩 Bump ct.keyboard version to v2.0.0, because it should have beeen bumped before.
* 🔥 Remove ffmpeg-node for now
* 🔥 Remove vkontakte link in the starting screen, because I no longer use vkontakte
* 🚚 Rename old `place` module to `place.legacy`

## v 1.0.0-next-1

*1 December 2018*

### ✨ New Features

* ⚡ WebGL Renderer
* ⚡ Ctrl+S and autosave/recovery feature
* ⚡ Additional fields for backgrounds: movement, shifting, parallax and scaling

### 💄 UI Improvements

* ⚡ Show axis in graph editor
* ⚡ Make graphic selection in type and room editors for backgrounds cancellable

### 🐛 Bug Fixes

* Fix memory leak when updating room with opened backgrounds tab
* Fix memory leak on room switch in ct.place
* Fix color pickers not returning their intermediate values to editors

### 🍱 Demos and Stuff

* Update example projects to v1.0-next-1

### 🔥 Removed

* Remove ct.draw.patch, ct.canvas

### 📝 Docs

* Add a migration guide
* Add a note about tearing backgrounds when they are not marked as "Tiled"
* Update Space Shooter tutorial
* Update Platformer tutorial
* 💥 Write docs for new ct.styles

### 📄 License

* Add nw-builder license notice (3rd party)

### 👽 Misc

* ✏️ Add 'A' to the font editor
* ✏️ Fixing minor issues in Russian localization file
* 💥 Changing ct.styles API to work with Pixi.js
* 💥 Repurpose styles editor to making pixi's TextStyle

## v 0.5.1

*7 November 2018*

### 🐛 Bug Fixes

* Fix autocompletion being triggered on `;` and line end
* Fix project update for older versions not working
* Fix ct.place.tile moving copies around by itself

### 🍱 Demos

* Update tutorials' project version

## v 0.5.1

*30 October 2018*

### 🐛 Bug Fixes

* Fix missing fields in newly created projects.


## v 0.5.0

*27 October 2018*

### ⚡ General Improvements

*  Add a /\*%commented%\*/ format for modules' configurable fields, as an alternative to the %standard% one.
*  Improvements to ct.place: greatly improve speed for ct.place.occupied, ct.place.free, ct.place.meet, ct.place.tile. Make x and y parameters in most functions optional. The new variant is now preferred (e.g. ct.place.occupied(this, 'Solid'); )
* Little performance optimizations for drawing
*  Make a small transition to a prototype-based system. Introduce `this.draw`, `this.move` and `this.addSpeed` calls on copies.
* More zoom levels in the room editor
* Refactor ct.types, move actual types to ct.types.templates
* Reuse of metadata in ct.js and exported projects

### ✨ New Features

* Add a font manager
* Add a Reimport button to imported graphics assets
* Add ct.js autocompletions for code editors
* Add ct.u.deltaDir, ct.u.lerp, ct.u.unlerp, ct.u.clamp, and ct.u.inspect
* Add multi-selection for tiles

### 🐛 Bug Fixes

* Fix ct.place.nearest and ct.place.furthest
* Fix drawing copies with graphics offsets in the room editor
* Fix incorrect export of tilesets with non-square grids

### 📝 Docs

* Add a notice about location of catmods' docs
* Visually better tips in tutorials and minor changes

### ⚗ Experimental

* Add ct.eqs and ct.victoria catmods
* Project exporter

### 💬 Misc

* Add a link to Patreon
* Add links to Twitter, Discord and VK to the starting screen

## v 0.4.1

*25 September 2018*

### ⚡ General Improvements

* A better error message from ct.tween when switching to a new room.
* Add a search/sort panel to the graphic selector
* Add an option to ct.touch to disable default events prevention on touches, allowing to use ct.mouse on mobile devices, too.
* ct.rooms.make now returns an array of created copies.

### ✨ New Features

* Add a ct.draw.patch module
* Add an 'Isometrify' button to the graphics editor
* Add ct.u.wait method
* Resize copies and set their precise coords while in room editor

### 🐛 Bug Fixes

* Fix ct.canvas.drawTileExt
* Fix graphics sometimes unavailable at room editor

### 💄 UI Improvements

* Better QR code legibility on dark themes
* Move all thumbnails to the left side

### 📝 Docs

* Add a link to the Discord server to the docs
* Add a tutorial about localStorage and game saves

## v 0.4.0

*13 September 2018*

### ⚡ General Improvements

* Add a room's name to its properties in the exported project
* Add a Shift modifier to place multiple copies or tiles at a room at once
* Add conversion to ES5
* Add QR codes and local addresses to the preview window
* Add tile culling
* Disable scaling and set proper width on mobile devices. Combine it with ct.fittoscreen to make your games mobile-ready (graphically)
* More consistent and intuitive tile and copy placement on grids in room editor
* More consistent behavior of ct.fittoscreen
* Move room templates to a JS object ct.rooms.templates
* Reorder room creation process to allow modifying room's view by copies' On Create code
* Set ct as a JavaScript object, move the canvas tag and all its properties to ct.HTMLCanvas

### ✨ New features

* Add `ct.touch` module
* Handling of copy-tile collisions with `ct.place.tile`
* Integrated debugger
* Show/hide certain tile layers

### 🍱 Demos

* Add a Platformer tutorial example project and its assets
* Update Catformer demo
* Update Catsteroids demo

### 🐛 Bugs Fixed

* Clean up logical assets after deleting a type or a graphical asset
* Fix checkboxes on the Settings tab not showing their saved state
* Fix HTML / CSS minification not working
* Fix preloader and random startup errors
* Room editor: Fix Shift and Ctrl modifiers working after a context menu was called.

### 💄 UI Improvements

* A bit better buttons
* Fix copy palette being visible on room's events screen
* Prevent clipping of sprite sheet settings at graphics editor on smaller screens. Move collision shape show/hide control to the left column.
* Tile editor improvements

### 📝 Docs

* Add a Platformer tutorial
* Add info about ct.js engine to docs' homepage
* Document ct.place.tile

### Other

* 📄 License: Remove edit prohibition for 3rd party libraries
* 💬 Rename 'Graphic' to 'Graphics'
* 🔖 Bump ct.fittoscreen version
* 🚚 🍱 Move SpaceShooter demo to a better location
* 🍱 Add a simple .desktop file for linux


## v0.3.1

*24 August 2018*

### ⚡ General Improvements

* Rectangular grids in room editor

### ✨ New Features

* Support for tilesets! **An early version, EXPERIMENTAL**

### 🐛 Bug Fixes

* Fix a bug preventing picking a background
* Fix a bug preventing to delete a room with a context menu
* Fix FPS input in graph editor not working
* Fix modal dialogues with 'Delete' labels instead of 'Ok'
* Replace JS minifier to support ES6

### 💄 UI Improvements

* Changes to number fields in style and graphic editors now affect preview panes instantly
* Search and sorting for room editor with minor UI improvements
* Show a warning when using duplicate names in assets

## v0.3.0

*17 August 2018*

### ⚡ General Improvements

- Add ct.draw.img as an alias to ct.draw.image
- Add optional x and y parameters to ct.draw()
- Git-friendly asset identifiers
- Make x and y in ct.types.copy optional
- Pre-initialize ct.types.list with empty arrays for each type
- Support new Keyboard API standard
- Update mouse position each frame
- Update mouse position each frame; better ct.mouse.imside resolution

### ✨ New Features

- 💄 Dark theme!
- Add a ct.sprite catmod

### 🐛 Bug Fixes

- Enable code checking in editors
- Fix an error in module.json of ct.canvas module
- Fix bugs when cancelling the an asset's duplicate creation
- Fix flipped orientation in ct.draw.imgext
- Fix pattern drawing with styles
- Fix pixelated render not fully working
- Fix styles' line width not exported correctly
- Fix texture selection in the styles editor
- Room size must be exported as numerical values
- Update the graphic asset in the editor's memory after replacing its source

### 💄 UI Improvements

- Add a "Copy the name" option to assets' context menus
- Better modal dialogues
- Custom Scrollbars
- Different minor UI improvements
- Open the sound after its creation
- Sort and search fields in resource views
- Wider room thumbnails

### 📄 License

Added license. TL;DR:

- You own your assets, projects, catmods;
- You can use the app for commercial use (and other uses too);
- You must not modify the ct.js in any ways that were not intended for it by the Author;
- We do not give any guarantees and are not responsible for any damage.

### 📝 Docs

- 🐛 Fix minor mistakes in ct.types docs

## v0.2.0

*05 August 2018*

### ✨ New features

- 💄 More options for sounds and better UI
- Add custom scripts to your project
- Introduce ct.place.go and ct.place.trace methods
- Launch a static server for exported projects
- "Line — everything" collision detection in ct.place
- New ct.sound.howler module
- New ct.fittoscreen module

### ⚡️ General Improvements

- 🐛 Minor changes to the standart ct.sound
- 📝 Launch docs locally — now the docs for your particular version are bundled with ct.js and are available offline
- Make ct.mouse aware of possible view scrolling and scaling

### 🐛 Bug fixes

- Export unchecked ‘checkbox’ fields as false, not as an empty string
- Fix a bug in ct.draw.polygon.close, ct.draw.polygon.fill, ct.draw.polygon.stroke
- Fix ct.u.prect function not working with mirrored coordinates
- Fix exporter not copying includes folders of ctlibs
- Fix occasional failures while loading new images
- Fix wrong extensions of exported sounds

### 💄 UI improvements

- Make docs blue!
- Add a button to return to docs’ homepage
- Better presentation of ‘checkbox’ options of catmods
- Fix list overflow if there are too many resources

### 📝 Docs

- Add missing file extensions in “Creating your own mods” page
- Remove unexisting config fields of catmods, document the "help" field
- Reflect changes of ct.sound API

### 🍱 Updated demos

- Update Catformer demo with fullscreen option
- Update Catsteroids with ct.sound.howler