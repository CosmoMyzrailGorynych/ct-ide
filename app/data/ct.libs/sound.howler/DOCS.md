## ct.sound.detect(type)

Detects if a particular codec is supported in the system 

### Params:

* **String** *type* One of: "mp3", "mpeg", "opus", "ogg", "oga", "wav", "aac", "caf", m4a", "mp4", "weba", "webm", "dolby", "flac".

### Return:

* **Boolean** true/false

## ct.sound.init(name, wav, mp3, [poolSize=5])

Creates a new Sound object and puts it in ct.res.sounds object. This is automatically done by the engine for all the imported sounds, but you may need to load additional sounds during the playtime.

### Params:

* **String** *name* Sound's name
* **String** *wav* Local path to the sound in wav format
* **String** *mp3* Local path to the sound in mp3 format
* **Object** *[options]* An options object. Options include `volume` (0-1), `loop` (`true` / `false`), `music` and `poolSize`, though the latter is usually set to default value of `5`.

### Return:

* **Object** Sound's object

## ct.sound.spawn(name, [cb])

Spawns a new sound and plays it.

### Params:

* **String** *name* The name of sound to be played
* **Function** *[cb]* A callback, which is called when the sound finishes playing

### Return:

* **Number** The ID of the created sound. This can be passed to Howler methods.

## ct.sound.volume(name, [volume], [id])

Changes/returns the volume of the given sound.

### Params:

* **String** *name* The name of sound to affect.
* **Number** *[volume]* The new volume from `0.0` to `1.0`. If empty, will return the existing volume.
* **Number** *[id]* If specified, then only the given sound instance is affected.

### Return:

* **Number** The current volume of the sound.

## ct.sound.fade(name, [newVolume], [duration], [id])

Fades a sound to a given volume. Can affect either a specific instance or the whole group.

### Params:

* **String** *name* The name of sound to affect.
* **Number** *newVolume* The new volume from `0.0` to `1.0`.
* **Number** *duration* The duration of transition, in milliseconds.
* **Number** *[id]* If specified, then only the given sound instance is affected.


## ct.sound.stop(name, [id])

Stops playback of sound, resetting its time to 0.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound

## ct.sound.pause(name, [id])

Pauses playback of sound or group, saving the seek of playback.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound

## ct.sound.resume(name, [id])

Resumes a given sound, e.g. after pausing it.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound

## ct.sound.playing(name, [id])

Returns whether a sound is currently playing, either an exact sound (found by its ID) or any sound of a given name.

### Params:

* **String** *name* The name of a sound
* **Number** *[id]* An optional ID of a particular sound

### Return:

* **Boolean** `true` if the sound is playing, `false` otherwise.

## ct.sound.load(name)

Preloads a sound. This is usually applied to music files before playing, 
as they are not preloaded by default.

### Params:

* **String** *name* The name of a sound

## ct.sound.globalVolume(volume)

Get/set the global volume for all sounds, relative to their own volume.

### Params:

* **Number** *[volume]* The new volume from `0.0` to `1.0`. If omitted, will return the current global volume.

### Return:

* **Number** The current volume.
