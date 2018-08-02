# ct.sound

This module loads sounds and plays them in your game.


## Methods

### `ct.sound.init(name: String[, wav: String, mp3: String, options: object])`
Loads a new sound to a game's sound collection. This is usually done by editor, but you may need to load additional sounds during the playtime.

Options include:
* `poolSize` that sets the maximum number of simultaneously played sounds, and is set to 5 by default;
* `music` that is set to `false` by default. Setting it to `true` disables preloading of this file. 


### `ct.sound.spawn(name: String[, opts: Object, cb: Function])`

Spawns a new sound and plays it.

- `name` is the name of sound to be played;
- `opts` is a [config object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) that is applied to a newly created audio tag;
- `cb` is a callback, which is called when the sound finishes playing.

This method returns `HTMLTagAudio` – the created audio, or `false` in case a sound wasn't created.