interface IStats {
    dev: number,
    ino: number,
    mode: number,
    nlink: number,
    uid: number,
    gid: number,
    rdev: number,
    size: number,
    blksize: number,
    blocks: number,
    atimeMs: number,
    mtimeMs: number,
    ctimeMs: number,
    birthtimeMs: number,
    atime: Date,
    mtime: Date,
    ctime: Date,
    birthtime: Date,
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isDirectory(): boolean;
    isFIFO(): boolean;
    isFile(): boolean;
    isSocket(): boolean;
    isSymbolicLink(): boolean;
}

declare namespace ct {
    /** A module that provides a uniform API for storing and loading data for your desktop games. */
    namespace fs {

        /**
         * When set to `true`, any operations towards files outside the game's save directory will fail.
         * Set to `true` by default.
         */
        var forceLocal: boolean;

        /**
         * When set to `false`, the game is running in a way that disallows access to the filesystem (such as a web release)
         */
        var isAvailable: boolean;

        /**
         * The base location for application data. Not for normal usage.
         */
        var gameFolder: string;

        /** Saves an object/array to a file. */
        function save(filename: string, data: object|any[]): Promise<void>;

        /** Loads an object/array from a file written by `ct.fs.save`. */
        function load(filename: string): Promise<object|any[]>;

        /** Converts any value to a string and puts it into a file. */
        function saveText(filename: string, text: string): Promise<void>;

        /** Loads a string from a file, previously written by ct.fs.saveText. */
        function loadText(filename: string): Promise<string>;

        /** Creates a directory and all the preceding folders, if needed. */
        function makeDir(path: string): Promise<void>;

        /**
         * Removes a given directory with all its contents.
         * If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered,
         * it will try again at max 10 times in one second.
         */
        function deleteDir(path: string): Promise<void>;

        /** Copies a file from one location to another. Does nothing if `filename` and `dest` point to one location.*/
        function copy(filename: string, dest: string): Promise<void>;

        /** Copies a file, then deletes the original. Does nothing if `filename` and `dest` point to one location. */
        function move(filename: string, dest: string): Promise<void>;

        /** Returns a promise that resolves into an array of file names in a given directory */
        function listFiles(directory?: string): Promise<void>;

        /**
         * Gets information about a given file.
         * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
         */
        function stat(filename: string): Promise<IStats|boolean>;

        /**
         * When given a relative path, returns the absolute path equivalent
         * to the given one, resolving it relative to the game's save directory.
         *
         * No need to use it with `ct.fs` — `getPath` is already used in all its methods.
         * The method is useful when working with other libraries, and for debugging.
         */
        function getPath(partial: string): string;

        /** An alias for `ct.fs.move`. Copies a file from one location to another. Does nothing if `filename` and `dest` point to one location. */
        function rename(): Promise<void>;

        /**
         * An alias for `ct.fs.stat`. Gets information about a given file.
         * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
         */
        function exists(): Promise<IStats|boolean>;

    }
}

declare namespace ct {
    namespace fs {
        /** Removes a given file */
        var _delete: function(string): Promise<void>;
        export {_delete as delete};
    }
}
