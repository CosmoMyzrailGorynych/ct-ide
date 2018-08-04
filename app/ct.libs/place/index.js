/* global ct */
/* eslint prefer-destructuring: 0 */
(function (ct) {
    /**
     * Checks whether a point lies above or below the line.
     * 
     * @param {Number} x The x coordinate of point to test.
     * @param {Number} y The y coordinate of point to test.
     * @param {Number} x1 The x coordinate of line segment's beginning.
     * @param {Number} y1 The y coordinate of line segment's beginning.
     * @param {Number} x2 The x coordinate of line segment's end.
     * @param {Number} y2 The y coordinate of line segment's end.
     * 
     * @returns {Number} 0 if the point lays on the line, > 0 if above, < 0 if below.
     * @see https://stackoverflow.com/questions/99353/how-to-test-if-a-line-segment-intersects-an-axis-aligned-rectange-in-2d#293052
     */
    var getLineSide = function(x, y, x1, y1, x2, y2) {
        return (y2-y1)*x + (x1-x2)*y + (x2*y1-x1*y2);
    };
    ct.place = {
        m: 1, // direction modifier in ct.place.go
        check: {
            'rect.rect'(x1, y1, x2, y2, xx1, yy1, xx2, yy2) {
                //
                // (x1,y1)._____       (xx1,yy1).___
                //        |     |               |   |
                //        |_____!               |___!
                //               (x2,y2)             (xx2,yy2)
                //
                
                var sx = x1 < xx1? x1 : xx1,
                    sy = y1 < yy1? y1 : yy1,
                    ex = x2 > xx2? x2 : xx2,
                    ey = y2 > yy2? y2 : yy2;
                return ex - sx < x2 - x1 + xx2 - xx1 && ey - sy < y2 - y1 + yy2 - yy1;
            },
            'line.line'(x1, y1, x2, y2, x3, y3, x4, y4) {
                // x1 y1, x2 y2 - first line segment
                // x3 y3, x4 y4 - second line segment
                return (
                    ((x3-x1) * (y2-y1) - (y3-y1) * (x2-x1)) * ((x4-x1) * (y2-y1) - (y4-y1) * (x2-x1)) <= 0)
                &&
                    (((x1-x3) * (y4-y3) - (y1-y3) * (x4-x3)) * ((x2-x3) * (y4-y3) - (y2-y3) * (x4-x3)) <= 0);
            },
            'circle.circle'(x1, y1, r1, x2, y2, r2) {
                // detect collision by comparison of distance between centers and sum of circle's radius
                return ((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1) <= (r1+r2) * (r1+r2));
            },
            'circle.point'(x1, y1, r1, x2, y2) {
                // the same as above
                return ((x2-x1) * (x2-x1) + (y2-y1) *(y2-y1) <= r1 *r1);
            },
            'circle.rect'(x1, y1, r1, x2, y2, x3, y3) {
                return (
                    // if we touch corners
                    (x2-x1) * (x2-x1) + (y2-y1) * (y2-y1)<=r1 * r1
                ||
                    (x2-x1) * (x2-x1) + (y3-y1) * (y3-y1)<=r1 * r1
                ||
                    (x3-x1) * (x3-x1) + (y2-y1) * (y2-y1)<=r1 * r1
                ||
                    (x3-x1) * (x3-x1) + (y3-y1) * (y3-y1)<=r1 * r1
                || // if we touch borders
                    ct.place.check['rect.point'](x2, y2, x3, y3, x1+r1, y1)
                ||
                    ct.place.check['rect.point'](x2, y2, x3, y3, x1, y1+r1)
                ||
                    ct.place.check['rect.point'](x2, y2, x3, y3, x1, y1-r1)
                ||
                    ct.place.check['rect.point'](x2, y2, x3, y3, x1-r1, y1)
                );
            },
            'rect.point'(x1, y1, x2, y2, x3, y3) {
                // x1 y1, x2 y2 - rect
                // x3 y3 - point
                // *might* be buggy
                return (
                    (x3 >= x1 && x3 <= x2 && y3 >= y1 && y3 <= y2)
                ||
                    (x3 <= x1 && x3 >= x2 && y3 <= y1 && y3 >= y2)
                );
            },
            'line.circle'(x1, y1, x2, y2, x3, y3, r) {
                // x1 y1, x2 y2 - line segment
                // x3 y3 - circle

                // If the circle touches one of the segments' ends, return true
                if (ct.place.check['circle.point'](x3, y3, r, x1, y1)
                || ct.place.check['circle.point'](x3, y3, r, x2, y2)) {
                    return true;
                }

                // Get the area with Heron formula and then use the basic formula `S = ah / 2`
                var a = ct.u.pdc(x1, y1, x2, y2),
                    b = ct.u.pdc(x1, y1, x3, y3),
                    c = ct.u.pdc(x2, y2, x3, y3),
                    s = (a + b + c) / 2,
                    S = Math.sqrt(s * (s-a)*(s-b)*(s-c)),
                    l = 2 * S / a,
                    intersects = l <= r;
                if (!intersects) {
                    return false;
                }
                // now compute the projection point on `a` and check if it lies on the segment
                var a1 = Math.atan2(y2 - y1, x2 - x1),
                    a2 = Math.atan2(y3 - y1, x3 - x1),
                    d = ct.u.pdn(x1, y1, x2, y2) + (a1 - a2 > 0? -90 : 90),
                    x4 = ct.u.ldx(l, d) + x3,
                    y4 = ct.u.ldy(l, d) + y3;
                // vertical lines are bastards. Pad them.
                if (a1 === -1.5707963267948966 || a1 === 1.5707963267948966) {
                    return ct.u.prect(x4, y4, [x1-1, y1, x2+1, y2]);
                }
                return ct.u.prect(x4, y4, [x1, y1, x2, y2]);
            },
            'line.rect'(x1, y1, x2, y2, x3, y3, x4, y4) {
                // x1, y1, x2, y2 — line segment
                // x3, y3, x4, y4 — rect
                var xmin = Math.min(x3, x4),
                    xmax = Math.max(x3, x4),
                    ymin = Math.min(y3, y4),
                    ymax = Math.max(y3, y4);
                var points = [
                    [xmin, ymin],
                    [xmin, ymax],
                    [xmax, ymin],
                    [xmax, ymax]
                ];
                var prev = null,
                    pass = false;
                for (var pair of points) {
                    var q = getLineSide(pair[0], pair[1], x1, y1, x2, y2);
                    if (q === 0) {
                        pass = true;
                        break;
                    }
                    if (prev !== null && prev * q < 0) {
                        pass = true;
                        break;
                    } 
                    prev = q;
                }
                if (pass) {
                    if (x1 > xmax && x2 > xmax) {
                        return false;
                    }
                    if (x1 < xmin && x2 < xmin) {
                        return false;
                    }
                    if (y1 > ymax && y2 > ymax) {
                        return false;
                    }
                    if (y1 < ymin && y2 < ymin) {
                        return false;
                    }
                    return true;
                }
                return false;
            },
            'line.point'(x1, y1, x2, y2, x, y) {
                return getLineSide(x1, y1, x2, y2, x, y) === 0;
            }
        },
        collide(c1, c2) {
            // ct.place.collide(<c1: Copy, c2: Copy>)
            // Test collision between two copies
            if (!c1.shape || !c2.shape) {
                return false;
            }
            var cType = c1.shape.type + '.' + c2.shape.type;
            if (cType === 'rect.rect') {
                return ct.place.check['rect.rect'](c1.x - c1.shape.left, c1.y - c1.shape.top,c1.x + c1.shape.right,c1.y + c1.shape.bottom, c2.x - c2.shape.left, c2.y - c2.shape.top, c2.x + c2.shape.right, c2.y + c2.shape.bottom);
            }
            if (cType === 'circle.circle') {
                return ct.place.check['circle.circle'](c1.x,c1.y,c1.shape.r,c2.x,c2.y,c2.shape.r);
            }
            if (cType === 'circle.rect') {
                return ct.place.check['circle.rect'](c1.x,c1.y,c1.shape.r,c2.x - c2.shape.left, c2.y - c2.shape.top,c2.x + c2.shape.right, c2.y + c2.shape.bottom);
            }
            if (cType === 'rect.circle') {
                return ct.place.check['circle.rect'](c2.x ,c2.y ,c2.shape.r,c1.x - c1.shape.left, c1.y - c1.shape.top,c1.x + c1.shape.right,c1.y + c1.shape.bottom);
            }
            if (cType === 'circle.point') {
                return ct.place.check['circle.point'](c1.x,c1.y,c1.shape.r, c2.x, c2.y);
            }
            if (cType === 'point.circle') {
                return ct.place.check['circle.point'](c2.x, c2.y, c2.shape.r,c1.x,c1.y);
            }
            if (cType === 'point.point') {
                return c1.y === c2.y && c1.x === c2.x;
            }
            if (cType === 'point.rect') {
                return ct.place.check['rect.point'](c2.x - c2.shape.left, c2.y - c2.shape.top, c2.x + c2.shape.right, c2.y + c2.shape.bottom,c1.x,c1.y);
            }
            if (cType === 'rect.point') {
                return ct.place.check['rect.point'](c1.x - c1.shape.left, c1.y - c1.shape.top,c1.x + c1.shape.right,c1.y + c1.shape.bottom, c2.x, c2.y);
            }
            if (cType === 'line.circle') {
                return ct.place.check['line.circle'](c1.x + c1.shape.x1, c1.y + c1.shape.y1, c1.x + c1.shape.x2, c1.y + c1.shape.y2, c2.x, c2.y, c2.shape.r);
            }
            if (cType === 'circle.line') {
                return ct.place.check['line.circle'](c2.x + c2.shape.x1, c2.y + c2.shape.y1, c2.x + c2.shape.x2, c2.y + c2.shape.y2, c1.x, c1.y, c1.shape.r);
            }
            if (cType === 'line.line') {
                return ct.place.check['line.line'](c1.x + c1.shape.x1, c1.y + c1.shape.y1, c1.x + c1.shape.x2, c1.y + c1.shape.y2, c2.x + c2.shape.x1, c2.y + c2.shape.y1, c2.x + c2.shape.x2, c2.y + c2.shape.y2);
            }
            if (cType === 'line.rect') {
                return ct.place.check['line.rect'](c1.x + c1.shape.x1, c1.y + c1.shape.y1, c1.x + c1.shape.x2, c1.y + c1.shape.y2, c2.x - c2.shape.left, c2.y - c2.shape.top, c2.x + c2.shape.right, c2.y + c2.shape.bottom);
            }
            if (cType === 'rect.line') {
                return ct.place.check['line.rect'](c2.x + c2.shape.x1, c2.y + c2.shape.y1, c2.x + c2.shape.x2, c2.y + c2.shape.y2, c1.x - c1.shape.left, c1.y - c1.shape.top, c1.x + c1.shape.right, c1.y + c1.shape.bottom);
            }
            if (cType === 'line.point') {
                return ct.place.check['line.point'](c1.x + c1.shape.x1, c1.y + c1.shape.y1, c1.x + c1.shape.x2, c1.y + c1.shape.y2, c2.x, c2.y);
            }
            if (cType === 'point.line') {
                return ct.place.check['line.point'](c2.x + c2.shape.x1, c2.y + c2.shape.y1, c2.x + c2.shape.x2, c2.y + c2.shape.y2, c1.x, c1.y);
            }
            return false;
        },
        occupied(me, x, y, ctype) {
            // ct.place.occupied(<me: Copy, x: Number, y: Number>[, ctype: String])
            // Determines if the place in (x,y) is occupied. 
            // Optionally can take 'ctype' as a filter for obstackles' collision group (not shape type)
            var oldx = me.x, 
                oldy = me.y;
            me.x = x;
            me.y = y; 
            for (var i in ct.stack) {
                if (ct.stack[i] !== me && (ct.stack[i].ctype === ctype || !ctype)) {
                    if (ct.place.collide(me, ct.stack[i])) {
                        me.x = oldx;
                        me.y = oldy;
                        return ct.stack[i];
                    }
                }
            }
            me.x = oldx;
            me.y = oldy;
            return false;
        },
        free(me, x, y, ctype) {
            return !ct.place.occupied(me, x, y, ctype);
        },
        meet(me, x, y, type) {
            // ct.place.meet(<me: Copy, x: Number, y: Number>[, type: Type])
            // detects collision between a given copy and a copy of a certain type
            var oldx = me.x, 
                oldy = me.y;
            me.x = x;
            me.y = y; 
            for (var i in ct.types.list[type]) {
                if (ct.types.list[type][i] !== me && ct.place.collide(me, ct.types.list[type][i])) {
                    me.x = oldx;
                    me.y = oldy;
                    return ct.types.list[type][i];
                }
            }
            me.x = oldx;
            me.y = oldy;
            return false;
        },
        lastdist: null,
        nearest(x, y, type) {
            // ct.place.nearest(<x: Number, y: Number, type: Type>)
            if (ct.types.list[type].length > 0) {
                var dist = Math.sqrt(Math.abs((x-ct.types.list[type][0].y)*(y-ct.types.list[type][0].y)));
                var inst = ct.types.list[type][0];
                var i;
                for (i in ct.types.list[type]) {
                    if (Math.sqrt(Math.abs((x-ct.types.list[type][i].y)*(y-ct.types.list[type][i].y))) < dist) {
                        dist = Math.sqrt(Math.abs((x-ct.types.list[type][i].y)*(y-ct.types.list[type][i].y)));
                        inst = ct.types.list[type][i];
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
                var dist = Math.sqrt(Math.abs((x-ct.types.list[type][0].y) * (y-ct.types.list[type][0].y)));
                var inst = ct.types.list[type][0];
                var i;
                for (i in ct.types.list[type]) {
                    if (Math.sqrt(Math.abs((x - ct.types.list[type][i].y) * (y-ct.types.list[type][i].y))) > dist) {
                        dist = Math.sqrt(Math.abs((x - ct.types.list[type][i].y) * (y - ct.types.list[type][i].y)));
                        inst = ct.types.list[type][i];
                    }
                }
                ct.place.lastdist = dist;
                return inst;
            }
            return false;
        },
        go(me, x, y, speed, type) {
            // ct.place.go(<me: Copy, x: Number, y: Number, speed: Number>[, type: String])
            // tries to reach the target with simple obstackle avoidance algorithm

            // if we are too close to the destination, exit
            if (ct.pdc(me.x, me.y, x, y) < speed) {
                return;
            }
            var dir = ct.pdn(me.x, me.y, x, y);
            if (type) {
                //if there are no obstackles in front of us, go forward
                if (ct.place.free(me, me.x+ct.u.ldx(speed, dir), me.y+ct.u.ldy(speed, dir), type)) {
                    me.x += ct.u.ldx(speed, dir);
                    me.y += ct.u.ldy(speed, dir);
                    me.dir = dir;
                // otherwise, try to change direction by 30...60...90 degrees. 
                // Direction changes over time (ct.place.m).
                } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+30 * ct.place.m), me.y+ct.u.ldy(speed, dir+30 * ct.place.m), type)) {
                    me.x += ct.u.ldx(speed, dir+30 * ct.place.m);
                    me.y += ct.u.ldy(speed, dir+30 * ct.place.m);
                    me.dir = dir+30 * ct.place.m;
                } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+60 * ct.place.m), me.y+ct.u.ldy(speed, dir+60 * ct.place.m), type)) {
                    me.x += ct.u.ldx(speed, dir+60 * ct.place.m);
                    me.y += ct.u.ldy(speed, dir+60 * ct.place.m);
                    me.dir = dir+60 * ct.place.m;
                } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+90 * ct.place.m), me.y+ct.u.ldy(speed, dir+90 * ct.place.m), type)) {
                    me.x += ct.u.ldx(speed, dir+90 * ct.place.m);
                    me.y += ct.u.ldy(speed, dir+90 * ct.place.m);
                    me.dir = dir+90 * ct.place.m;
                }
            } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir), me.y+ct.u.ldy(speed, dir))) {
                me.x += ct.u.ldx(speed, dir);
                me.y += ct.u.ldy(speed, dir);
                me.dir = dir;
            } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+30 * ct.place.m), me.y+ct.u.ldy(speed, dir+30 * ct.place.m))) {
                me.x += ct.u.ldx(speed, dir+30 * ct.place.m);
                me.y += ct.u.ldy(speed, dir+30 * ct.place.m);
                me.dir = dir+30 * ct.place.m;
            } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+60 * ct.place.m), me.y+ct.u.ldy(speed, dir+60 * ct.place.m))) {
                me.x += ct.u.ldx(speed, dir+60 * ct.place.m);
                me.y += ct.u.ldy(speed, dir+60 * ct.place.m);
                me.dir = dir+60 * ct.place.m;
            } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+90 * ct.place.m), me.y+ct.u.ldy(speed, dir+90 * ct.place.m))) {
                me.x += ct.u.ldx(speed, dir+90 * ct.place.m);
                me.y += ct.u.ldy(speed, dir+90 * ct.place.m);
                me.dir = dir+90 * ct.place.m;
            }
        }
    };
    // a magic procedure which tells 'go' function to change its direction
    setInterval(function() {
        ct.place.m *= -1;
    }, 489);
    ct.libs += ' place';
})(ct);
