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