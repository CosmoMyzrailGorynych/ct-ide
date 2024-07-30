# Advanced usage

This module bundles the whole Matter.js library. Though it is possible to make an entire game not using Matter.js methods, there are tons of advanced APIs that allow creating soft bodies, 2D cars, ragdolls, complex compound shapes, collision filtering, and other things.

First of all, you can get the physical bodies that are used by copies with `this.matterBody`. Each of these bodies have a backwards reference to ct.js copies at `body.copy`, where `body` is a Matter.js physical body.

All the Matter.js methods are available under the `Matter` object. For example, you can call `Matter.Body.setMass(this.matterBody, 100)` to dynamically change the mass of a copy.

## Further reading

* [Matter.js docs](https://brm.io/matter-js/docs/index.html)
* [Demos](https://brm.io/matter-js/demo/#wreckingBall). You can see their source code by clicking the `{}` icon at the top of each demo.
