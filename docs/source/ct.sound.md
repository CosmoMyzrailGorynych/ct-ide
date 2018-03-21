title: ct.sound
---

# ct.sound

This module loads sounds and plays them in your game.

---

## Methods

### `ct.sound.init(name: String[, wav: String, mp3: String, poolSize: Number])`
Loads a new sound to a game's sound collection. `poolSize` sets the maximum number of simultaneously played sounds, and is set to 5 by default.

### `ct.sound.spawn(name: String[, opts: Object, cb: Function])`

Spawns a new sound and plays it.

- `name` is the name of sound to be played;
- `opts` is a [config object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) that is applied to a newly created audio tag;
- `cb` is a callback, which is called when the sound finishes playing.

This method returns HTMLTagAudio – the created audio, or `false` in case a sound wasn't created.