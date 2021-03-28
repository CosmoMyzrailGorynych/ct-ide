# ct.filters

This module is a collection of shader filters.
It includes [PixiJS built-in filters](https://pixijs.download/dev/docs/PIXI.filters.html) and [additional PixiJS community-authored filters](https://filters.pixijs.download/main/docs/PIXI.filters.html) (version 3.2.2, 30 december 2020).

For each filter, you can check the PixiJS doc (links above) or use the ct.js autocomplete (to get all filters, all options of each filter, descriptions, types, and default values).

You can also interactively play with those filters to see how they work [here](https://pixijs.io/pixi-filters/tools/demo/).

## How it works?

All PIXI.DisplayObject (stage, room, copy, container, etc.) have a `filters` property.
It's an `array`.
You can add/remove/enable/disable several filters on the same element (beware of performance of course).

## How to add a filter with default options?

```js
const fx = ct.filters.addCRT(this);
```

## How to add a filter with mandatory params?

```js
// Replaces pure red with pure blue, and replaces pure green with pure white
const replacements = [
  [0xff0000, 0x0000ff],
  [0x00ff00, 0xffffff],
];
const fx = ct.filters.addMultiColorReplace(this, replacements);
```

## How to edit a filter?

```js
const fx = ct.filters.addGlow(this);
fx.color = 0xff004d;
fx.innerStrength = 1;
```

If you type `fx.` the autocomplete will show all the available options (with description, type and default value) for that filter.

Tip: You can `console.log` your `fx`, unfold the object and live tweak properties.

## Example of a very interesting filter with presets/methods:

```js
const fx = ct.filters.addColorMatrix(this);
// You can determine your own color matrix:
fx.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
// Or use some nice predefined ones:
fx.night(0.1, true);
fx.polaroid(true);
fx.vintage(true);
```

For more (`browni`, `kodachrome`, `predator`, etc.) check the doc:
http://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html

## How to enable/disable a filter?

```js
const fx = ct.filters.addGodray(this);
fx.enabled = false;
```

If enabled is `true` the filter is applied, if `false` it will not.

## How to remove a filter?

```js
const fx = ct.filters.addCRT(this);
ct.filters.removeFilter(this, fx);
```

It removes a filter (`fx` in this example) from `this.filters`.

## How to add a custom filter?

```js
const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float red;
uniform float green;
uniform float blue;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);
    vec3 rgb = c.rgb;
    rgb.r *= red;
    rgb.g *= green;
    rgb.b *= blue;
    c.rgb = rgb;
    gl_FragColor = c;
}
`;

const uniforms = {
red: 1,
green: 0.8,
blue: 0.2}

const fx = ct.filters.custom(this, undefined, fragment, uniforms);
```
Mind, PIXI has a default vertex shader and a default fragment shader.
For more info, you can check these links:

* https://pixijs.download/dev/docs/PIXI.Filter.html
* https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters
