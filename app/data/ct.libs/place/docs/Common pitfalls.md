# Common pitfalls

## Collisions work relative to a copy's parent

`place` calculates collisions relative to a copy's parent. As UI layers and game layers live in different coordinates, you cannot reliably check collisions between copies of different coordinate spaces. Due to that, use different collision groups for UI elements and gameplay copies.

## Clipping into copies and tiles after transformation

Rotating or scaling a copy can easily make it "clip into textures". To get out of such sticky situations, you can move your copy away from a collider after executing the movement logic:

```js
var obstacle = place.occupied(this, 'Solid'),
    repelPower = u.time * 300;
if (obstacle) {
    var repelDirection = u.pdn(obstacle.x, obstacle.y, this.x, this.y);
    this.speed = 0;
    // Repel the copy from the collider
    this.x += this.xprev + u.ldx(repelPower, repelDirection);
    this.y += this.yprev + u.ldy(repelPower, repelDirection);
}
```
