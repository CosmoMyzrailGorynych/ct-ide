## `fs.forceLocal: boolean`

When set to `true`, any operations towards files outside the game's save directory will fail.
Set to `true` by default.

## `fs.isAvailable: boolean`
When set to `false`, the game is running in a way that disallows access to the filesystem (such as a web release)

## `fs.save(filename: string, data: object|Array): Promise<void>`

Saves an object/array to a file.

## `fs.load(filename: string): Promise<object|Array>`

Loads an object/array from a file written by `fs.save`.

## `fs.saveText(filename: string, text: string): Promise<void>`

Converts any value to a string and puts it into a file.

## `fs.loadText(filename: string): Promise<string>`

Loads a string from a file, previously written by fs.saveText.

## `fs.makeDir(path: string): Promise<void>`

Creates a directory and all the preceding folders, if needed.

## `fs.deleteDir(path: string): Promise<void>`

Removes a given directory with all its contents.
If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered,
it will try again at max 10 times in one second.

## `fs.copy(filename: string, dest: string): Promise<void>`
Copies a file from one location to another. Does nothing if `filename` and `dest` point to one location.

## `fs.move(filename: string, dest: string): Promise<void>`
Copies a file, then deletes the original. Does nothing if `filename` and `dest` point to one location.

## `fs.listFiles(directory?: string): Promise<Array<string>>`
Returns a promise that resolves into an array of file names in a given directory

## `fs.stat(filename: string): Promise<fs.Stats|boolean>`

Gets information about a given file.

See https://nodejs.org/api/fs.html#fs_class_fs_stats

**Alias:** `fs.exists`

## `fs.getPath(partial: string): string`

When given a relative path, returns the absolute path equivalent
to the given one, resolving it relative to the game's save directory.

No need to use it with `ct.fs` — `getPath` is already used in all its methods.
The method is useful when working with other libraries, and for debugging.

## `fs.rename(): Promise<void>`
An alias for `fs.move`. Copies a file from one location to another. Does nothing if `filename` and `dest` point to one location.

## `fs.exists(): Promise<fs.Stats|boolean>`

An alias for `fs.stat`. Gets information about a given file.
See https://nodejs.org/api/fs.html#fs_class_fs_stats
