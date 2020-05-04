## ct.tween.add(options: object)

Creates a new tween effect and adds it to the game loop.

* `options` — an object with options:
    * `options.obj` An object to animate. All objects are supported.
    * `options.fields` A map with pairs `fieldName: newValue`. Values must be of numerical type.
    * `options.curve` An interpolating function. You can write your own, or use default ones written below. The default one is `ct.tween.ease`.
    * `options.duration` The duration of easing, in milliseconds.
    * `options.useUiDelta` If true, use `ct.deltaUi` instead of `ct.delta`. The default is `false`.

Returns a Promise which is resolved if the effect was fully played, or rejected if it was interrupted manually by code, room switching or Copy kill.

You can call a `stop()` method on this promise to interrupt it manually.

### Example

```js
this.moving = true;
this.depth = 1;

ct.tween.add({
    obj: this,
    fields: {
        x: targetX,
        y: targetY
    },
    duration: 250
}).then(() => {
    this.depth = 0;
    this.moving = false;
});
```

### Default interpolation methods

* `ct.tween.linear`

* `ct.tween.ease`, or `ct.tween.easeInOutQuad` (alias, default)
* `ct.tween.easeInQuad`
* `ct.tween.easeOutQuad`

* `ct.tween.easeInOutCubic`
* `ct.tween.easeInCubic`
* `ct.tween.easeOutCubic`

* `ct.tween.easeInOutQuart`
* `ct.tween.easeInQuart`
* `ct.tween.easeOutQuart`

* `ct.tween.easeInOutCirc`
* `ct.tween.easeInCirc`
* `ct.tween.easeOutCirc`