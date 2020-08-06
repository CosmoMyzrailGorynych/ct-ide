# Common pitfalls

## Tiles are always rectangular

No matter what you define in the Textures tab, `ct.place.tile` will always recognise tiles as rectangles: it greatly increases performance. If you need tiles of other shapes, consider using copies instead of tile layers.

## Collisions work relative to a copy's parent

`ct.place` calculates collisions relative to a copy's parent. As UI layers and game layers live in different coordinates, you cannot reliably check collisions between copies of different coordinate spaces. Due to that, use different collision groups for UI elements and gameplay copies.

## Clipping into copies after transformation

Rotating or scaling a copy can easily make it "clip into textures". To get out of such sticky situations, you can move your copy away from a collider after executing the movement logic:

```js
var obstacle = ct.place.occupied(this, 'Solid'),
    repelPower = ct.delta * 5;
if (obstacle) {
    var repelDirection = ct.u.pdn(obstacle.x, obstacle.y, this.x, this.y);
    this.speed = 0;
    // Repel the copy from the collider
    this.x += this.xprev + ct.u.ldx(repelPower, repelDirection);
    this.y += this.yprev + ct.u.ldy(repelPower, repelDirection);
}
```