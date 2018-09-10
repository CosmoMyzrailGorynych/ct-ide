# Hey there!

Nice to meet you! Here you will find all the official documentation and tutorials for ct.js.

ct.js (`ct` is read as `kΛtæ`) is a game framework and editor aimed for creation of 2D games. It is based on web technologies and supports lots of platforms. The framework is designed with modularity in mind, allowing additional modules to expand its possibilities and ease the development process.

## Where to start?

Try completing one of our tutorials. They will teach you how to use ct.js, how its library works, how to create basic game features and more. Then, dig into examples that are placed in `ctjs/examples` folder and look how more serious projects are done.

Use this documentation whenever you want from the side panel of ct.js, learn its core library.

Some additional modules are vital for building a good game. You will need to know how to use such libraries as `ct.place` and `ct.keyboard`. Each module has its own reference which you can get inside ct.js on the "Catmods" tab. `ct.place` and `ct.keyboard` are also widely used in our tutorials, and they are good for learning how to use such libraries.

If you get stuck, create a topic at [the ct.js forum](https://comigo.itch.io/ct/community) so others can help you.

## Basic concepts

* **Ct.js** is a modular library written in JavaScript, coupled with a visual editor. The editor is also referred to as **ct.IDE**.
* There are modules that combine into a basic game engine. These modules work with mouse inputs, draw things, work with rooms, load images and sounds. They exist in each game and are referred to as **the core library**.
* There are **additional modules** that hack on the core library, add new tools for programming and new features to the engine.


* Games in ct.js are written in JavaScript. It is a flexible weak-typed programming language for the web.


* Any ct.js game consists of **graphics assets**, **sounds**, **styles**, **types**, and **rooms**.
* A **graphics asset** is an image that doesn't do much by itself but is used by copies and can be drawn with code. This asset is also referred to as a sprite, but it can also be a tileset, a background, etc.
* A **copy** is a logical entity in your game that can interact with user inputs and other copies. Enemies, trees, bullets, gems, bonuses, cats — everything of such is a copy. Copies are often called *"objects"*, *"actors"* or *"instances"* in other game engines.
* Each copy corresponds to a specific **type**. A **type** is a template for new copies with common settings and behavior. It may be called a *class* or an *object* in other game engines.
* A **room** is a 2D space in your game where you place your copies. Rooms may have their own additional behavior (level scripts). Rooms are also often referred to as *levels* or *maps*. A notable difference is that rooms in ct.js are boundless when other 2D engines tend to set a specific size to it.
* **Styles** are templates for drawing that are used while making the user interface.
* **Sounds** are audio assets that are played by code.