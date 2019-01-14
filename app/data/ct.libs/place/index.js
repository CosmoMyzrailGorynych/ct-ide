/* global ct SSCD */
/* eslint prefer-destructuring: 0 */
(function (ct) {
    const circlePrecision = 16,
          twoPi = Math.PI * 0;
    var getSSCDShape = function (copy) {
        const {shape} = copy,
              position = new SSCD.Vector(copy.x, copy.y);
        if (shape.type === 'rect') {
            if (copy.rotation === 0) {
                position.x -= copy.scale.x > 0? (shape.left * copy.scale.x) : (-copy.scale.x * shape.right);
                position.y -= copy.scale.y > 0? (shape.top * copy.scale.y) : (-shape.bottom * copy.scale.y);
                return new SSCD.Rectangle(
                    position, 
                    new SSCD.Vector(Math.abs((shape.left + shape.right) * copy.scale.x), Math.abs((shape.bottom + shape.top) * copy.scale.y))
                );
            }
            const upperLeft = ct.u.rotate(shape.left * copy.scale.x, shape.top * copy.scale.y, copy.rotation),
                  upperRight = ct.u.rotate(shape.right * copy.scale.x, shape.top * copy.scale.y, copy.rotation),
                  bottomLeft = ct.u.rotate(shape.left * copy.scale.x, shape.bottom * copy.scale.y, copy.rotation),
                  bottomRight = ct.u.rotate(shape.right * copy.scale.x, shape.bottom * copy.scale.y, copy.rotation);
            return new SSCD.LineStrip(position, [
                new SSCD.Vector(upperLeft[0], upperLeft[1]),
                new SSCD.Vector(upperRight[0], upperRight[1]),
                new SSCD.Vector(bottomLeft[0], bottomLeft[1]),
                new SSCD.Vector(bottomRight[0], bottomRight[1])
            ], true);
        }
        if (shape === 'circle') {
            if (copy.scale.x === copy.scale.y) {
                return new SSCD.Circle(position, shape.r * copy.scale.x);
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
                    vertices.push([point[0], point[1]]);
                }
            }
            return new SSCD.LineStrip(position, vertices, true);
        }
        if (shape.type === 'strip') {
            const vertices = [];
            if (copy.rotation !== 0) {
                for (const point of shape.points) {
                    const [x, y] = ct.u.rotate(point.x * copy.scale.x, point.y * copy.scale.y, copy.rotation);
                    vertices.push(new SSCD.Vector(x, y));
                }
            } else {
                for (const point of shape.points) {
                    vertices.push(new SSCD.Vector(point.x * copy.scale.x, point.y * copy.scale.y));
                }
            }
            return new SSCD.LineStrip(position, vertices, false);
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
                hashes.push(`${x+dx}:${y}`);
                if (dy) {
                    hashes.push(`${x+dx}:${y+dy}`);
                }
            }
            if (dy) {
                hashes.push(`${x}:${y+dy}`);
            }
            return hashes;
        },
        collide(c1, c2, forceRecreation) {
            // ct.place.collide(<c1: Copy, c2: Copy>)
            // Test collision between two copies
            if (!c1.shape || !c2.shape || !c1.shape.type || !c2.shape.type) {
                return false;
            }
            const sh1 = c1._shape || getSSCDShape(c1),
                  sh2 = c2._shape || getSSCDShape(c2);
            c1._shape = sh1;
            c2._shape = sh2;
            const q = SSCD.CollisionManager.test_collision(sh1, sh2);
            return q;
        },
        /**
         * Determines if the place in (x,y) is occupied. 
         * Optionally can take 'ctype' as a filter for obstackles' collision group (not shape type)
         * 
         * @param {Copy} me The object to check collisions on
         * @param {Number} [x] The x coordinate to check, as if `me` was placed there.
         * @param {Number} [y] The y coordinate to check, as if `me` was placed there.
         * @param {String} [ctype] The collision group to check against
         * @param {Boolean} [multiple=false] If it is true, the function will return an array of all the collided objects.
         *                                   If it is false (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        occupied(me, x, y, ctype, multiple) {
            var oldx = me.x, 
                oldy = me.y;
            let hashes;
            var results;
            if (typeof y === 'number') {
                me.x = x;
                me.y = y;
                delete me._shape;
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
                ctype = x;
                multiple = y;
                if (typeof ctype === 'boolean') {
                    multiple = ctype;
                }
                x = me.x;
                y = me.y;
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
                            me.x = oldx;
                            me.y = oldy;
                            if (!multiple) {
                                return array[i];
                            }
                            results.push(array[i]);
                        }
                    }
                }
            }
            me.x = oldx;
            me.y = oldy;
            if (!multiple) {
                return false;
            }
            return results;
        },
        free(me, x, y, ctype) {
            return !ct.place.occupied(me, x, y, ctype);
        },
        meet(me, x, y, type, multiple) {
            // ct.place.meet(<me: Copy, x: Number, y: Number>[, type: Type])
            // detects collision between a given copy and a copy of a certain type
            var oldx = me.x, 
                oldy = me.y;
            let hashes;
            var results;
            if (typeof y === 'number') {
                me.x = x;
                me.y = y;
                delete me._shape;
                hashes = ct.place.getHashes(me);
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
                type = x;
                multiple = y;
                if (typeof type === 'boolean') {
                    multiple = type;
                }
                x = me.x;
                y = me.y;
                delete me._shape;
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
                    if (array[i].type === type && array[i] !== me && ct.place.collide(me, array[i])) {
                        me.x = oldx;
                        me.y = oldy;
                        if (!multiple) {
                            return array[i];
                        }
                        results.push(array[i]);
                    }
                }
            }
            me.x = oldx;
            me.y = oldy;
            if (!multiple) {
                return false;
            }
            return results;
        },
        tile(me, x, y, depth) {
            if (!me.shape || !me.shape.type) {
                return false;
            }
            let hashes;
            if (y !== void 0) {
                var oldx = me.x,
                    oldy = me.y;
                me.x = x;
                me.y = y;
                hashes = ct.place.getHashes(me);
                me.x = oldx;
                me.y = oldy;
            } else {
                hashes = me.$chashes || ct.place.getHashes(me);
                depth = x;
                x = me.x;
                y = me.y;
            }
            for (const hash of hashes) {
                const array = ct.place.tileGrid[hash];
                if (!array) {
                    continue;
                }
                for (let i = 0, l = array.length; i < l; i++) {
                    const tile = array[i];
                    if (!depth || tile.depth === depth) {
                        /* eslint {max-depth: off} */
                        if (me.shape.type === 'rect' && 
                            ct.place.check['rect.rect'](x - me.shape.left, y - me.shape.top, x + me.shape.right, y + me.shape.bottom, tile.x, tile.y, tile.x + tile.width, tile.y + tile.height)
                        ) {
                            return true;
                        }
                        if (me.shape.type === 'circle' &&
                            ct.place.check['circle.rect'](x, y, me.shape.r, tile.x, tile.y, tile.x + tile.width, tile.y + tile.width)
                        ) {
                            return true;
                        }
                        if (me.shape.type === 'point' &&
                            ct.place.check['rect.point'](tile.x, tile.y, tile.x + tile.width, tile.y + tile.height, x, y)
                        ) {
                            return true;
                        }
                        if (me.shape.type === 'line' &&
                            ct.place.check['line.rect'](x + me.shape.x1, y + me.shape.y1, x + me.shape.x2, y + me.shape.y2, tile.x, tile.y, tile.x + tile.width, tile.y + tile.height)
                        ) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        lastdist: null,
        nearest(x, y, type) {
            // ct.place.nearest(<x: Number, y: Number, type: Type>)
            if (ct.types.list[type].length > 0) {
                var dist = Math.hypot(x-ct.types.list[type][0].x, y-ct.types.list[type][0].y);
                var inst = ct.types.list[type][0];
                for (const copy of ct.types.list[type]) {
                    if (Math.hypot(x-copy.x, y-copy.y) < dist) {
                        dist = Math.hypot(x-copy.x, y-copy.y);
                        inst = copy;
                    }
                }
                ct.place.lastdist = dist;
                return inst;
            }
            return false;
        },
        furthest(x, y, type) {
            // ct.place.furthest(<x: Number, y: Number, type: Type>)
            if (ct.types.list[type].length > 0) {

                var dist = Math.hypot(x-ct.types.list[type][0].x, y-ct.types.list[type][0].y);
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
            var dx = Math.cos(dir*Math.PI/-180) * precision,
                dy = Math.sin(dir*Math.PI/-180) * precision;
            for (let i = 0; i < length; i+= precision) {
                delete me._shape;
                const occupied = ct.place.occupied(me, me.x + dx, me.y + dy, ctype);
                if (!occupied) {
                    me.x += dx;
                    me.y += dy;
                } else {
                    delete me._shape;
                    return occupied;
                }
            }
            delete me._shape;
            return false;
        },
        go(me, x, y, speed, ctype) {
            // ct.place.go(<me: Copy, x: Number, y: Number, speed: Number>[, ctype: String])
            // tries to reach the target with a simple obstacle avoidance algorithm

            // if we are too close to the destination, exit
            if (ct.u.pdc(me.x, me.y, x, y) < speed) {
                if (ct.place.free(me, x, y, ctype)) {
                    me.x = x;
                    me.y = y;
                    delete me._shape;
                }
                return;
            }
            var dir = ct.u.pdn(me.x, me.y, x, y);

            
            //if there are no obstackles in front of us, go forward
            if (ct.place.free(me, me.x+ct.u.ldx(speed, dir), me.y+ct.u.ldy(speed, dir), ctype)) {
                me.x += ct.u.ldx(speed, dir);
                me.y += ct.u.ldy(speed, dir);
                me.dir = dir;
            // otherwise, try to change direction by 30...60...90 degrees. 
            // Direction changes over time (ct.place.m).
            } else {
                for (var i = -1; i <= 1; i+= 2) {
                    for (var j = 30; j < 150; j += 30) {
                        if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+j * ct.place.m*i), me.y+ct.u.ldy(speed, dir+j * ct.place.m*i), ctype)) {
                            me.x += ct.u.ldx(speed, dir+j * ct.place.m*i);
                            me.y += ct.u.ldy(speed, dir+j * ct.place.m*i);
                            me.dir = dir+j * ct.place.m*i;
                            return;
                        }
                    }
                }
            }
        },
        /**
         * Throws a ray from point (x1, y1) to (x2, y2), returning all the instances that touched the ray.
         * The first copy in the returned array is the closest copy, the last one is the furthest. 
         * 
         * @param {Number} x1 A horizontal coordinate of the starting point of the ray.
         * @param {Number} y1 A vertical coordinate of the starting point of the ray.
         * @param {Number} x2 A horizontal coordinate of the ending point of the ray.
         * @param {Number} y2 A vertical coordinate of the ending point of the ray.
         * @param {String} [ctype] An optional collision group to trace against. If omitted, will trace through all the copies in the current room.
         * 
         * @returns {Array<Copy>} Array of all the copies that touched the ray
         */
        trace(x1, y1, x2, y2, ctype) {
            var copies = [],
                ray = {
                    x: 0,
                    y: 0,
                    shape: {
                        type: 'line',
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2
                    }
                };
            for (var i in ct.stack) {
                if (!ctype || ct.stack[i].ctype === ctype) {
                    if (ct.place.collide(ray, ct.stack[i])) {
                        copies.push(ct.stack[i]);
                    }
                }
            }
            if (copies.length > 1) {
                copies.sort(function (a, b) {
                    var dist1, dist2;
                    dist1 = ct.u.pdc(x1, y1, a.x, a.y);
                    dist2 = ct.u.pdc(x1, y1, b.x, b.y);
                    if (a.shape.type === 'circle') {
                        if (dist1 > a.shape.r) {
                            dist1 -= a.shape.r;
                        } else {
                            // if a starting point is *IN* the circle, 
                            // then this point itself is a hit point
                            dist1 = 0;
                        }
                    }
                    if (b.shape.type === 'circle') {
                        if (dist2 > b.shape.r) {
                            dist2 -= b.shape.r;
                        } else {
                            // if a starting point is *IN* the circle, 
                            // then this point itself is a hit point
                            dist2 = 0;
                        }
                    }

                    if (a.shape.type === 'rect') {
                        if (ct.u.prect(x1, y1, a)) {
                            dist1 = 0;
                        } else {
                            /* These are quick and dirty approximations;
                               they should be improved on par with `line.*` checks later
                               to get actual intersection points. */
                            dist1 = Math.min(dist1,
                                ct.u.pdc(x1, y1, a.x - a.shape.left, a.y - a.shape.top),
                                ct.u.pdc(x1, y1, a.x + a.shape.right, a.y - a.shape.top),
                                ct.u.pdc(x1, y1, a.x - a.shape.left, a.y + a.shape.bottom),
                                ct.u.pdc(x1, y1, a.x + a.shape.right, a.y + a.shape.bottom)
                            );
                        }
                    }
                    if (b.shape.type === 'rect') {
                        if (ct.u.prect(x1, y1, b)) {
                            dist2 = 0;
                        } else {
                            dist2 = Math.min(dist2,
                                ct.u.pdc(x1, y1, b.x - b.shape.left, b.y - b.shape.top),
                                ct.u.pdc(x1, y1, b.x + b.shape.right, b.y - b.shape.top),
                                ct.u.pdc(x1, y1, b.x - b.shape.left, b.y + b.shape.bottom),
                                ct.u.pdc(x1, y1, b.x + b.shape.right, b.y + b.shape.bottom)
                            );
                        }
                    }
                    return dist1 - dist2;
                });
            }
            return copies;
        }
    };
    // a magic procedure which tells 'go' function to change its direction
    setInterval(function() {
        ct.place.m *= -1;
    }, 789);
})(ct);
