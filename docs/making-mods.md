# Making your own modules

Any module is a directory with a following structure:

* `includes`
  * (files to be copied to a resulting game)
* `injects`
  * (injects go here)
* `CHANGELOG.md`
* `DOCS.md`
* `index.js`
* `LICENSE` (plain text, strongly recommended)
* `module.json` (required)
* `README.md` (strongly recommended to include)

`index.js` usually represents the main code of your module, and is bundled with all the remaining code of compiled game. A rule of thumb is to pack all your dependencies in one file or, if your dependency is an another ct module, to explicitly state it in README.md.

`module.json` allows your module to be discoverable by ct.IDE, and contains basic info, list of authors and description of module settings.

`README.md` is a markdown file with general info, examples, special notes, etc. It is showed on the 'Info' tab in ct.IDE's modules section.

`DOCS.md` is shown on the 'Documentation' tab in ct.IDE's modules section and is a markdown file too.

`CHANGELOG.md` should contain a history of changes, if any.

## Structure of `module.json`

`module.json` is the only required file for your modules. It has the following format:

```json
{
    "main": {
        "name": "Module's name",
        "version": "1.0.0",
        "authors": [{
            "name": "Cosmo Myzrail Gorynych",
            "mail": "admin@nersta.ru"
        }, {
            ...
        }]
    },
    "fields": [{
        "name": "Field's name",
        "key": "field",
        "id": "field",
        "desc": "Field's description",
        "default": "default value",
        "type": "textfield"
    }, {
        ...
    }]
}
```

## Adding injections

Injects are a powerful instrument to extend functionality of ct.js framework beyond adding methods or properties. It allows you to add logic to a game loop, load resources, create bundled Types, etc. 

The `injects` folder contains files which code should be injected while exporting a game. All of them are optional, and here is a list of all the possible injections:

**General events**:

* `load.js` – fired once when a game's code has loaded, but nothing still happened, e.g. no resources were loaded;
* `start.js` – fired once when all the game's resources have been loaded. No game logic have been run yet.
* `switch.js` – fired each time when a room is switched, but before any other code. Here, a `room` variable is a name of the new room.

**Room-specific events**:

* `roomoncreate.js` – fired after entering a new room. This code is evaluated *after* user-defined OnCreate code, when all the copies were created. Here, `this` equals to a new room.
* `roomonleave.js` – fired before leaving a room, but *before* any user's script.  Copies still exist here.
* `beforeroomdraw.js`
* `afterroomdraw.js` 
* `beforeroomstep.js`
* `afterroomstep.js`

**Copy-specific events**:

* `oncreate.js` – applied to a newly created Copy, right *after* its own OnCreate event.
* `ondestroy.js` – applied to a Copy before it gets deleted. This code is called *before* a Copy's OnDestroy event.
* `beforedraw.js`
* `beforestep.js`
* `afterdraw.js`
* `afterstep.js`

**Templating and utils**:

* `css.css` – injects CSS into an exported game.
* `res.js` – called once while parsing loaded images.
* `resload.txt` – a comma-separated list of images to load. This must start with a comma too, like `, 'img/ct.place.demoimg1.png', 'img/ct.place.demoimg2.png'`
* `types.js` – here you can place your own Types.
* `styles.js` – here you can place your own drawing styles. 
* `htmltop.html` – this code is placed right before the drawing canvas. 
* `htmlbottom.html` – this code is placed right after the drawing canvas.

### Adding fields

Adding fields allows users configure your mods from inside ct.IDE, on a 'Settings' tab of your mod. You can have any numbers of fields and use them inside your main code or injects.

Fields are described in `module.json`, and can be one of these types:

* `input` – a simple text input for short strings;
* `textfield` – a large textarea for a long input;
* `number` – an input field for integers;
* `checkbox` – a checkbox for Boolean variables.

A field's `id` must be unique for a module. A `key` determines which parts of code should be replaced  with the field's value. If you have a field with a key `'enabled'`, then all matches with `/*%enabled%*/` or `%enabled%` will be replaced by a field's value. There can also be a `help` field, that will be shown below the input field and can contain some hints or an expanded explanation of what your field does.

```json Example from default akatemplate module
{
    "main": {
        "name": "Basic Template",
        "version": "1.0.0",
        "authors": [{
            "name": "Cosmo Myzrail Gorynych",
            "mail": "admin@nersta.ru"
        }]
    },
    "fields": [
        {
            "name": "HTML top",
            "key": "toptop",
            "id": "toptop",
            "default": " ",
            "type": "textfield"
        },
        {
            "name": "HTML bottom",
            "key": "botbot",
            "id": "botbot",
            "default": " ",
            "type": "textfield"
        },
        {
            "name": "CSS",
            "key": "csscss",
            "id": "csscss",
            "default": " ",
            "type": "textfield"
        }
    ]
}
```

