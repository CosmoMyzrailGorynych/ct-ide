type CtTransitionDirection = 'left' | 'right' | 'top' | 'bottom';

/**
 * Allows you to create transitions between rooms, or whenever you need them.
 */
declare namespace transition {
    /**
     * The beginning of a fading transition, which paints the whole screen through time.
     * The arguments `duration` and `color` are optional,
     * and default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function fadeOut(duration?: number, color?: number): Promise<void>;
    /**
     * The end of a fading transition. The arguments `duration` and `color` are optional,
     * and default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function fadeIn(duration?: number, color?: number): Promise<void>;

    /**
     * Scales the camera by a given coefficient while also fading to a specified color
     * (similar to `ct.transition.fadeOut`). The default `scaling` is `0.1`,
     * which will zoom in 10 times. Setting values larger than `1` will zoom out instead.
     * The arguments `duration` and `color` are optional, and default to `500` (0.5 seconds)
     * and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function scaleOut(duration?: number, scaling?: number, color?: number): Promise<void>;
    /**
     * Scales the camera by a given coefficient and turns back to normal,
     * while also fading in from a specified color (similar to `ct.transition.fadeIn`).
     * The default `scaling` is `0.1`, which will zoom in 10 times. Setting values larger
     * than `1` will zoom out instead. The arguments `duration` and `color` are optional,
     * and default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function scaleIn(duration?: number, scaling?: number, color?: number): Promise<void>;

    /**
     * The beginning of a sliding transition. A rectangle will smoothly move
     * from one edge of the screen to the opposite, in the given direction,
     * covering the screen with an opaque color.
     * The arguments `duration` and `color` are optional, and
     * default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function slideOut(duration?: number, direction?: CtTransitionDirection, color?: number): Promise<void>;
    /**
     * The end of a sliding transition. A rectangle will smoothly move
     * from one edge of the screen to the opposite, in the given direction,
     * covering the screen with an opaque color.
     * The arguments `duration` and `color` are optional,
     * and default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function slideIn(duration?: number, direction?: CtTransitionDirection, color?: number): Promise<void>;

    /**
     * The beginning of a circle-shaped transition. This will create a circle
     * that smoothly grows from a size of a point to cover the whole screen
     * in a given opaque color. The arguments `duration` and `color` are optional,
     * and default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function circleOut(duration?: number, color?: number): Promise<void>;
    /**
     * The end of a circle-shaped transition. This will create a circle
     * that covers the whole screen in a given opaque color but smoothly
     * shrinks to a point. The arguments `duration` and `color` are optional,
     * and default to `500` (0.5 seconds) and `0x000000` (black color).
     *
     * @catnipPromise then
     */
    function circleIn(duration?: number, color?: number): Promise<void>;
}
