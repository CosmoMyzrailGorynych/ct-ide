interface IBasicSoundOptions {
    /**  Whether to repeat the sound or not */
    loop: boolean;
    /**  The volume of the sound, between 0 and 1 */
    volume: number;
}
interface IBasicSoundCallback { (): void }

interface IBasicSoundSrcs {
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
         * @param {IBasicSoundOptions} [options] An object that can have the following fields:
         * @param {boolean} [options.loop] Whether to repeat the sound or not;
         * @param {number} [options.volume] The volume of the sound, between 0 and 1;
         * @param {IBasicSoundCallback} [cb] A callback which is called when the sound finishes playing
         *
         * @returns {HTMLTagAudio|false} The created audio or `false` (if a sound wasn't created)
         */
        function spawn(name: string, options?: IBasicSoundOptions, cb?: IBasicSoundCallback): HTMLTagAudio|false;

        /**
         * Detects if a particular codec is supported in the system
         * @param {string} type
         * @returns {boolean}
         */
        function detect(type: string): boolean;

        /**
         * Creates a new sound object and puts it in resource object
         *
         * @param {string} name sound's name
         * @param {IBasicSoundSrcs} formats A collection of sound files of specified extension in format `extension: path`
         * @param {string} [formats.ogg] Local path to the sound in ogg format
         * @param {string} [formats.wav] Local path to the sound in wav format
         * @param {string} [formats.mp3] Local path to the sound in mp3 format
         * @param {Object} options An options object
         *
         * @returns {Object} sound's object
         */
        function init(name: string, formats: IBasicSoundSrcs, poolSize?: number): void;

        /**
         * Returns whether a sound with the specified name was added to the game.
         * This doesn't tell whether it is fully loaded or not, it only checks
         * for existance of sound's metadata in your game.
         */
        function exists(name: string): boolean;
    }
}