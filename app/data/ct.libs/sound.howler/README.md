# ct.sound.howler

This module replaces the functionality of ct.sound with [Howler.js library](https://github.com/goldfire/howler.js). It creates a more reliable sound system with additional functions like spacial audio, fading, volume changing.

Includes [Howler.js](https://github.com/goldfire/howler.js) v2.2.0.

## Is it compatible with the default `ct.sound` library?

This module aims to seamlessly replace `ct.sound`, but it also adds new functions. See the docs tab for more info.

## How to get actual Howl objects?

All the Howl objects are stored in `ct.res.sounds`, like `ct.res.sounds['Puff']`. You can use these objects to use [other Howler's functions](https://github.com/goldfire/howler.js#methods).

## What is the difference between "music" and generic audio assets?

All the sounds not marked as `music` are preloaded before the actual game starts. Music can be preloaded manually with a `ct.sound.load('MusicNameHere');` function, or it will just start loading when requested. Also, under the hood, "music" files play in a way that is more effective for large soundtracks.
