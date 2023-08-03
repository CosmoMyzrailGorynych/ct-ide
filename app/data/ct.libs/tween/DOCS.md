## tween.add(options: object)

Creates a new tween effect and adds it to the game loop.

* `options` — an object with options:
    * `options.obj` An object to animate. All objects are supported.
    * `options.fields` A map with pairs `fieldName: newValue`. Values must be of numerical type.
    * `options.curve` An interpolating function. You can write your own, or use default ones written below. The default one is `tween.ease`.
    * `options.duration` The duration of easing, in milliseconds.
    * `options.useUiDelta` If true, use `u.deltaUi` instead of `u.delta`. The default is `false`.
    * `options.silent` If set to true, suppresses errors when the timer was interrupted or stopped manually.

Returns a Promise which is resolved if the effect was fully played, or rejected if it was interrupted manually by code, room switching or Copy kill.

You can call a `stop()` method on this promise to interrupt it manually.

### Example

```js
this.moving = true;
this.zIndex = 1;

tween.add({
    obj: this,
    fields: {
        x: targetX,
        y: targetY
    },
    duration: 250
}).then(() => {
    this.zIndex = 0;
    this.moving = false;
});
```

### Default interpolation methods

* `tween.linear`


* `tween.ease`, or `tween.easeInOutQuad` (alias, default)
* `tween.easeInQuad`
* `tween.easeOutQuad`


* `tween.easeInOutCubic`
* `tween.easeInCubic`
* `tween.easeOutCubic`


* `tween.easeInOutQuart`
* `tween.easeInQuart`
* `tween.easeOutQuart`


* `tween.easeInOutCirc`
* `tween.easeInCirc`
* `tween.easeOutCirc`


* `tween.easeInOutBack`
* `tween.easeInBack`
* `tween.easeOutBack`


* `tween.easeInOutElastic`
* `tween.easeInElastic`
* `tween.easeOutElastic`


* `tween.easeInOutBounce`
* `tween.easeOutBounce`
* `tween.easeInBounce`
