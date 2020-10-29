/* global CtTimer */

ct.tween = {
    /**
     * Creates a new tween effect and adds it to the game loop
     *
     * @param {Object} options An object with options:
     * @param {Object|Copy} options.obj An object to animate. All objects are supported.
     * @param {Object} options.fields A map with pairs `fieldName: newValue`.
     * Values must be of numerical type.
     * @param {Function} options.curve An interpolating function. You can write your own,
     * or use default ones (see methods in `ct.tween`). The default one is `ct.tween.ease`.
     * @param {Number} options.duration The duration of easing, in milliseconds.
     * @param {Number} options.useUiDelta If true, use ct.deltaUi instead of ct.delta.
     * The default is `false`.
     * @param {boolean} options.silent If true, will not throw errors if the animation
     * was interrupted.
     *
     * @returns {Promise} A promise which is resolved if the effect was fully played,
     * or rejected if it was interrupted manually by code, room switching or instance kill.
     * You can call a `stop()` method on this promise to interrupt it manually.
     */
    add(options) {
        var tween = {
            obj: options.obj,
            fields: options.fields || {},
            curve: options.curve || ct.tween.ease,
            duration: options.duration || 1000,
            timer: new CtTimer(this.duration, false, options.useUiDelta || false)
        };
        var promise = new Promise((resolve, reject) => {
            tween.resolve = resolve;
            tween.reject = reject;
            tween.starting = {};
            for (var field in tween.fields) {
                tween.starting[field] = tween.obj[field] || 0;
            }
            ct.tween.tweens.push(tween);
        });
        if (options.silent) {
            promise.catch(() => void 0);
            tween.timer.catch(() => void 0);
        }
        promise.stop = function stop() {
            tween.reject({
                code: 0,
                info: 'Stopped by game logic',
                from: 'ct.tween'
            });
        };
        return promise;
    },
    /**
     * Linear interpolation.
     * Here and below, these parameters are used:
     *
     * @param {Number} s Starting value
     * @param {Number} d The change of value to transition to, the Delta
     * @param {Number} a The current timing state, 0-1
     * @returns {Number} Interpolated value
     */
    linear(s, d, a) {
        return d * a + s;
    },
    ease(s, d, a) {
        a *= 2;
        if (a < 1) {
            return d / 2 * a * a + s;
        }
        a--;
        return -d / 2 * (a * (a - 2) - 1) + s;
    },
    easeInQuad(s, d, a) {
        return d * a * a + s;
    },
    easeOutQuad(s, d, a) {
        return -d * a * (a - 2) + s;
    },
    easeInCubic(s, d, a) {
        return d * a * a * a + s;
    },
    easeOutCubic(s, d, a) {
        a--;
        return d * (a * a * a + 1) + s;
    },
    easeInOutCubic(s, d, a) {
        a *= 2;
        if (a < 1) {
            return d / 2 * a * a * a + s;
        }
        a -= 2;
        return d / 2 * (a * a * a + 2) + s;
    },
    easeInOutQuart(s, d, a) {
        a *= 2;
        if (a < 1) {
            return d / 2 * a * a * a * a + s;
        }
        a -= 2;
        return -d / 2 * (a * a * a * a - 2) + s;
    },
    easeInQuart(s, d, a) {
        return d * a * a * a * a + s;
    },
    easeOutQuart(s, d, a) {
        a--;
        return -d * (a * a * a * a - 1) + s;
    },
    easeInCirc(s, d, a) {
        return -d * (Math.sqrt(1 - a * a) - 1) + s;
    },
    easeOutCirc(s, d, a) {
        a--;
        return d * Math.sqrt(1 - a * a) + s;
    },
    easeInOutCirc(s, d, a) {
        a *= 2;
        if (a < 1) {
            return -d / 2 * (Math.sqrt(1 - a * a) - 1) + s;
        }
        a -= 2;
        return d / 2 * (Math.sqrt(1 - a * a) + 1) + s;
    },
    tweens: [],
    wait: ct.u.wait
};
ct.tween.easeInOutQuad = ct.tween.ease;
