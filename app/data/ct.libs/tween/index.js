/* eslint-disable no-nested-ternary */
/* global CtTimer */
{
    const tween = {
    /**
     * Creates a new tween effect and adds it to the game loop
     *
     * @param {Object} options An object with options:
     * @param {Object|Copy} options.obj An object to animate. All objects are supported.
     * @param {Object} options.fields A map with pairs `fieldName: newValue`.
     * Values must be of numerical type.
     * @param {Function} options.curve An interpolating function. You can write your own,
     * or use default ones (see methods in `tween`). The default one is `tween.ease`.
     * @param {Number} options.duration The duration of easing, in milliseconds.
     * @param {Number} options.useUiDelta If true, use u.deltaUi instead of u.delta.
     * The default is `false`.
     * @param {boolean} options.silent If true, will not throw errors if the animation
     * was interrupted.
     *
     * @returns {Promise} A promise which is resolved if the effect was fully played,
     * or rejected if it was interrupted manually by code, room switching or instance kill.
     * You can call a `stop()` method on this promise to interrupt it manually.
     */
        add(options) {
            const twoon = {
                obj: options.obj,
                fields: options.fields || {},
                curve: options.curve || tween.ease,
                duration: options.duration || 1000,
                timer: new CtTimer(options.duration, false, options.useUiDelta || false)
            };
            const promise = new Promise((resolve, reject) => {
                twoon.resolve = resolve;
                twoon.reject = reject;
                twoon.starting = {};
                for (const field in twoon.fields) {
                    twoon.starting[field] = twoon.obj[field] || 0;
                }
                tween.tweens.push(twoon);
            });
            if (options.silent) {
                promise.catch(() => void 0);
                twoon.timer.catch(() => void 0);
            }
            promise.stop = function stop() {
                twoon.reject({
                    code: 0,
                    info: 'Stopped by game logic',
                    from: 'tween'
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
        easeInBack(s, d, a) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            const x = c3 * a * a * a - c1 * a * a;
            return d * x + s;
        },
        easeOutBack(s, d, a) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            const x = 1 + c3 * (a - 1) ** 3 + c1 * (a - 1) ** 2;
            return d * x + s;
        },
        easeInOutBack(s, d, a) {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            const x = a < 0.5 ?
                ((2 * a) ** 2 * ((c2 + 1) * 2 * a - c2)) / 2 :
                ((2 * a - 2) ** 2 * ((c2 + 1) * (a * 2 - 2) + c2) + 2) / 2;
            return d * x + s;
        },
        easeInElastic(s, d, a) {
            const c4 = (2 * Math.PI) / 3;
            const x = a === 0 ?
                0 :
                a === 1 ?
                    1 :
                    -(2 ** (10 * a - 10)) * Math.sin((a * 10 - 10.75) * c4);
            return d * x + s;
        },
        easeOutElastic(s, d, a) {
            const c4 = (2 * Math.PI) / 3;
            const x = a === 0 ?
                0 :
                a === 1 ?
                    1 :
                    2 ** (-10 * a) * Math.sin((a * 10 - 0.75) * c4) + 1;
            return d * x + s;
        },
        easeInOutElastic(s, d, a) {
            const c5 = (2 * Math.PI) / 4.5;
            const x = a === 0 ?
                0 :
                a === 1 ?
                    1 :
                    a < 0.5 ?
                        -(2 ** (20 * a - 10) * Math.sin((20 * a - 11.125) * c5)) / 2 :
                        (2 ** (-20 * a + 10) * Math.sin((20 * a - 11.125) * c5)) / 2 + 1;
            return d * x + s;
        },
        easeOutBounce(s, d, a) {
            const n1 = 7.5625;
            const d1 = 2.75;
            let x;
            if (a < 1 / d1) {
                x = n1 * a * a;
            } else if (a < 2 / d1) {
                x = n1 * (a -= 1.5 / d1) * a + 0.75;
            } else if (a < 2.5 / d1) {
                x = n1 * (a -= 2.25 / d1) * a + 0.9375;
            } else {
                x = n1 * (a -= 2.625 / d1) * a + 0.984375;
            }
            return d * x + s;
        },
        easeInBounce(s, d, a) {
            const n1 = 7.5625;
            const d1 = 2.75;
            let x;
            a = 1 - a;
            if (a < 1 / d1) {
                x = n1 * a * a;
            } else if (a < 2 / d1) {
                x = n1 * (a -= 1.5 / d1) * a + 0.75;
            } else if (a < 2.5 / d1) {
                x = n1 * (a -= 2.25 / d1) * a + 0.9375;
            } else {
                x = n1 * (a -= 2.625 / d1) * a + 0.984375;
            }
            return d * (1 - x) + s;
        },
        easeInOutBounce(s, d, a) {
            const n1 = 7.5625;
            const d1 = 2.75;
            let x, b;
            if (a < 0.5) {
                b = 1 - 2 * a;
            } else {
                b = 2 * a - 1;
            }
            if (b < 1 / d1) {
                x = n1 * b * b;
            } else if (b < 2 / d1) {
                x = n1 * (b -= 1.5 / d1) * b + 0.75;
            } else if (b < 2.5 / d1) {
                x = n1 * (b -= 2.25 / d1) * b + 0.9375;
            } else {
                x = n1 * (b -= 2.625 / d1) * b + 0.984375;
            }
            if (a < 0.5) {
                x = (1 - b) / 1;
            } else {
                x = (1 + b) / 1;
            }
            return d * x + s;
        },
        tweens: [],
        wait: u.wait
    };
    tween.easeInOutQuad = tween.ease;
    window.tween = tween;
}
