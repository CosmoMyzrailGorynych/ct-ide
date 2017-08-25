/****************************************
         [ place cotomod ]
[ (c) Cosmo Myzrail Gorynych 2013, 2015 ]
****************************************/

ct.place = {
    'm': 1, // direction modifier in ct.place.go
    'check' : {
        'rect.rect': function (x1, y1, x2, y2, xx1, yy1, xx2, yy2) {
            //
            // (x1,y1)._____       (xx1,yy1).___
            //        |     |               |   |
            //        |_____!               |___!
            //               (x2,y2)             (xx2,yy2)
            //
            // TODO: normalize points (if it matters)
            
            var sx = x1 < xx1? x1 : xx1,
                sy = y1 < yy1? y1 : yy1,
                ex = x2 > xx2? x2 : xx2,
                ey = y1 > yy2? y2 : yy2;
            return ex - sx < x2 - x1 + xx2 - xx1 && ey - sy<y2 - y1 + yy2 - yy1;
        },
        'line.line': function (x1, y1, x2, y2, x3, y3, x4, y4) {
            // x1 y1, x2 y2 - first line
            // x3 y3, x4 y4 - second line 
            return(
                ((x3-x1) * (y2-y1) - (y3-y1) * (x2-x1)) * ((x4-x1) * (y2-y1) - (y4-y1) * (x2-x1)) <= 0)
            &&
                (((x1-x3) * (y4-y3) - (y1-y3) * (x4-x3)) * ((x2-x3) * (y4-y3) - (y2-y3) * (x4-x3) )<= 0);
        },
        'circle.circle': function (x1, y1, r1, x2, y2, r2) {
            // detect collision by comparison of distance between centers and sum of circle's radius
            return((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1) <= (r1+r2) * (r1+r2));
        },
        'circle.point': function (x1, y1, r1, x2, y2) {
            // the same as above
            return((x2-x1) * (x2-x1) + (y2-y1) *(y2-y1) <= r1 *r1);
        },
        'circle.rect': function (x1, y1, r1, x2, y2, x3, y3) {
            // must be buggy
            return(
                // if we touch borders
                (x2-x1) * (x2-x1) + (y2-y1) * (y2-y1)<=r1 * r1
            ||
                (x2-x1) * (x2-x1) + (y3-y1) * (y3-y1)<=r1 * r1
            ||
                (x3-x1) * (x3-x1) + (y2-y1) * (y2-y1)<=r1 * r1
            ||
                (x3-x1) * (x3-x1) + (y3-y1) * (y3-y1)<=r1 * r1
            || // if we touch corners
               // is it even needed?
                ct.place.check['rect.point'](x2, y2, x3, y3, x1+r1, y1)
            ||
                ct.place.check['rect.point'](x2, y2, x3, y3, x1, y1+r1)
            ||
                ct.place.check['rect.point'](x2, y2, x3, y3, x1, y1-r1)
            ||
                ct.place.check['rect.point'](x2, y2, x3, y3, x1-r1, y1)
            // TODO: react if circle is placed inside rectangle
            );
        },
        'rect.point': function (x1, y1, x2, y2, x3, y3) {
            // x1 y1, x2 y2 - rect
            // x3 y3 - point
            // *might* be buggy
            return(
                (x3 >= x1 && x3 <= x2 && y3 >= y1 && y3 <= y2)
            ||
                (x3 <= x1 && x3 >= x2 && y3 <= y1 && y3 >= y2)
            );
        },
    },
    'free': function (me,x,y,type) {
        // ct.place.free(<me: Copy, x: Number, y: Number>[, type: String])
        // Determines if the place in (x,y) is free. 
        // Optionally can take 'type' as a filter for obstackles
        if (type) {
            for (i in ct.stack) {
                if (ct.stack[i].shape.type && ct.stack[i] !== me && ct.stack[i].ctype == type) {
                    if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.rect') {
                        if (ct.place.check['rect.rect'](ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom,x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.circle') {
                        if (ct.place.check['circle.circle'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x,y,me.shape.r))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.rect') {
                        if (ct.place.check['circle.rect'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.circle') {
                        if (ct.place.check['circle.rect'](x,y,me.shape.r,ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.point') {
                        if (ct.place.check['circle.point'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x,y))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.circle') {
                        if (ct.place.check['circle.point'](x,y,me.shape.r,ct.stack[i].x,ct.stack[i].y))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.point') {
                        if (ct.stack[i].y == y && ct.stack[i].x == x)
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.rect') {
                        if (ct.place.check['rect.point'](x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom,ct.stack[i].x,ct.stack[i].y))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.point') {
                        if (ct.place.check['rect.point'](ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom,x,y))
                            return false;
                    }
                }
            }
        } else {
            for (i in ct.stack) {
                if (ct.stack[i].shape.type && ct.stack[i] !== me) {
                    if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.rect') {
                        if (ct.place.check['rect.rect'](ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom,x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.circle') {
                        if (ct.place.check['circle.circle'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x,y,me.shape.r))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.rect') {
                        if (ct.place.check['circle.rect'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.circle') {
                        if (ct.place.check['circle.rect'](x,y,me.shape.r,ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.point') {
                        if (ct.place.check['circle.point'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x,y))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.circle') {
                        if (ct.place.check['circle.point'](x,y,me.shape.r,ct.stack[i].x,ct.stack[i].y))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.point') {
                        if (ct.stack[i].y == y && ct.stack[i].x == x)
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.rect') {
                        if (ct.place.check['rect.point'](x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom,ct.stack[i].x,ct.stack[i].y))
                            return false;
                    } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.point') {
                        if (ct.place.check['rect.point'](ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom,x,y))
                            return false;
                    }
                }
            }
        }
        return true;
    },
    'meet': function (me,x,y,type) {
        // ct.place.meet(<me: Copy, x: Number, y: Number>[, type: Type])
        // detects collision between
        for (i in ct.stack) {
            if (ct.stack[i].shape.type && ct.stack[i]!== me && ct.stack[i].type == type) {
                if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.rect') {
                    if (ct.place.check['rect.rect'](ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom,x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.circle') {
                    if (ct.place.check['circle.circle'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x,y,me.shape.r))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.rect') {
                    if (ct.place.check['circle.rect'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.circle') {
                    if (ct.place.check['circle.rect'](x,y,me.shape.r,ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'circle.point') {
                    if (ct.place.check['circle.point'](ct.stack[i].x,ct.stack[i].y,ct.stack[i].shape.r,x,y))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.circle') {
                    if (ct.place.check['circle.point'](x,y,me.shape.r,ct.stack[i].x,ct.stack[i].y))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.point') {
                    if (ct.stack[i].y == y && ct.stack[i].x == x)
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'point.rect') {
                    if (ct.place.check['circle.point'](x - me.shape.left, y - me.shape.top,x + me.shape.right,y + me.shape.bottom,ct.stack[i].x,ct.stack[i].y))
                        return ct.stack[i];
                } else if (ct.stack[i].shape.type + '.' + me.shape.type == 'rect.point') {
                    if (ct.place.check['circle.point'](ct.stack[i].x - ct.stack[i].shape.left, ct.stack[i].y - ct.stack[i].shape.top,ct.stack[i].x + ct.stack[i].shape.right,ct.stack[i].y + ct.stack[i].shape.bottom,x,y))
                        return ct.stack[i];
                }
            }
        }
        return false;
    },
    'lastdist': null,
    'nearest': function (x,y,type) {
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
        } else
                return false;
    },
    'furthest': function (x, y, type) {
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
        } else
                return false;
    },
    'go': function (me, x, y, speed, type) {
        // ct.place.go(<me: Copy, x: Number, y: Number, speed: Number>[, type: String])
        // tries to reach the target with simple obstackle avoidance algorithm

        // if we are too close to the destination, exit
        if (ct.pdc(me.x, me.y, x, y)<speed) return;
        var dir = ct.pdn(me.x, me.y, x, y);
        if (type) {
            //if there are no obstackles in front of us, go forward
            if (ct.place.free(me, me.x+ct.ldx(speed, dir), me.y+ct.ldy(speed, dir), type)) {
                    me.x += ct.ldx(speed, dir);
                    me.y += ct.ldy(speed, dir);
                    me.dir = dir;
            // otherwise, try to change direction by 30...60...90 degrees. 
            // Direction changes over time (ct.place.m).
            } else if (ct.place.free(me, me.x+ct.ldx(speed, dir+30 * ct.place.m), me.y+ct.ldy(speed, dir+30 * ct.place.m), type)) {
                    me.x += ct.ldx(speed, dir+30 * ct.place.m);
                    me.y += ct.ldy(speed, dir+30 * ct.place.m);
                    me.dir = dir+30 * ct.place.m;
            } else if (ct.place.free(me, me.x+ct.ldx(speed, dir+60 * ct.place.m), me.y+ct.ldy(speed, dir+60 * ct.place.m), type)) {
                    me.x += ct.ldx(speed, dir+60 * ct.place.m);
                    me.y += ct.ldy(speed, dir+60 * ct.place.m);
                    me.dir = dir+60 * ct.place.m;
            } else if (ct.place.free(me, me.x+ct.ldx(speed, dir+90 * ct.place.m), me.y+ct.ldy(speed, dir+90 * ct.place.m), type)) {
                    me.x += ct.ldx(speed, dir+90 * ct.place.m);
                    me.y += ct.ldy(speed, dir+90 * ct.place.m);
                    me.dir = dir+90 * ct.place.m;
            }
        } else {
            if (ct.place.free(me, me.x+ct.ldx(speed, dir), me.y+ct.ldy(speed, dir))) {
                    me.x += ct.ldx(speed, dir);
                    me.y += ct.ldy(speed, dir);
                    me.dir = dir;
            } else if (ct.place.free(me, me.x+ct.ldx(speed, dir+30 * ct.place.m), me.y+ct.ldy(speed, dir+30 * ct.place.m))) {
                    me.x += ct.ldx(speed, dir+30 * ct.place.m);
                    me.y += ct.ldy(speed, dir+30 * ct.place.m);
                    me.dir = dir+30 * ct.place.m;
            } else if (ct.place.free(me, me.x+ct.ldx(speed, dir+60 * ct.place.m), me.y+ct.ldy(speed, dir+6 * ct.place.m))) {
                    me.x += ct.ldx(speed, dir+60 * ct.place.m);
                    me.y += ct.ldy(speed, dir+60 * ct.place.m);
                    me.dir = dir+60 * ct.place.m;
            } else if (ct.place.free(me, me.x+ct.ldx(speed, dir+90 * ct.place.m), me.y+ct.ldy(speed, dir+90 * ct.place.m))) {
                    me.x += ct.ldx(speed, dir+90 * ct.place.m);
                    me.y += ct.ldy(speed, dir+90 * ct.place.m);
                    me.dir = dir+90 * ct.place.m;
            }
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
