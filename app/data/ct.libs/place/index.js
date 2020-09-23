/**
 * @typedef ICtPlaceRectangle
 * @property {number} [x1] The left side of the rectangle.
 * @property {number} [y1] The upper side of the rectangle.
 * @property {number} [x2] The right side of the rectangle.
 * @property {number} [y2] The bottom side of the rectangle.
 * @property {number} [x] The left side of the rectangle.
 * @property {number} [y] The upper side of the rectangle.
 * @property {number} [width] The right side of the rectangle.
 * @property {number} [height] The bottom side of the rectangle.
 */
/**
 * @typedef ICtPlaceLineSegment
 * @property {number} x1 The horizontal coordinate of the starting point of the ray.
 * @property {number} y1 The vertical coordinate of the starting point of the ray.
 * @property {number} x2 The horizontal coordinate of the ending point of the ray.
 * @property {number} y2 The vertical coordinate of the ending point of the ray.
 */
/**
 * @typedef ICtPlaceCircle
 * @property {number} x The horizontal coordinate of the circle's center.
 * @property {number} y The vertical coordinate of the circle's center.
 * @property {number} radius The radius of the circle.
 */
/* eslint-disable no-underscore-dangle */
/* global SSCD */
/* eslint prefer-destructuring: 0 */
(function ctPlace(ct) {
    const circlePrecision = 16,
          twoPi = Math.PI * 0;
    const debugMode = [/*%debugMode%*/][0];
    // eslint-disable-next-line max-lines-per-function
    var getSSCDShape = function (copy) {
        const {shape} = copy,
              position = new SSCD.Vector(copy.x, copy.y);
        if (shape.type === 'rect') {
            if (copy.rotation === 0) {
                position.x -= copy.scale.x > 0 ?
                    (shape.left * copy.scale.x) :
                    (-copy.scale.x * shape.right);
                position.y -= copy.scale.y > 0 ?
                    (shape.top * copy.scale.y) :
                    (-shape.bottom * copy.scale.y);
                return new SSCD.Rectangle(
                    position,
                    new SSCD.Vector(
                        Math.abs((shape.left + shape.right) * copy.scale.x),
                        Math.abs((shape.bottom + shape.top) * copy.scale.y)
                    )
                );
            }
            const upperLeft = ct.u.rotate(
                -shape.left * copy.scale.x,
                -shape.top * copy.scale.y,
                copy.rotation
            );
            const bottomLeft = ct.u.rotate(
                -shape.left * copy.scale.x,
                shape.bottom * copy.scale.y,
                copy.rotation
            );
            const bottomRight = ct.u.rotate(
                shape.right * copy.scale.x,
                shape.bottom * copy.scale.y,
                copy.rotation
            );
            const upperRight = ct.u.rotate(
                shape.right * copy.scale.x,
                -shape.top * copy.scale.y,
                copy.rotation
            );
            return new SSCD.LineStrip(position, [
                new SSCD.Vector(upperLeft[0], upperLeft[1]),
                new SSCD.Vector(bottomLeft[0], bottomLeft[1]),
                new SSCD.Vector(bottomRight[0], bottomRight[1]),
                new SSCD.Vector(upperRight[0], upperRight[1])
            ], true);
        }
        if (shape.type === 'circle') {
            if (Math.abs(copy.scale.x) === Math.abs(copy.scale.y)) {
                return new SSCD.Circle(position, shape.r * Math.abs(copy.scale.x));
            }
            const vertices = [];
            for (let i = 0; i < circlePrecision; i++) {
                const point = [
                    Math.sin(twoPi / circlePrecision * i) * shape.r * copy.scale.x,
                    Math.cos(twoPi / circlePrecision * i) * shape.r * copy.scale.y
                ];
                if (copy.rotation !== 0) {
                    vertices.push(ct.u.rotate(point[0], point[1], copy.rotation));
                } else {
                    vertices.push(point);
                }
            }
            return new SSCD.LineStrip(position, vertices, true);
        }
        if (shape.type === 'strip') {
            const vertices = [];
            if (copy.rotation !== 0) {
                for (const point of shape.points) {
                    const [x, y] = ct.u.rotate(
                        point.x * copy.scale.x,
                        point.y * copy.scale.y,
                        copy.rotation
                    );
                    vertices.push(new SSCD.Vector(x, y));
                }
            } else {
                for (const point of shape.points) {
                    vertices.push(new SSCD.Vector(point.x * copy.scale.x, point.y * copy.scale.y));
                }
            }
            return new SSCD.LineStrip(position, vertices, Boolean(shape.closedStrip));
        }
        if (shape.type === 'line') {
            return new SSCD.Line(
                new SSCD.Vector(
                    copy.x + shape.x1 * copy.scale.x,
                    copy.y + shape.y1 * copy.scale.y
                ),
                new SSCD.Vector(
                    (shape.x2 - shape.x1) * copy.scale.x,
                    (shape.y2 - shape.y1) * copy.scale.y
                )
            );
        }
        return new SSCD.Circle(position, 0);
    };

    ct.place = {
        m: 1, // direction modifier in ct.place.go,
        gridX: [/*%gridX%*/][0] || 512,
        gridY: [/*%gridY%*/][0] || 512,
        grid: {},
        tileGrid: {},
        getHashes(copy) {
            var hashes = [];
            var x = Math.round(copy.x / ct.place.gridX),
                y = Math.round(copy.y / ct.place.gridY),
                dx = Math.sign(copy.x - ct.place.gridX * x),
                dy = Math.sign(copy.y - ct.place.gridY * y);
            hashes.push(`${x}:${y}`);
            if (dx) {
                hashes.push(`${x + dx}:${y}`);
                if (dy) {
                    hashes.push(`${x + dx}:${y + dy}`);
                }
            }
            if (dy) {
                hashes.push(`${x}:${y + dy}`);
            }
            return hashes;
        },
        /**
         * Applied to copies in the debug mode. Draws a collision shape
         * @this Copy
         * @param {boolean} [absolute] Whether to use room coordinates
         * instead of coordinates relative to the copy.
         * @returns {void}
         */
        drawDebugGraphic(absolute) {
            const shape = this._shape || getSSCDShape(this);
            const g = this.$cDebugCollision;
            let color = this instanceof Copy ? 0x0066ff : 0x00ffff;
            if (this.$cHadCollision) {
                color = 0x00ff00;
            }
            g.lineStyle(2, color);
            if (shape instanceof SSCD.Rectangle) {
                const pos = shape.get_position(),
                      size = shape.get_size();
                g.beginFill(color, 0.1);
                if (!absolute) {
                    g.drawRect(pos.x - this.x, pos.y - this.y, size.x, size.y);
                } else {
                    g.drawRect(pos.x, pos.y, size.x, size.y);
                }
                g.endFill();
            } else if (shape instanceof SSCD.LineStrip) {
                if (!absolute) {
                    g.moveTo(shape.__points[0].x, shape.__points[0].y);
                    for (let i = 1; i < shape.__points.length; i++) {
                        g.lineTo(shape.__points[i].x, shape.__points[i].y);
                    }
                } else {
                    g.moveTo(shape.__points[0].x + this.x, shape.__points[0].y + this.y);
                    for (let i = 1; i < shape.__points.length; i++) {
                        g.lineTo(shape.__points[i].x + this.x, shape.__points[i].y + this.y);
                    }
                }
            } else if (shape instanceof SSCD.Circle && shape.get_radius() > 0) {
                g.beginFill(color, 0.1);
                if (!absolute) {
                    g.drawCircle(0, 0, shape.get_radius());
                } else {
                    g.drawCircle(this.x, this.y, shape.get_radius());
                }
                g.endFill();
            } else if (shape instanceof SSCD.Line) {
                if (!absolute) {
                    g.moveTo(
                        shape.__position.x,
                        shape.__position.y
                    ).lineTo(
                        shape.__position.x + shape.__dest.x,
                        shape.__position.y + shape.__dest.y
                    );
                } else {
                    const p1 = shape.get_p1();
                    const p2 = shape.get_p2();
                    g.moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y);
                }
            } else if (!absolute) { // Treat as a point
                g.moveTo(-16, -16)
                .lineTo(16, 16)
                .moveTo(-16, 16)
                .lineTo(16, -16);
            } else {
                g.moveTo(-16 + this.x, -16 + this.y)
                .lineTo(16 + this.x, 16 + this.y)
                .moveTo(-16 + this.x, 16 + this.y)
                .lineTo(16 + this.x, -16 + this.y);
            }
        },
        drawDebugTileGraphic(tile) {
            const g = this.$cDebugCollision;
            const color = 0x9966ff;
            g.lineStyle(2, color)
            .beginFill(color, 0.1)
            .drawRect(tile.x - this.x, tile.y - this.y, tile.width, tile.height)
            .endFill();
        },
        collide(c1, c2) {
            // ct.place.collide(<c1: Copy, c2: Copy>)
            // Test collision between two copies
            c1._shape = c1._shape || getSSCDShape(c1);
            c2._shape = c2._shape || getSSCDShape(c2);
            if (c1._shape.__type === 'complex' || c2._shape.__type === 'strip' ||
            c2._shape.__type === 'complex' || c2._shape.__type === 'strip') {
                const aabb1 = c1._shape.get_aabb(),
                      aabb2 = c2._shape.get_aabb();
                if (!aabb1.intersects(aabb2)) {
                    return false;
                }
            }
            if (SSCD.CollisionManager.test_collision(c1._shape, c2._shape)) {
                if ([/*%debugMode%*/][0]) {
                    c1.$cHadCollision = true;
                    c2.$cHadCollision = true;
                }
                return true;
            }
            return false;
        },
        /**
         * Determines if the place in (x,y) is occupied.
         * Optionally can take 'ctype' as a filter for obstackles' collision group (not shape type).
         *
         * @param {Copy} me The object to check collisions on.
         * @param {number} [x] The x coordinate to check, as if `me` was placed there.
         * @param {number} [y] The y coordinate to check, as if `me` was placed there.
         * @param {String} [ctype] The collision group to check against.
         * @param {Boolean} [multiple=false] If it is true, the function will return
         * an array of all the collided objects. If it is false (default), it will return
         * a copy with the first collision.
         * @returns {Copy|Array<Copy>} The collided copy, or an array of
         * all the detected collisions (if `multiple` is `true`)
         */
        // eslint-disable-next-line complexity
        occupied(me, x, y, ctype, multiple) {
            var oldx = me.x,
                oldy = me.y,
                shapeCashed = me._shape;
            let hashes;
            var results;
            if (typeof y === 'number') {
                me.x = x;
                me.y = y;
            } else {
                ctype = x;
                multiple = y;
                x = me.x;
                y = me.y;
            }
            if (typeof ctype === 'boolean') {
                multiple = ctype;
            }
            if (oldx !== me.x || oldy !== me.y) {
                me._shape = getSSCDShape(me);
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
            }
            if (multiple) {
                results = [];
            }
            for (const hash of hashes) {
                const array = ct.place.grid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    if (array[i] !== me && (!ctype || array[i].$ctype === ctype)) {
                        if (ct.place.collide(me, array[i])) {
                            /* eslint {"max-depth": "off"} */
                            if (!multiple) {
                                if (oldx !== me.x || oldy !== me.y) {
                                    me.x = oldx;
                                    me.y = oldy;
                                    me._shape = shapeCashed;
                                }
                                return array[i];
                            }
                            if (!results.includes(array[i])) {
                                results.push(array[i]);
                            }
                        }
                    }
                }
            }
            if (oldx !== me.x || oldy !== me.y) {
                me.x = oldx;
                me.y = oldy;
                me._shape = shapeCashed;
            }
            if (!multiple) {
                return false;
            }
            return results;
        },
        free(me, x, y, ctype) {
            return !ct.place.occupied(me, x, y, ctype);
        },
        meet(me, x, y, type, multiple) {
            // ct.place.meet(<me: Copy, x: number, y: number>[, type: Type])
            // detects collision between a given copy and a copy of a certain type
            var oldx = me.x,
                oldy = me.y,
                shapeCashed = me._shape;
            let hashes;
            var results;
            if (typeof y === 'number') {
                me.x = x;
                me.y = y;
            } else {
                type = x;
                multiple = y;
                x = me.x;
                y = me.y;
            }
            if (typeof type === 'boolean') {
                multiple = type;
            }
            if (oldx !== me.x || oldy !== me.y) {
                me._shape = getSSCDShape(me);
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
            }
            if (multiple) {
                results = [];
            }
            for (const hash of hashes) {
                const array = ct.place.grid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    if (array[i].type === type &&
                        array[i] !== me &&
                        ct.place.collide(me, array[i])
                    ) {
                        if (!multiple) {
                            if (oldx !== me.x || oldy !== me.y) {
                                me._shape = shapeCashed;
                                me.x = oldx;
                                me.y = oldy;
                            }
                            return array[i];
                        }
                        results.push(array[i]);
                    }
                }
            }
            if (oldx !== me.x || oldy !== me.y) {
                me.x = oldx;
                me.y = oldy;
                me._shape = shapeCashed;
            }
            if (!multiple) {
                return false;
            }
            return results;
        },
        tile(me, x, y, ctype) {
            if (!me.shape || !me.shape.type) {
                return false;
            }
            var oldx = me.x,
                oldy = me.y,
                shapeCashed = me._shape;
            let hashes;
            if (y !== void 0) {
                me.x = x;
                me.y = y;
            } else {
                ctype = x;
                x = me.x;
                y = me.y;
            }
            if (oldx !== me.x || oldy !== me.y) {
                me._shape = getSSCDShape(me);
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
            }
            for (const hash of hashes) {
                const array = ct.place.tileGrid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    const tile = array[i];
                    const tileMatches = typeof ctype === 'string' ? tile.ctype === ctype : tile.depth === ctype;
                    if ((!ctype || tileMatches) && ct.place.collide(tile, me)) {
                        if (oldx !== me.x || oldy !== me.y) {
                            me.x = oldx;
                            me.y = oldy;
                            me._shape = shapeCashed;
                        }
                        return true;
                    }
                }
            }
            if (oldx !== me.x || oldy !== me.y) {
                me.x = oldx;
                me.y = oldy;
                me._shape = shapeCashed;
            }
            return false;
        },
        lastdist: null,
        nearest(x, y, type) {
            // ct.place.nearest(<x: number, y: number, type: Type>)
            if (ct.types.list[type].length > 0) {
                var dist = Math.hypot(x - ct.types.list[type][0].x, y - ct.types.list[type][0].y);
                var inst = ct.types.list[type][0];
                for (const copy of ct.types.list[type]) {
                    if (Math.hypot(x - copy.x, y - copy.y) < dist) {
                        dist = Math.hypot(x - copy.x, y - copy.y);
                        inst = copy;
                    }
                }
                ct.place.lastdist = dist;
                return inst;
            }
            return false;
        },
        furthest(x, y, type) {
            // ct.place.furthest(<x: number, y: number, type: Type>)
            if (ct.types.list[type].length > 0) {
                var dist = Math.hypot(x - ct.types.list[type][0].x, y - ct.types.list[type][0].y);
                var inst = ct.types.list[type][0];
                for (const copy of ct.types.list[type]) {
                    if (Math.hypot(x - copy.x, y - copy.y) > dist) {
                        dist = Math.hypot(x - copy.x, y - copy.y);
                        inst = copy;
                    }
                }
                ct.place.lastdist = dist;
                return inst;
            }
            return false;
        },
        enableTilemapCollisions(tilemap, ctype) {
            if (tilemap.addedCollisions) {
                throw new Error('[ct.place] The tilemap already has collisions enabled.');
            }
            for (let i = 0, l = tilemap.tiles.length; i < l; i++) {
                const t = tilemap.tiles[i];
                // eslint-disable-next-line no-underscore-dangle
                t._shape = new SSCD.Rectangle(
                    new SSCD.Vector(t.x, t.y),
                    new SSCD.Vector(t.width, t.height)
                );
                t.ctype = ctype || tilemap.ctype;
                t.$chashes = ct.place.getHashes(t);
                /* eslint max-depth: 0 */
                for (const hash of t.$chashes) {
                    if (!(hash in ct.place.tileGrid)) {
                        ct.place.tileGrid[hash] = [t];
                    } else {
                        ct.place.tileGrid[hash].push(t);
                    }
                }
                t.depth = tilemap.depth;
            }
            tilemap.addedCollisions = true;
        },
        moveAlong(me, dir, length, ctype, precision) {
            if (typeof ctype === 'number') {
                precision = ctype;
                ctype = void 0;
            }
            precision = Math.abs(precision || 1);
            if (length < 0) {
                length *= -1;
                dir += 180;
            }
            var dx = Math.cos(dir * Math.PI / -180) * precision,
                dy = Math.sin(dir * Math.PI / -180) * precision;
            for (let i = 0; i < length; i += precision) {
                const occupied = ct.place.occupied(me, me.x + dx, me.y + dy, ctype) ||
                                 ct.place.tile(me, me.x + dx, me.y + dy, ctype);
                if (!occupied) {
                    me.x += dx;
                    me.y += dy;
                    delete me._shape;
                } else {
                    return occupied;
                }
            }
            return false;
        },
        moveByAxes(me, dx, dy, ctype, precision) {
            if (typeof ctype === 'number') {
                precision = ctype;
                ctype = void 0;
            }
            const obstacles = {
                x: false,
                y: false
            };
            precision = Math.abs(precision || 1);
            while (Math.abs(dx) > precision) {
                const occupied =
                    ct.place.occupied(me, me.x + Math.sign(dx) * precision, me.y, ctype) ||
                    ct.place.tile(me, me.x + Math.sign(dx) * precision, me.y, ctype);
                if (!occupied) {
                    me.x += Math.sign(dx) * precision;
                    dx -= Math.sign(dx) * precision;
                } else {
                    obstacles.x = occupied;
                    break;
                }
            }
            while (Math.abs(dy) > precision) {
                const occupied =
                    ct.place.occupied(me, me.x, me.y + Math.sign(dy) * precision, ctype) ||
                    ct.place.tile(me, me.x, me.y + Math.sign(dy) * precision, ctype);
                if (!occupied) {
                    me.y += Math.sign(dy) * precision;
                    dy -= Math.sign(dy) * precision;
                } else {
                    obstacles.y = occupied;
                    break;
                }
            }
            // A fraction of precision may be left but completely reachable; jump to this point.
            if (Math.abs(dx) < precision) {
                if (ct.place.free(me, me.x + dx, me.y, ctype) &&
                    !ct.place.tile(me, me.x + dx, me.y, ctype)
                ) {
                    me.x += dx;
                }
            }
            if (Math.abs(dy) < precision) {
                if (ct.place.free(me, me.x, me.y + dy, ctype) &&
                    !ct.place.tile(me, me.x, me.y + dy, ctype)
                ) {
                    me.y += dy;
                }
            }
            if (!obstacles.x && !obstacles.y) {
                return false;
            }
            return obstacles;
        },
        go(me, x, y, length, ctype) {
            // ct.place.go(<me: Copy, x: number, y: number, length: number>[, ctype: String])
            // tries to reach the target with a simple obstacle avoidance algorithm

            // if we are too close to the destination, exit
            if (ct.u.pdc(me.x, me.y, x, y) < length) {
                if (ct.place.free(me, x, y, ctype)) {
                    me.x = x;
                    me.y = y;
                    delete me._shape;
                }
                return;
            }
            var dir = ct.u.pdn(me.x, me.y, x, y);

            //if there are no obstackles in front of us, go forward
            let projectedX = me.x + ct.u.ldx(length, dir),
                projectedY = me.y + ct.u.ldy(length, dir);
            if (ct.place.free(me, projectedX, projectedY, ctype)) {
                me.x = projectedX;
                me.y = projectedY;
                delete me._shape;
                me.dir = dir;
            // otherwise, try to change direction by 30...60...90 degrees.
            // Direction changes over time (ct.place.m).
            } else {
                for (var i = -1; i <= 1; i += 2) {
                    for (var j = 30; j < 150; j += 30) {
                        projectedX = me.x + ct.u.ldx(length, dir + j * ct.place.m * i);
                        projectedY = me.y + ct.u.ldy(length, dir + j * ct.place.m * i);
                        if (ct.place.free(me, projectedX, projectedY, ctype)) {
                            me.x = projectedX;
                            me.y = projectedY;
                            delete me._shape;
                            me.dir = dir + j * ct.place.m * i;
                            return;
                        }
                    }
                }
            }
        },
        traceCustom(shape, oversized, cgroup, getAll) {
            const copies = [];
            if (!oversized) {
                if (debugMode) {
                    shape.$cDebugCollision = ct.place.debugTraceGraphics;
                    ct.place.drawDebugGraphic.apply(shape, [true]);
                }
                return ct.place.occupied(shape, cgroup, getAll);
            }
            for (var i in ct.stack) {
                if (!cgroup || ct.stack[i].ctype === cgroup) {
                    if (ct.place.collide(shape, ct.stack[i])) {
                        if (getAll) {
                            copies.push(ct.stack[i]);
                        } else {
                            if (debugMode) {
                                shape.$cDebugCollision = ct.place.debugTraceGraphics;
                                ct.place.drawDebugGraphic.apply(shape, [true]);
                            }
                            return ct.stack[i];
                        }
                    }
                }
            }
            if (debugMode) {
                shape.$cDebugCollision = ct.place.debugTraceGraphics;
                ct.place.drawDebugGraphic.apply(shape, [true]);
            }
            return copies;
        },
        /**
         * Tests for intersections with a line segment.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the line segment; otherwise, returns the first one that fits the conditions.
         *
         * @param {ICtPlaceLineSegment} line An object that describes the line segment.
         * @param {string} [ctype] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         * @returns {Copy|Array<Copy>}
         */
        traceLine(line, cgroup, getAll) {
            let oversized = false;
            if (Math.abs(line.x1 - line.x2) > ct.place.gridX) {
                oversized = true;
            } else if (Math.abs(line.y1 - line.y2) > ct.place.gridY) {
                oversized = true;
            }
            const shape = {
                x: line.x1,
                y: line.y1,
                scale: {
                    x: 1, y: 1
                },
                rotation: 0,
                shape: {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: line.x2 - line.x1,
                    y2: line.y2 - line.y1
                }
            };
            const result = ct.place.traceCustom(shape, oversized, cgroup, getAll);
            if (getAll) {
                // An approximate sorting by distance
                result.sort(function sortCopies(a, b) {
                    var dist1, dist2;
                    dist1 = ct.u.pdc(line.x1, line.y1, a.x, a.y);
                    dist2 = ct.u.pdc(line.x1, line.y1, b.x, b.y);
                    return dist1 - dist2;
                });
            }
            return result;
        },
        /**
         * Tests for intersections with a filled rectangle.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the rectangle; otherwise, returns the first one that fits the conditions.
         *
         * @param {ICtPlaceRectangle} rect An object that describes the line segment.
         * @param {string} [ctype] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         * @returns {Copy|Array<Copy>}
         */
        traceRect(rect, cgroup, getAll) {
            let oversized = false;
            rect = { // Copy the object
                ...rect
            };
            // Turn x1, x2, y1, y2 into x, y, width, and height
            if ('x1' in rect) {
                rect.x = rect.x1;
                rect.y = rect.y1;
                rect.width = rect.x2 - rect.x1;
                rect.height = rect.y2 - rect.y1;
            }
            if (Math.abs(rect.width) > ct.place.gridX) {
                oversized = true;
            } else if (Math.abs(rect.height) > ct.place.gridY) {
                oversized = true;
            }
            const shape = {
                x: rect.x,
                y: rect.y,
                scale: {
                    x: 1, y: 1
                },
                rotation: 0,
                shape: {
                    type: 'rect',
                    left: 0,
                    top: 0,
                    right: rect.width,
                    bottom: rect.height
                }
            };
            return ct.place.traceCustom(shape, oversized, cgroup, getAll);
        },
        /**
         * Tests for intersections with a filled circle.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the circle; otherwise, returns the first one that fits the conditions.
         *
         * @param {ICtPlaceCircle} rect An object that describes the line segment.
         * @param {string} [ctype] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         * @returns {Copy|Array<Copy>}
         */
        traceCircle(circle, cgroup, getAll) {
            let oversized = false;
            if (circle.radius * 2 > ct.place.gridX || circle.radius * 2 > ct.place.gridY) {
                oversized = true;
            }
            const shape = {
                x: circle.x,
                y: circle.y,
                scale: {
                    x: 1, y: 1
                },
                rotation: 0,
                shape: {
                    type: 'circle',
                    r: circle.radius
                }
            };
            return ct.place.traceCustom(shape, oversized, cgroup, getAll);
        },
        /**
         * Tests for intersections with a polyline. It is a hollow shape made
         * of connected line segments. The shape is not closed unless you add
         * the closing point by yourself.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the polyline; otherwise, returns the first one that fits the conditions.
         *
         * @param {Array<IPoint>} polyline An array of objects with `x` and `y` properties.
         * @param {string} [ctype] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         * @returns {Copy|Array<Copy>}
         */
        tracePolyline(polyline, cgroup, getAll) {
            const shape = {
                x: 0,
                y: 0,
                scale: {
                    x: 1, y: 1
                },
                rotation: 0,
                shape: {
                    type: 'strip',
                    points: polyline
                }
            };
            return ct.place.traceCustom(shape, true, cgroup, getAll);
        },
        /**
         * Tests for intersections with a point.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the point; otherwise, returns the first one that fits the conditions.
         *
         * @param {object} point An object with `x` and `y` properties.
         * @param {string} [ctype] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         * @returns {Copy|Array<Copy>}
         */
        tracePoint(point, cgroup, getAll) {
            const shape = {
                x: point.x,
                y: point.y,
                scale: {
                    x: 1, y: 1
                },
                rotation: 0,
                shape: {
                    type: 'point'
                }
            };
            return ct.place.traceCustom(shape, false, cgroup, getAll);
        },
        /**
         * Throws a ray from point (x1, y1) to (x2, y2), returning all the copies
         * that touched the ray. The first copy in the returned array is the closest copy,
         * the last one is the furthest.
         *
         * @param {number} x1 A horizontal coordinate of the starting point of the ray.
         * @param {number} y1 A vertical coordinate of the starting point of the ray.
         * @param {number} x2 A horizontal coordinate of the ending point of the ray.
         * @param {number} y2 A vertical coordinate of the ending point of the ray.
         * @param {String} [ctype] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         *
         * @deprecated Since v1.4.3. Use `ct.place.traceLine` instead.
         *
         * @returns {Array<Copy>} Array of all the copies that touched the ray
         */
        trace(x1, y1, x2, y2, ctype) {
            return ct.place.traceLine({
                x1, y1, x2, y2
            }, ctype, true);
        }
    };
    // Aliases
    ct.place.traceRectange = ct.place.traceRect;
    // a magic procedure which tells 'go' function to change its direction
    setInterval(function switchCtPlaceGoDirection() {
        ct.place.m *= -1;
    }, 789);
})(ct);
