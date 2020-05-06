interface ITween extends Promise<void> {
    /**
     * Manually stops the animation.
     */
    stop: () => void;
}

type TweenCurveFunction = (value: number) => number;

interface ITweenOptions {
    obj: object
    fields: object
    curve?: TweenCurveFunction;
    duration: number;
    useUiDelta?: boolean;
}

declare namespace ct {
    /**
     * This module allows you to chande objects' values through time.
     * It is useful for creating UI animations, smooth transitions, moving copies
     * and changing their parameters gradually, with an easing function.
     */
    namespace tween {
        /**
         * Creates a new tween effect and adds it to the game loop.
         * Returns a Promise which is resolved if the effect was fully played,
         * or rejected if it was interrupted manually by code, room switching or Copy kill.
         */
        function add(options: ITweenOptions): ITween;

        var linear: TweenCurveFunction;
        var ease: TweenCurveFunction;
        var easeInOutQuad: TweenCurveFunction;
        var easeInQuad: TweenCurveFunction;
        var easeOutQuad: TweenCurveFunction;
        var easeInOutCubic: TweenCurveFunction;
        var easeInCubic: TweenCurveFunction;
        var easeOutCubic: TweenCurveFunction;
        var easeInOutQuart: TweenCurveFunction;
        var easeInQuart: TweenCurveFunction;
        var easeOutQuart: TweenCurveFunction;
        var easeInOutCirc: TweenCurveFunction;
        var easeInCirc: TweenCurveFunction;
        var easeOutCirc: TweenCurveFunction;
    }
}