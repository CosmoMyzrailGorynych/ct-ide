**Highly experimental.** Not even barely tested.

EQS stands for Environment Querying System. It is a system that allows your copies to get information about the world that surrounds them, interpret it as points, and then pick the best points suitable for your task.

This can be used in different situations:

* to help enemies' AI pick the best cover spots nearby;
* to create [believable pirate battles](https://comigo.itch.io/stormcross);
* to place pickups and collectibles on procedurally-generated map segments;
* to drive AI movement in a top down, or even side-view world;
* and more!

Examples from the game [Stormcross](https://comigo.itch.io/stormcross):

```js
var player = ct.types.list.PlayerShip[0];
var spot = ct.place.nearest(pirate.x, pirate.y, 'PiratePatrolSpot') || {x: pirate.x, y: pirate.y};

return ct.eqs.query({
    type: 'circle',
    r: 120,
    size: 24,
    x: pirate.aggroed? player.x : spot.x,
    y: pirate.aggroed? player.y : spot.y
})
.score(point => { /* ranking procedure */
    let dist = ct.u.pdc(pirate.x, pirate.y, point.x, point.y);
    point.score += 1 - ct.u.clamp(0, ct.u.unlerp(100, 300, dist), 1);
    if (player) {
        dist = ct.u.pdc(player.x, player.y, point.x, point.y);
        if (dist > 50) {
            point.score += ct.u.clamp(0, ct.u.unlerp(300, 50, dist), 1);
        }
    }
})
.score(ct.eqs.scoreOccupied('Solid'))
.score(ct.eqs.scoreTile(10))
.score(ct.eqs.scoreDirection(pirate.dir, pirate.x, pirate.y, 0.5))
.sort()
.portion(0.25)
.getBetterRandom();
```