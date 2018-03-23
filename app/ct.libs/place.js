/* global ct */
/* eslint prefer-destructuring: 0 */

/****************************************
         [ place cotomod ]
[ (c) Cosmo Myzrail Gorynych 2013, 2015 ]
****************************************/

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
            // x1 y1, x2 y2 - first line
            // x3 y3, x4 y4 - second line 
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
    },
    collide(c1, c2) {
        // ct.place.collide(<c1: Copy, c2: Copy>)
        // Test collision between two copies
        if (!c1.shape && !c2.shape) {
            return false;
        }
        var cType = c1.shape.type + '.' + c2.shape.type;
        if (cType === 'rect.rect') {
            if (ct.place.check['rect.rect'](c1.x - c1.shape.left, c1.y - c1.shape.top,c1.x + c1.shape.right,c1.y + c1.shape.bottom, c2.x - c2.shape.left, c2.y - c2.shape.top, c2.x + c2.shape.right, c2.y + c2.shape.bottom)) {
                return true;
            }
        } else if (cType === 'circle.circle') {
            if (ct.place.check['circle.circle'](c1.x,c1.y,c1.shape.r,c2.x,c2.y,c2.shape.r)) {
                return true;
            }
        } else if (cType === 'circle.rect') {
            if (ct.place.check['circle.rect'](c1.x,c1.y,c1.shape.r,c2.x - c2.shape.left, c2.y - c2.shape.top,c2.x + c2.shape.right, c2.y + c2.shape.bottom)) {
                return true;
            }
        } else if (cType === 'rect.circle') {
            if (ct.place.check['circle.rect'](c2.x ,c2.y ,c2.shape.r,c1.x - c1.shape.left, c1.y - c1.shape.top,c1.x + c1.shape.right,c1.y + c1.shape.bottom)) {
                return true;
            }
        } else if (cType === 'circle.point') {
            if (ct.place.check['circle.point'](c1.x,c1.y,c1.shape.r, c2.x, c2.y)) {
                return true;
            }
        } else if (cType === 'point.circle') {
            if (ct.place.check['circle.point'](c2.x, c2.y, c2.shape.r,c1.x,c1.y)) {
                return true;
            }
        } else if (cType === 'point.point') {
            return c1.y === c2.y && c1.x === c2.x;
        } else if (cType === 'point.rect') {
            if (ct.place.check['rect.point'](c2.x - c2.shape.left, c2.y - c2.shape.top, c2.x + c2.shape.right, c2.y + c2.shape.bottom,c1.x,c1.y)) {
                return true;
            }
        } else if (cType === 'rect.point') {
            if (ct.place.check['rect.point'](c1.x - c1.shape.left, c1.y - c1.shape.top,c1.x + c1.shape.right,c1.y + c1.shape.bottom, c2.x, c2.y)) {
                return true;
            }
        }
        return false;
    },
    occupied(me, x, y, ctype) {
        // ct.place.occupied(<me: Copy, x: Number, y: Number>[, ctype: String])
        // Determines if the place in (x,y) is occupied. 
        // Optionally can take 'ctype' as a filter for obstackles' collision group (not shape type)
        for (var i in ct.stack) {
            if (ct.stack[i] !== me && (ct.stack[i].ctype === ctype || !ctype)) {
                if (ct.place.collide(me, ct.stack[i])) {
                    return ct.stack[i];
                }
            }
        }
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
        } else if (ct.place.free(me, me.x+ct.u.ldx(speed, dir+60 * ct.place.m), me.y+ct.u.ldy(speed, dir+6 * ct.place.m))) {
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
// defining aliases
ct.place.check['rect.circle'] = ct.place.check['circle.rect'];
ct.place.check['point.circle'] = ct.place.check['circle.point'];
ct.place.check['point.rect'] = ct.place.check['rect.point'];
// a magic procedure which tells 'go' function to change its direction
setInterval(function() {
    ct.place.m*=-1;
}, 489);
ct.libs += ' place';
