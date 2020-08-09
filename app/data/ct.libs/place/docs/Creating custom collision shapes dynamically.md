# Creating collision shapes dynamically

> This is useful only when you are going to create copies of different shapes dynamically. In other cases, refer to the Collision checks page, as ct.IDE defines these shapes itself.

Only these Copies which have a `shape` parameter can collide. Usually these parameters are filled by ct.IDE, but you can change them in-game. For examle, this code will represent a Copy as a circle-shaped object with a 50px radius:

```js
this.shape = {
    type: 'circle',
    r: 50
}
```

It is important to create a new `shape` object and not to change existing one, because, e.g., changing `this.shape.r = 10;` will affect the graphic asset a Copy is currently using, which will change the behaviour of all other Copies.

Besides the `shape` parameter, each Copy can have a `ctype` parameter. It is used for grouping Copies into different collision groups, like 'Enemies', 'HeroBullets', 'Obstacles' etc.


## Collision shapes

* `'point'` — does not require any additional parameters;
* `'circle'` — defined by a radius `r`;
* `'rect'` — defined by `left`, `right`, `top`, `bottom`, which mean padding from the center of an object to create a rectangular mask. Usually, all the numbers are positive.
* `'line'` — a line **segment** defined by `x1`, `y1`, `x2` and `y2` coordinates, relative to the copy.