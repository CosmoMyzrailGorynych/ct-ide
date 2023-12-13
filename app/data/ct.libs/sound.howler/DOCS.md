# Playing sounds

## ct.sound.spawn(name, [options], [cb])

Spawns a new sound and plays it.

### Params:

* **String** *name* The name of a sound to be played
* **Object** *options* An object that can have the following fields:
    * **Boolean** *loop* Whether to repeat the sound or not;
    * **Number** *volume* The volume of the sound, between 0 and 1;
    * **Number** *rate* The speed of playback, from 0.5 to 4;
    * **Copy** *position* If specified, the sound will be a 3D sound positioned at the specified copy;
    * **Number** *x, y and z* If specified, the sound will be a 3D sound positioned at the specified location.
* **Function** *[cb]* A callback, which is called when the sound finishes playing

### Return:

* **Number** The ID of the created sound. This can be passed to Howler methods.

# 3D sounds

If neither `position` nor `x` options of `ct.sound.spawn` are specified, the created sound will be a regular 2D sound with no positioning.
If they are set, a 3D sound will be created. It is configured by ct.sound.howler settings and by a set of [additional options from Howler.js](https://github.com/goldfire/howler.js#pannerattro-id). Location values are measured in pixels.

**Example:**

```js
ct.sound.spawn('LaserWall', {
    volume: 0.35,
    position: this
});
```

This will create a 3D sound, which location mathes the position of the copy that spawned a sound. If "Use Depth" is enabled, the Z coordinate of a sound will also match a copy's `depth` value. This may be useful with custom setttings of directional sounds that emit waves in a cone.

The listener itself is positioned in the following manner:

1. By default, the listener is set at point (0;0;0).
2. If "Manage listener's position" is enabled, ct.sound.howler will position the listener to the center of the game view.
3. If `ct.sound.follow` is set, ct.sound.howler will attach listener to the specified copy (similar to how `ct.room.follow` works), even if "Manage listener's position" is enabled.

You can manually position the listener by using `ct.sound.moveListener(x, y, z);`. Here, the `z` argument is optional. Other listener's parameters may be changed by modifying ct.sound.howler, which is [the Howler object](https://github.com/goldfire/howler.js#global-methods-1).

# Manipulating sounds

## ct.sound.volume(name, [volume], [id])

Changes/returns the volume of the given sound.

### Params:

* **String** *name* The name of a sound to affect.
* **Number** *[volume]* The new volume from `0.0` to `1.0`. If empty, will return the existing volume.
* **Number** *[id]* If specified, then only the given sound instance is affected.

### Return:

* **Number** The current volume of the sound.

## ct.sound.fade(name, [newVolume], [duration], [id])

Fades a sound to a given volume. Can affect either a specific instance or the whole group.

### Params:

* **String** *name* The name of a sound to affect.
* **Number** *newVolume* The new volume from `0.0` to `1.0`.
* **Number** *duration* The duration of transition, in milliseconds.
* **Number** *[id]* If specified, then only the given sound instance is affected.


## ct.sound.stop(name, [id])

Stops playback of a sound, resetting its time to 0.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound


## ct.sound.pause(name, [id])

Pauses playback of a sound or group, saving the seek of playback.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound


## ct.sound.resume(name, [id])

Resumes a given sound, e.g. after pausing it.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound


## ct.sound.position(name, id, x, y, z)

Moves a 3D sound to a new location

### Params:

* **String** *name* The name of a sound to move
* **Number** *id* The ID of a particular sound. Pass `null` if you want to affect all the sounds of a given name.
* **Number** *x* The new x coordinate
* **Number** *y* The new y coordinate
* **Number** *[z]* The new z coordinate. May be omitted, and it will then leave the old `z` value untouched.


# Utilities

## ct.sound.load(name)

Preloads a sound. This is usually applied to music files before playing them,
as they are not preloaded by default.

### Params:

* **String** *name* The name of a sound


## ct.sound.playing(name, [id])

Returns whether a sound is currently playing, either an exact sound (found by its ID) or any sound of a given name.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound

### Return:

* **Boolean** `true` if the sound is playing, `false` otherwise.


## ct.sound.globalVolume(volume)

Get/set the global volume for all sounds, relative to their own volume.

### Params:

* **Number** *[volume]* The new volume from `0.0` to `1.0`. If omitted, will return the current global volume.

### Return:

* **Number** The current volume.


## ct.sound.detect(type)

Detects if a particular codec is supported in the system

### Params:

* **String** *type* One of: "mp3", "mpeg", "opus", "ogg", "oga", "wav", "aac", "caf", m4a", "mp4", "weba", "webm", "dolby", "flac".

### Return:

* **Boolean** true/false

## ct.sound.init(name, formats, [poolSize=5])

Creates a new Sound object and puts it in ct.res.sounds object. This is automatically done by the engine for all the imported sounds, but you may need to load additional sounds during the playtime.

### Params:

* **String** *name* Sound's name
* **Object** *formats* An object with paths to sound files:
    * **String** *[wav]* Local path to the sound in wav format
    * **String** *[mp3]* Local path to the sound in mp3 format
    * **String** *[ogg]* Local path to the sound in ogg format
* **Object** *[options]* An options object. Options include `volume` (0-1), `loop` (`true` / `false`), `music` and `poolSize`, though the latter is usually set to default value of `5`.

### Return:

* **Object** Sound's object