interface IHowlerSoundOptions {
    /**  Whether to repeat the sound or not */
    loop: boolean;
    /**  The volume of the sound, between 0 and 1 */
    volume: number;
    /**  The speed of playback, from 0.5 to 4 */
    rate: number;
    /**  If specified, the sound will be a 3D sound positioned at the specified copy */
    position: Copy;
    /**  If specified, the sound will be a 3D sound positioned at the specified location */
    x: number;
    /**  If specified, the sound will be a 3D sound positioned at the specified location */
    y: number;
    /**  If specified, the sound will be a 3D sound positioned at the specified location */
    z: number;
}
interface IHowlerPlayCallback { (): void }

interface IHowlerSrcs {
    ogg?: string;
    wav?: string;
    mp3?: string;
}

declare namespace ct {
    namespace sound {
        /**
         * Spawns a new sound and plays it.
         *
         * @param {string} name The name of a sound to be played
         * @param {IHowlerSoundOptions} [options] An object that can have the following fields:
         * @param {boolean} [options.loop] Whether to repeat the sound or not;
         * @param {number} [options.volume] The volume of the sound, between 0 and 1;
         * @param {number} [options.rate] The speed of playback, from 0.5 to 4;
         * @param {Copy} [options.position] If specified, the sound will be a 3D sound positioned at the specified copy;
         * @param {number} [options.x] If specified, the sound will be a 3D sound positioned at the specified location
         * @param {number} [options.y] If specified, the sound will be a 3D sound positioned at the specified location.
         * @param {number} [options.z] If specified, the sound will be a 3D sound positioned at the specified location.
         * @param {IHowlerPlayCallback} [cb] A callback, which is called when the sound finishes playing
         *
         * @returns {number} The ID of the created sound. This can be passed to Howler methods.
         */
        function spawn(name: string, options?: IHowlerSoundOptions, cb?: IHowlerPlayCallback): number;

        /**
         * Changes/returns the volume of the given sound.
         *
         * @param {string} name The name of a sound to affect.
         * @param {number} [volume] The new volume from `0.0` to `1.0`. If empty, will return the existing volume.
         * @param {number} [id] If specified, then only the given sound instance is affected.
         *
         * @returns {number} The current volume of the sound.
         */
        function volume(name: string, volume?: number, id?: number): number;

        /**
         * Fades a sound to a given volume. Can affect either a specific instance or the whole group.
         *
         * @param {string} name The name of a sound to affect.
         * @param {number} newVolume The new volume from `0.0` to `1.0`.
         * @param {number} duration The duration of transition, in milliseconds.
         * @param {number} [id] If specified, then only the given sound instance is affected.
         *
         * @returns {void}
         */
        function fade(name: string, newVolume?: number, duration?: number, id?: number): void;

        /**
         * Stops playback of a sound, resetting its time to 0.
         *
         * @param {string} name The name of a sound
         * @param {number} [id] An optional ID of a particular sound
         * @returns {void}
         */
        function stop(name: string, id?: number): void;

        /**
         * Pauses playback of a sound or group, saving the seek of playback.
         *
         * @param {string} name The name of a sound
         * @param {number} [id] An optional ID of a particular sound
         * @returns {void}
         */
        function pause(name: string, id?: number): void;

        /**
         * Resumes a given sound, e.g. after pausing it.
         *
         * @param {string} name The name of a sound
         * @param {number} [id] An optional ID of a particular sound
         * @returns {void}
         */
        function resume(name: string, id?: number): void;

        /**
         * Moves a 3D sound to a new location
         *
         * @param {string} name The name of a sound to move
         * @param {number} id The ID of a particular sound. Pass `null` if you want to affect all the sounds of a given name.
         * @param {number} x The new x coordinate
         * @param {number} y The new y coordinate
         * @param {number} [z] The new z coordinate
         *
         * @returns {void}
         */
        function position(name: string, id: number, x: number, y: number, z?: number): void;

        /**
         * Preloads a sound. This is usually applied to music files before playing
         * as they are not preloaded by default.
         *
         * @param {string} name The name of a sound
         * @returns {void}
         */
        function load(name: string): void;

        /**
         * Returns whether a sound is currently playing,
         * either an exact sound (found by its ID) or any sound of a given name.
         *
         * @param {string} name The name of a sound
         * @param {number} [id] An optional ID of a particular sound
         * @returns {boolean} `true` if the sound is playing, `false` otherwise.
         */
        function playing(name: string, id?: number): boolean;

        /**
         * Get/set the global volume for all sounds, relative to their own volume.
         *
         * @param {number} [volume] The new volume from `0.0` to `1.0`. If omitted, will return the current global volume.
         *
         * @returns {number} The current volume.
         */
        function globalVolume(volume: number): number;

        /**
         * Detects if a particular codec is supported in the system
         * @param {string} type One of: "mp3", "mpeg", "opus", "ogg", "oga", "wav", "aac", "caf", m4a", "mp4", "weba", "webm", "dolby", "flac".
         * @returns {boolean} true/false
         */
        function detect(type: string): boolean;

        /**
         * Creates a new Sound object and puts it in resource object
         *
         * @param {string} name Sound's name
         * @param {IHowlerSrcs} formats A collection of sound files of specified extension, in format `extension: path`
         * @param {string} [formats.ogg] Local path to the sound in ogg format
         * @param {string} [formats.wav] Local path to the sound in wav format
         * @param {string} [formats.mp3] Local path to the sound in mp3 format
         * @param {Object} options An options object
         *
         * @returns {Object} Sound's object
         */
        function init(name: string, formats: IHowlerSrcs, poolSize?: number): void;

        /**
         * Moves the 3D listener to a new position.
         *
         * @see https://github.com/goldfire/howler.js#posx-y-z
         *
         * @param {number} x The new x coordinate
         * @param {number} y The new y coordinate
         * @param {number} [z] The new z coordinate
         *
         * @returns {void}
         */
        function moveListener(x: number, y: number, z?: number): void;
    }
}