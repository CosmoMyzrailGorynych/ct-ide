# Light system

This module adds properties to your rooms and types that allow creating lights and day/night cycle:

1. Firstly, set the ambient color inside your room's properties. The darker it is, the darker your room will be, and light effects will be more visible.
2. Then open the types you want to add lights to, and select a light texture. You can later remove it by clicking the texture selector again and picking "None" at the start of the texture list.
3. Adjust the size of the light, as well as its color. If you need to make the light less intensive, change its brightness.

*Tip: you can use colored textures to produce interesting light effects! For example, bloom from a stained glass, or some magical effects.*

> **If you don't see lights with big textures, make sure to mark them as backgrounds.**

## Changing lights through code

Each copy with a light will have a property `this.light`, which is a PIXI.Sprite. It has properties similar to copies, though you cannot transform them directly. For example, you can set light's opacity — its intensity — with `this.light.alpha = 0.35;`.

To temporarily disable a light, either set `this.light.opacity` to `0` or set `this.light.visible` to `false`.

Lights exist on a separate drawing layer with coordinates different from both UI and gameplay coordinates, and thus you cannot directly transform them — at least reliably.

**To shift a light** relative to its owner, change its pivot. For example, this will shift the light a bit to the right and noticeably to the top:

```js
this.light.pivot.x = -50;
this.light.pivot.y = 150;
```

Note that changing pivot pushes a light in the opposite direction.

**To rotate a light**, set its `rotationFactor` in degrees. For example, this line will rotate a light by 90 degrees counter-clockwise:

```js
this.light.rotationFactor = 90;
```

This works cumulatively with light owner's rotation.

**To both shift and rotate a light**, consider creating a new invisible copy that is shifted relative to its owner. Otherwise you will get your light spinning on some radius instead around a point.

**Do your lights align weirdly?** Make sure you've set up the axis of a used texture.

**To change light's color,** set its tint value similar to copies. For example, this line will make the ligth red:

```js
this.light.tint = 0xff0000;
```

**To scale a light**, change the property `this.light.scaleFactor`. The initial value matches the one you've set inside your type. A value of `1` means no scaling is applied relative to the owning copy.

## Reading and changing ambient light color

Ambient light can be read and set with a property `ct.light.ambientColor`. It is a pixi color, similar to copies' `tint` property. For example, this line will make the room pitch black:

```js
ct.light.ambientColor = 0x000000;
```

You can also change the intensity of the whole light system by changing the property `ct.light.opacity`.

## Adding lights without darkening a room

If you want to add bloom or bright light effects in an already lit room, you don't need ct.light for it! You can create a copy with light's texture, and write `this.blendMode = PIXI.BLEND_MODES.ADD;` in its OnCreate code.

## Adding and removing lights programmatically

You can **add a light** with a method `ct.light.add(texture, x, y, options)`.

* `texture` must be a Pixi.js texture. To get one from ct.js, use `ct.res.getTexture('TextureName', 0);`
* `x` and `y` are global position of a light.
* `options` is an object that can include:
  * `tint` — a Pixi.js color that changes light's color. Use 0xFFFFFF for full white color.
  * `scaleFactor` — scale of the light. `1` is the usual scale.
  * `owner` — a copy that owns this light. It is used to follow the copy and to be properly positioned in the world.
  * `copyOpacity` — used with `owner`. Tells to copy `this.opacity` from a copy, meaning that they two will fade together.

For example:

```js
ct.light.add(
    ct.res.getTexture('AlarmGlowMask', 0),
    0, 0, {
      owner: this,
      tint: 0xFF0000
    }
);
```

This will create a ligth based on the first (zeroish) frame of a texture called `AlarmGlowMask`, and make it red.

You can **remove a light** with a method `ct.light.remove(copyOrLight);`.
You can either pass an owning copy or the light itself.