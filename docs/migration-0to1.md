# Migration Guide

Version 1.0 is slightly different from 0.5.2 and earlier versions of ct.js. These changes include movement and, at its bigger part, drawing. Here are some tips and examples on how to update your 0.x project to 1.x.

## Movement

Movement is generally the same, though you should note, that some variables are now renamed, and their older variants are deprecated and work a bit slower:

* `dir` is now `direction`;
* `spd` → `speed`;
* `grav` → `gravity`;
* `dravdir` → `gravityDir`.

Such variables as `speed`, `gravity` still reflect a number of pixels added each frame, but, as the default framerate is 60 now, you should cut them in half if you used 30 FPS.

Additionally, two new variables were introduced: `hspeed` and `vspeed`. You can read and write to them.

Under the hood, the default movement system is now based on vertical an horizontal speed, not on direction and overall speed. Some inconsistencies may arise, though, especially with specific orders of execution:

```js
this.speed = 4;
this.direction = 90;
```

Everything is ok, `this.vspeed` is now -4.

```js
this.direction = 90;
this.speed = 4;
```

`this.direction = 90` makes no sense here, because `this.vspeed` and `this.hspeed` are equal to 0 and this rotation had no effect.

When making incremental movement without default variables, or when adding acceleration, you should multiply your numbers with `ct.delta`. So, instead of this:

```js
this.speed += 0.5;
this.x -= 10;
```

You should write:

```js
this.speed += 0.5 * ct.delta;
this.x -= 10 * ct.delta;
```

It is not necessary, yet recommended, as it helps to provide consistent movement with any framerate. 

`this.move();` utilizes `ct.delta`, so the default movement system will be consistent on every framerate by default.

## Transformations
Writing `this.transform = true;` will break your game now (C`annot create property '_parentID' on boolean 'true'`), as `transform` is now an object.

Instead of writing this:

```js
this.transform = true;
this.tx = 0.5;
this.ty = -1;
this.tr = 45;
this.ta = 0.5;
```

You should write this:

```js
this.scale.x = 0.5;
this.scale.y = 0.5;
this.rotation = 45;
this.alpha = 0.5;
```

## Drawing text labels

First off: you can't directly draw in the Draw event now. Instead, you should create an object to draw (e.g. in the On Create event), and add it to your room or attach to an object.

So, instead of:

```js
ct.styles.set('ScoreText');
ct.draw.text('Score: ' + this.score, 20, 20);
ct.styles.reset();
```

You should write this to your On Create code:

```js
this.scoreLabel = new PIXI.Text('Score: ' + this.score, ct.styles.get('ScoreText'));
this.scoreLabel.x = this.scoreLabel.y = 20;
this.addChild(this.scoreLabel);
```

And update the label in the Draw event:

```js
this.scoreLabel.text = 'Score: ' + this.score;
```

## Timers
Instead of:

```js
this.shootTimer--;
```

Better write:

```js
this.shootTimer -= ct.delta;
```

## View boundaries

Instead of `ct.room.width` and `ct.room.height` use `ct.width` and `ct.height` only. These are different concepts now, and `ct.room.width` and `ct.room.height` changes over time.