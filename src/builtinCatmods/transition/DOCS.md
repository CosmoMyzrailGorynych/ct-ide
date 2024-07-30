All the methods have optional arguments and return a promise that resolves when the effect has ended. These can be chained to create a seamless transition.

## `transition.fadeOut(duration, color)`

The beginning of a fading transition, which paints the whole screen through time. The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.fadeIn(duration, color)`

The end of a fading transition. The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.slideOut(duration, direction, color)`

The beginning of a sliding transition. A rectangle will smoothly move from one edge of the screen to the opposite, in the given direction, covering the screen with an opaque color.

`direction` is where the rectangle moves, and can be one of:

- `'left'`;
- `'right'` (default value);
- `'top'`;
- `'bottom'`.

The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.slideIn(duration, direction, color)`

The end of a sliding transition. A rectangle will smoothly move from one edge of the screen to the opposite, in the given direction, covering the screen with an opaque color.

`direction` is where the rectangle moves, and can be one of:

- `'left'`;
- `'right'` (default value);
- `'top'`;
- `'bottom'`.

The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.circleOut(duration, color)`

The beginning of a circle-shaped transition. This will create a circle that smoothly grows from a size of a point to cover the whole screen in a given opaque color. The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.circleIn(duration, color)`

The end of a circle-shaped transition. This will create a circle that covers the whole screen in a given opaque color but smoothly shrinks to a point. The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.scaleOut(duration, scaling, color)`

Scales the camera by a given coefficient while also fading to a specified color (similar to `transition.fadeOut`). The default `scaling` is `0.1`, which will zoom in 10 times. Setting values larger than `1` will zoom out instead. The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).

## `transition.scaleIn(duration, scaling, color)`

Scales the camera by a given coefficient and turns back to normal, while also fading in from a specified color (similar to `transition.fadeIn`). The default `scaling` is `0.1`, which will zoom in 10 times. Setting values larger than `1` will zoom out instead. The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds) and `0x000000` (black color).
