This module composes new textures out of existing ones. Say, you have a ping-pong animation or multiple animations in one atlas, and instead of managing these animations with code or duplicating frames you could use this module to logically split animations into separate assets and get rid of duplicate frames.

## How to

The workflow of this module is simple: you add one function call, giving an existing texture name, a new one, and a set of frames to play, and you can use this new texture in the way you use it with default ones. You can add these function calls in the "Settings" tab of this mod to make sure that your code is in the right place.

# ![Source strip](./data/ct.libs/sprite/SlimeExample.png)
# +
```js
sprite(
    'Slime', 'Slime_Idle',
    [0, 1, 2, 3, 2, 1, 0, 0, 0, 4, 5, 4, 0, 4, 5, 4]
);
/* Later, in your project */
this.tex = 'Slime_Idle';
```
# =
![Gif result](./data/ct.libs/sprite/SlimeExample_Result.gif)

---

If we would like to split the source strip into tho separate animations, we would do this:

```js
sprite(
    'Slime', 'Slime_Blink',
    [0, 1, 2, 3, 2, 1, 0, 0, 0]
);
sprite(
    'Slime', 'Slime_Wiggle',
    [0, 4, 5, 4]
);
/* Later, in project's code */
this.tex = random.dice('Slime_Blink', 'Slime_Wiggle);
```
# =
# ![Gif result](./data/ct.libs/sprite/SlimeExample_Blink.gif) or ![Gif result](./data/ct.libs/sprite/SlimeExample_Wiggle.gif)
