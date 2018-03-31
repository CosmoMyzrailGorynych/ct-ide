title: ct.res Object. Managing resources
---

# ct.res

This object manages all the resources needed for your game, including images and sounds. Usually its methods are not used as all the needed work is done by ct.IDE, though you may find it useful while loading additional or dynamic assets during the game process.

## Methods and properties

### `ct.res.imgs`

An object with all the loaded images.

### `ct.res.fetchimg(url: String, callback: Function)`

Loads an image and adds it to the current image collection (`ct.res.imgs`). When provided with a callback, it sends a string

### `ct.res.makesprite(name: String, img: HTMLImageElement, opts: Object)`
Creates a graphic asset from a given image.

- `name` – graphic asset name to be used in code (e.g. with `ct.draw.image`;
- `img` – the url of the image. It should be preloaded by `ct.res.fetchimg`;
- `opts` is a plain object which may contain the following properties:
    - `x`, `y` – the top left corner of image from where to start cropping. Default is `0, 0`;
    - `w`, `h` – the width and height of a cropped element. Default is `1, 1`;
    - `xo`, `yo` – graphic's pivot point. Default is for `0, 0`;
    - `cols`, `rows` – number of columns and rows to divide image by. `1, 1` is the default value;
    - `marginx`, `marginy` – spacing between frames. Default value is `0, 0`;
    - `until` – number of frames to include. The max number of frames is determined by the `cols` and `rows` arguments, that divide an image to a grid. Default is 0, which means that all the frames must be included.