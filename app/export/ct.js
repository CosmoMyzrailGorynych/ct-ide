const ct = document.createElement('canvas');
document.getElementById('ct').appendChild(ct);
ct.setAttribute('id', 'ctcanvas');
ct.setAttribute('width', [800][0]);
ct.setAttribute('height', [800][0]);
ct.x = ct.getContext('2d');

ct.libs = [{
    "CORE": {
        "name": "ct.js Game Framework",
        "info": "A game made with ct.js game framework and ct.IDE. Create your 2D games for free!",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "site": "https://ctjs.rocks/"
            }
        ]
    },
    "keyboard": {
        "name": "Keyboard",
        "version": "1.1.2",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "random": {
        "name": "ct.random",
        "version": "1.1.0",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    },
    "place": {
        "name": "ct.place",
        "version": "1.0.1",
        "authors": [
            {
                "name": "Cosmo Myzrail Gorynych",
                "mail": "admin@nersta.ru"
            }
        ]
    }
}][0];

ct.speed = [30][0];
ct.stack = [];
ct.types = {};
ct.snd = {};
ct.fps = 0;
ct.dt = 0;
ct.version = [2,0,0];
ct.main = {
    fpstick: 0,
    pi: 0
};

const requestFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        callback();
    };
ct.u = {
    ldx(l, d) {
    // lengthdir_x
        return l * Math.cos(d * Math.PI / -180);
    },
    ldy(l, d) {
    // lengthdir_y
        return l * Math.sin(d * Math.PI / -180);
    },
    // Point-point DirectioN
    pdn(x1, y1, x2, y2) {
        return (Math.atan2(y2 - y1, x2 - x1) * -180 / Math.PI + 360) % 360;
    },
    pdc(x1, y1, x2, y2) {
    // Point-point DistanCe
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },
    prect(x, y, arg) {
    // point-rectangle intersection
        if (arg.splice) {
            return (
                (x >= arg[0] && x <= arg[2] && y >= arg[1] && y <= arg[3])
            ||
                (x <= arg[0] && x >= arg[2] && y <= arg[1] && y >= arg[3])
            );
        }
        return (
            (x >= arg.x - arg.shape.left && x <= arg.x + arg.shape.right && y >= arg.y - arg.shape.top && y <= arg.y + arg.shape.bottom)
        ||
            (x <= arg.x - arg.shape.left && x >= arg.x + arg.shape.right && y <= arg.y - arg.shape.top && y >= arg.y + arg.shape.bottom)
        );
    },
    pcircle(x, y, arg) {
        if (arg.splice) {
            return ct.u.pdc(x, y, arg[0], arg[1]) < arg[2];
        }
        return ct.u.pdc(x, y, arg.x, arg.y) < arg.shape.r;
    },
    ext (o1, o2, arr) {
        if (arr) {
            for (const i in arr) {
                if (o2[arr[i]]) {
                    o1[arr[i]] = o2[arr[i]];
                }
            }
        } else {
            for (const i in o2) {
                o1[i] = o2[i];
            }
        }
    },
    load(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        if (callback) {
            script.onload = callback;
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }
};
ct.u.ext(ct.u, { // make aliases
    lengthDirX: ct.u.ldx,
    lengthDirY: ct.u.ldy,
    pointDirection: ct.u.pdn,
    pointDistance: ct.u.pdc,
    pointRectangle: ct.u.prect,
    pointCircle: ct.u.pcircle,
    extend: ct.u.ext
});
ct.loop = function() {
    if (ct.res) {
        if (ct.res.graphsLoaded + ct.res.graphsError + ct.res.soundsLoaded + ct.soundsError < ct.res.graphsTotal + ct.res.soundsTotal) {
            ct.x.clearRect(0, 0, ct.width, ct.height);
            ct.x.strokeStyle = '#ffffff';
            ct.x.globalAlpha = 1;
            ct.x.font = '16px verdana, sans-serif';
            ct.x.fillStyle = '#ffffff';
            ct.x.shadowBlur = 8;
            ct.x.shadowColor = 'rgba(0,0,0,1)';
            ct.x.shadowOffsetX = 0;
            ct.x.shadowOffsetY = 0;
            ct.x.lineWidth = 3;
            ct.x.textBaseline = 'middle';
            ct.x.textAlign = 'center';
            ct.x.beginPath();
            ct.main.pi += 0.15;
            ct.x.arc(ct.width / 2, ct.height / 2, 64, ct.main.pi, 0.5 * Math.PI + ct.main.pi);
            ct.x.stroke();
            ct.x.fillText('Грузимcя!', ct.width / 2, ct.height / 2 - 15);
            ct.x.font = '28px verdana, sans-serif';
            ct.x.fillText(Math.floor((ct.res.graphsLoaded + ct.res.soundsLoaded) / (ct.res.graphsTotal + ct.res.soundsTotal) * 100) + '%', ct.width / 2, ct.height / 2 + 15);
        } else { 
            
            ct.types.beforeStep = function () {
                
            };
            ct.types.afterStep = function () {
                
            };
            ct.types.beforeDraw = function () {
                
            };
            ct.types.afterDraw = function () {
                
            };
            ct.types.onDestroy = function () {
                
            };
            ct.rooms.beforeStep = function () {
                
            };
            ct.rooms.afterStep = function () {
                
            };
            ct.rooms.beforeDraw = function () {
                
            };
            ct.rooms.afterDraw = function () {
                /* global ct */

ct.keyboard.clear();

            };
            ct.rooms.switch(ct.rooms.starting);
            ct.loop = function() {
                for (let i = 0, li = ct.stack.length; i < li; i++) {
                    
                    ct.types.beforeStep.apply(ct.stack[i]);
                    
                    ct.stack[i].xprev = ct.stack[i].x;
                    ct.stack[i].yprev = ct.stack[i].y;
                    ct.stack[i].onStep.apply(ct.stack[i]);
                    
                    ct.types.afterStep.apply(ct.stack[i]);
                }

                ct.rooms.beforeStep.apply(ct.room);
                ct.room.onStep.apply(ct.room); 
                ct.rooms.afterStep.apply(ct.room);

                // ct.types.list[type: String]
                for (const i in ct.types.list) {
                    for (let k = 0, lk = ct.types.list[i].length; k < lk; k++) {
                        if (ct.types.list[i][k].kill) {
                            ct.types.list[i].splice(k, 1);
                            k--; lk--;
                        }
                    }
                }
                // bgs
                for (let i in ct.room.backgrounds) {
                    if (ct.room.backgrounds[i].kill) {
                        ct.room.backgrounds.splice(i, 1);
                        i--;
                    }
                }
                // copies
                for (let i = 0, li = ct.stack.length; i < li; i++) {
                    if (ct.stack[i].kill) {
                        ct.types.onDestroy.apply(ct.stack[i]);
                        ct.stack[i].onDestroy.apply(ct.stack[i]);
                        ct.stack.splice(i, 1);
                        i--; li--;
                    }
                }

                ct.x.clearRect(0, 0, ct.width, ct.height);
                ct.stack.sort(function(a, b) {
                    if (a.depth !== b.depth) {
                        return a.depth - b.depth;
                    }
                    return a.uid - b.uid;
                });

                if (ct.room.follow) {
                    if (ct.room.follow.kill) {
                        delete ct.room.follow;
                    } else if (ct.room.center) {
                        ct.room.x += ct.room.follow.x - ct.room.x - ct.width / 2;
                        ct.room.y += ct.room.follow.y - ct.room.y - ct.height / 2;
                    } else {
                        let cx = 0,
                            cy = 0,
                            w = 0,
                            h = 0;
                        w = Math.min(ct.room.borderx, ct.width / 2);
                        h = Math.min(ct.room.bordery, ct.height / 2);
                        if (ct.room.follow.x - ct.room.x < w) {
                            cx = ct.room.follow.x - ct.room.x - w;
                        }
                        if (ct.room.follow.y - ct.room.y < h) {
                            cy = ct.room.follow.y - ct.room.y - h;
                        }
                        if (ct.room.follow.x - ct.room.x > ct.width - w) {
                            cx = ct.room.follow.x - ct.room.x - ct.width + w;
                        }
                        if (ct.room.follow.y - ct.room.y > ct.height - h) {
                            cy = ct.room.follow.y - ct.room.y - ct.height + h;
                        }
                        ct.room.x = Math.floor(ct.room.x + cx);
                        ct.room.y = Math.floor(ct.room.y + cy);
                    }
                }
                for (let i = 0, li = ct.stack.length; i < li; i++) {
                    ct.types.beforeDraw.apply(ct.stack[i]);
                    ct.stack[i].onDraw.apply(ct.stack[i]);
                    ct.stack[i].frame += ct.stack[i].imgspd; 
                    ct.types.afterDraw.apply(ct.stack[i]);
                }

                ct.rooms.beforeDraw.apply(ct.room);
                ct.room.onDraw.apply(ct.room); 
                ct.rooms.afterDraw.apply(ct.room);
                
                ct.mouse.pressed = false;
                ct.mouse.released = false;
                ct.mouse.xprev = ct.mouse.x;
                ct.mouse.yprev = ct.mouse.y;
                ct.main.fpstick++;
            };
        }
    }
};

setInterval(function () {
    ct.fps = ct.main.fpstick;
    ct.main.fpstick = 0;
}, 1000);

ct.tick = function() {
    ct.loop.tick = setTimeout(function() {
        requestFrame(ct.loop);
        ct.tick();
    }, 1000 / ct.speed);
};



ct.tick(); // launch

/**
 * draw cotomod
 */

ct.draw = function (t) {
    if (t.graph) {
        if (t.transform) {
            ct.draw.imgext(t.graph, Math.floor(t.frame) % ct.res.graphs[t.graph].frames.length, t.x, t.y, t.tx, t.ty, t.tr, t.ta);
        } else {
            ct.draw.image(t.graph, Math.floor(t.frame) % ct.res.graphs[t.graph].frames.length, t.x, t.y);
        }
    }
};
ct.u.ext(ct.draw, {
    circle(x, y, r, o) {
        ct.x.beginPath();
        ct.x.arc(x - ct.rooms.current.x, y - ct.rooms.current.y, r, 0, 2*Math.PI);
        if (o) {
            ct.x.stroke();
        } else {
            ct.x.fill();
        }
    },
    line(x, y, xx, yy) {
        ct.x.beginPath();
        ct.x.moveTo(x - ct.rooms.current.x, y - ct.rooms.current.y);
        ct.x.lineTo(xx - ct.rooms.current.x, yy - ct.rooms.current.y);
        ct.x.stroke();
    },
    image(img, imgindex, x, y) {
        ct.x.drawImage(
            ct.res.graphs[img].atlas,
            ct.res.graphs[img].frames[imgindex][0],
            ct.res.graphs[img].frames[imgindex][1],
            ct.res.graphs[img].width,
            ct.res.graphs[img].height,
            x - ct.res.graphs[img].x - ct.rooms.current.x,
            y - ct.res.graphs[img].y - ct.rooms.current.y,
            ct.res.graphs[img].width,
            ct.res.graphs[img].height
        );
    },
    imgext(img, imgindex, x, y, hs, vs, r, a) {
        ct.x.save();
        ct.x.globalAlpha = a;
        ct.x.translate(x - ct.rooms.current.x, y - ct.rooms.current.y);
        ct.x.rotate(r * Math.PI/180);
        ct.x.scale(hs,vs);
        ct.x.drawImage(
            ct.res.graphs[img].atlas,
            ct.res.graphs[img].frames[imgindex][0],
            ct.res.graphs[img].frames[imgindex][1],
            ct.res.graphs[img].width,
            ct.res.graphs[img].height,
            -ct.res.graphs[img].x,
            -ct.res.graphs[img].y,
            ct.res.graphs[img].width,
            ct.res.graphs[img].height
        );
        ct.x.restore();
    },
    copy(copy,x,y) {
        if (copy.transform) {
            ct.draw.imgext(copy.graph, Math.floor(copy.frame) % ct.res.graphs[copy.graph].frames.length, x, y, copy.tx, copy.ty, copy.tr, copy.ta);
        } else {
            ct.draw.image(copy.graph, Math.floor(copy.frame) % ct.res.graphs[copy.graph].frames.length, x, y);
        }
    },
    text(str, x, y, o) {
        if (o) {
            ct.x.strokeText(str,x-ct.rooms.current.x,y-ct.rooms.current.y);
        } else {
            ct.x.fillText(str,x-ct.rooms.current.x,y-ct.rooms.current.y);
        }
    },
    rectangle(x, y, w, h, o) {
        if (o) {
            ct.x.strokeRect(x - ct.rooms.current.x, y-ct.rooms.current.y, w, h);
        } else {
            ct.x.fillRect(x - ct.rooms.current.x, y-ct.rooms.current.y, w, h);
        }
    },
    rect(x, y, xx, yy, o) {
        ct.x.beginPath();
        ct.x.moveTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
        ct.x.lineTo(xx - ct.rooms.current.x,y - ct.rooms.current.y);
        ct.x.lineTo(xx - ct.rooms.current.x,yy - ct.rooms.current.y);
        ct.x.lineTo(x - ct.rooms.current.x,yy - ct.rooms.current.y);
        ct.x.closePath();
        if (o) {
            ct.x.stroke();
        } else {
            ct.x.fill();
        }
    },
    fix(x, y) {
        ct.x.save();
        ct.x.translate(x, y);
    },
    unfix: ct.x.restore.bind(ct.x),
    polygon(points, close, outline) {
        ct.x.beginPath();
        ct.x.moveTo(points[0][0] - ct.rooms.current.x, ct.rooms.current.y - points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ct.x.lineTo(points[i][0] - ct.rooms.current.x, ct.rooms.current.y - points[i][1]);
        }
        if (close) {
            ct.x.closePath();
        }
        if (outline) {
            ct.x.stroke();
        } else {
            ct.x.fill();
        }
    }
});
ct.u.ext(ct.draw.polygon, {
    begin(x, y) {
        ct.x.beginPath();
        ct.x.moveTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
    },
    move(x,y) {
        ct.x.moveTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
    },
    line(x,y) {
        ct.x.lineTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
    },
    close: ct.x.closePath,
    fill: ct.x.fill,
    stroke: ct.x.stroke
});

ct.libs += ' draw';

ct.mouse = {
    x: 0,
    y: 0,
    inside: false,
    pressed: false,
    down: false,
    released: false,
    button: 0,
    clear() {
        ct.mouse.pressed = false;
        ct.mouse.down = false;
        ct.mouse.released = false;
    }
};

ct.mouse.listenermove = function(e) {
    ct.mouse.x = e.clientX - ct.offsetLeft + ct.rooms.current.x;
    ct.mouse.y = e.clientY - ct.offsetTop + ct.rooms.current.y;
    if (ct.mouse.x > 0 && ct.mouse.y > 0 && ct.mouse.y < ct.height && ct.mouse.x < ct.width) {
        ct.mouse.inside = true;
    } else {
        ct.mouse.inside = false;
    }
    window.focus();
};
ct.mouse.listenerdown = function (e) {
    ct.mouse.pressed = true;
    ct.mouse.down = true;
    ct.mouse.button = e.button;
    window.focus();
    e.preventDefault();
};
ct.mouse.listenerup = function (e) {
    ct.mouse.released = true;
    ct.mouse.down = false;
    ct.mouse.button = e.button;
    window.focus();
    e.preventDefault();
};

if (document.addEventListener) {
    document.addEventListener('mousemove', ct.mouse.listenermove, false);
    document.addEventListener('mouseup', ct.mouse.listenerup, false);
    document.addEventListener('mousedown', ct.mouse.listenerdown, false);
} else { // IE?
    document.attachEvent('onmousemove', ct.mouse.listenermove);
    document.attachEvent('onmouseup', ct.mouse.listenerup);
    document.attachEvent('onmousedown', ct.mouse.listenerdown);
}

ct.libs += ' mouse';

/* global ct */

var keys = {
        8: 'backspace',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        27: 'escape',
        16: 'shift',
        17: 'control',
        18: 'alt',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        45: 'insert',
        46: 'delete',
    }, 
    shiftchar = {
        49: '!',
        50: '@',
        51: '#',
        52: '$',
        53: '%',
        54: '^',
        55: '&',
        56: '*',
        57: '(',
        48: ')',
        187: '+',
        188: '<',
        189: '_',
        190: '>',
        191: '?',
        219: '{',
        221: '}',
        186: ':',
        222: '"'
    },
    symbols = {
        187: '=',
        188: ',',
        190: '.',
        191: '/',
        219: '[',
        221: ']',
        186: ';',
        222: '\''
    };

ct.keyboard = {
    string: '',
    pressed: [],
    released: [],
    down: [],
    alt: false,
    shift: false,
    ctrl: false,
    clear() {
        delete ct.keyboard.key;
        ct.keyboard.pressed = [];
        ct.keyboard.released = [];
        ct.keyboard.alt = false;
        ct.keyboard.shift = false;
        ct.keyboard.ctrl = false;
    },
    check: [],
    getkey(k) {
        ct.keyboard.key = keys[k] || 'unknown';
        if (k === 8) {
            ct.keyboard.string = ct.keyboard.string.slice(0,-1);
        } else if (k === 32) { 
            ct.keyboard.string += ' ';
        } else if (ct.keyboard.key === 'unknown') {
            ct.keyboard.key = String.fromCharCode(k);
            if (ct.keyboard.shift) {
                ct.keyboard.string += shiftchar[k] || String.fromCharCode(k);
            } else if (k in symbols) {
                ct.keyboard.string += symbols[k];
            } else {
                ct.keyboard.string += String.fromCharCode(k).toLowerCase();
            }
        }
    },
    ondown(e) {
        ct.keyboard.shift = e.shiftKey;
        ct.keyboard.alt = e.altKey;
        ct.keyboard.ctrl = e.ctrlKey;
        ct.keyboard.getkey(e.keyCode);
        ct.keyboard.pressed[ct.keyboard.key] = true;
        ct.keyboard.down[ct.keyboard.key] = true;
        e.preventDefault();
    },
    onup(e) {
        ct.keyboard.shift = e.shiftKey;
        ct.keyboard.alt = e.altKey;
        ct.keyboard.ctrl = e.ctrlKey;
        ct.keyboard.getkey(e.keyCode);
        ct.keyboard.released[ct.keyboard.key] = true;
        delete ct.keyboard.down[ct.keyboard.key];
        e.preventDefault();
    }
};

if (document.addEventListener) {
    document.addEventListener('keydown', ct.keyboard.ondown, false);
    document.addEventListener('keyup', ct.keyboard.onup, false);
} else {
    document.attachEvent('onkeydown', ct.keyboard.ondown);
    document.attachEvent('onkeyup', ct.keyboard.onup);
}

/* global ct */

ct.random = function (x) {
    return Math.random()*x;
};
ct.u.ext(ct.random,{
    dice() {
        return arguments[Math.floor(Math.random() * arguments.length)];
    },
    range(x1, x2) {
        return x1 + Math.random() * (x2-x1);
    },
    deg() {
        return Math.random()*360;
    },
    coord() {
        return [Math.floor(Math.random()*ct.width),Math.floor(Math.random()*ct.height)];
    },
    chance(x, y) {
        if (y) {
            return (Math.random()*y < x);
        }
        return (Math.random()*100 < x);
    },
    from(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
});

/* global ct */
/* eslint prefer-destructuring: 0 */

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

ct.rooms = {
    addBg(graph, depth) {
        var canv = document.createElement('canvas'),
            g = ct.res.graphs[graph];
        canv.width = g.width;
        canv.height = g.height;
        canv.x = canv.getContext('2d');
        canv.x.drawImage(g.atlas, g.frames[0][0], g.frames[0][1], g.width, g.height, 0, 0, g.width, g.height);
        var pat = ct.x.createPattern(canv, 'repeat');
        var copy = ct.types.Copy('BACKGROUND');
        copy.pattern = pat;
        copy.depth = depth;
        ct.room.backgrounds.push(copy);
        ct.stack.push(copy);
    },
    make() { // utility: not for regular use
        for (let i = 0, li = this.bgs.length; i < li; i++) {
            ct.rooms.addBg(this.bgs[i].graph, this.bgs[i].depth);
        }
        for (let i = 0, li = this.objects.length; i < li; i++) {
            ct.types.make(this.objects[i].type, this.objects[i].x, this.objects[i].y);
        }
    },
    clear() {
        ct.stack = [];
        ct.types.list = { };
    },
    'switch'(room) {
        
        if (ct.room) {
            ct.room.onLeave();
            ct.rooms.onLeave.apply(ct.room);
        }
        ct.stack = [];
        ct.types.list = { };
        ct.rooms.current = ct.room = ct.rooms[room];
        ct.room.backgrounds = [];
        ct.room.uid = 0;
        ct.rooms.make.apply(ct.room);
        ct.setAttribute('width', ct.room.width);
        ct.setAttribute('height', ct.room.height);
        ct.room.x = ct.room.y = ct.room.follow = ct.room.borderX = ct.room.borderY = 0;
        ct.room.onCreate();
        ct.rooms.onCreate.apply(ct.room);
    },
    onCreate() {
        
    },
    onLeave() {
        
    },
    starting: 'Main'
};


ct.rooms['Main'] = {
    width: '800',
    height: '800',
    objects: [
    {
        "x": 240,
        "y": 160,
        "type": "EnemyShip"
    },
    {
        "x": 560,
        "y": 80,
        "type": "Asteroid_Big"
    },
    {
        "x": 640,
        "y": 240,
        "type": "Asteroid_Medium"
    },
    {
        "x": 400,
        "y": 720,
        "type": "PlayerShip"
    },
    {
        "x": 400,
        "y": 160,
        "type": "Asteroid_Big"
    },
    {
        "x": 80,
        "y": 240,
        "type": "Asteroid_Medium"
    },
    {
        "x": 80,
        "y": 160,
        "type": "Asteroid_Medium"
    }
],
    bgs: [
    {
        "depth": -5,
        "graph": "BG"
    }
],
    onStep() {
        
    },
    onDraw() {
        
    },
    onLeave() {
        
    },
    onCreate() {
        
    }
}

ct.styles = {
    types: { },
    new(name, fill, stroke, text, shadow) {
        // style factory. Returns Style
        var style = {};
        if (fill) {
            if (fill.type === 'solid') {
                style.fillStyle = fill.color;
            } else if (fill.type === 'radgrad') {
                const grad = ct.x.createRadialGradient(fill.r, fill.r, 0, 0, 0, fill.r);
                for (const k in fill.colors) {
                    grad.addColorStop(fill.colors[k].pos, fill.colors[k].color);
                }
                style.fillStyle = grad;
            } else if (fill.type === 'grad') {
                const grad = ct.x.createLinearGradient(fill.x1, fill.y1, fill.x2, fill.y2);
                for (const k in fill.colors) {
                    grad.addColorStop(fill.colors[k].pos, fill.colors[k].color);
                }
                style.fillStyle = grad;
            } else if (fill.type === 'pattern') {
                style.fillStyle = ct.background.types[name];
            }
        }
        if (stroke) {
            style.strokeStyle = stroke.color;
            style.lineWidth = stroke.width;
        }
        if (text) {
            style.font = (text.italic? 'italic ' : '') + (text.weight || 400) + ' ' + text.size + 'px ' + text.family;
            if (text.valign) {
                style.textBaseline = text.valign;
            }
            if (text.halign) {
                style.textAlign = text.halign;
            }
        }
        if (shadow) {
            style.shadowColor = shadow.color;
            style.shadowOffsetX = shadow.x;
            style.shadowOffsetY = shadow.y;
            style.shadowBlur = shadow.blur;
        }
        ct.styles.types[name] = style;
        return style;
    },
    set(name) {
        // sets style
        for (const k in ct.styles.types[name]) {
            ct.x[k] = ct.styles.types[name][k];
        }
    },
    reset() {
        // sets canvas settings to default
        ct.x.strokeStyle = '#000000';
        ct.x.globalAlpha = 1;
        ct.x.font = '12px sans-serif';
        ct.x.fillStyle = '#000000';
        ct.x.shadowBlur = 0;
        ct.x.shadowColor = 'none';
        ct.x.shadowOffsetX = 0;
        ct.x.shadowOffsetY = 0;
        ct.x.lineWidth = 0;
        ct.x.textBaseline = 'alphabet';
        ct.x.textAlign = 'left'; 
    }
};



ct.libs += ' styles';

ct.res = {
    graphsLoaded: 0,
    graphsTotal: [1][0],
    graphsError: 0,
    soundsLoaded: 0,
    soundsTotal: [0][0],
    soundsError: 0,
    graphUrls: ['img/a0.png'],
    images: {},
    sounds: {},
    graphs: {},
    fetchImage(url, callback) {
        // Load an image. When comlete, put it in resource object or execute a callback
        // If failed, replace an image with an empty one
        var img = document.createElement('img');
        img.src = url;
        img.onload = function() {
            ct.res.images[url] = img;
            ct.res.graphsLoaded++;
            if (callback) {
                return callback(null, img);
            } else if (ct.res.graphsLoaded + ct.res.graphsError === ct.res.graphsTotal) {
                ct.res.parseImages();
            }
            return void 0;
        };
        img.onerror = img.onabort = function(e) { 
            ct.res.images[url] = img;
            ct.res.graphsError++;
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';
            if (callback) {
                return callback(e);
            }
            console.error('[ct.res] An image from ' + img.src + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
            if (ct.res.graphsLoaded + ct.res.graphsError === ct.res.graphsTotal) {
                ct.res.parseImages();
            }
            return void 0;
        };
    },
    makeSprite(name, url, opts) {
        var i, o;
        opts.cols = opts.cols || 1;
        opts.rows = opts.rows || 1;
        opts.x = opts.x || 0;
        opts.y = opts.y || 0;
        opts.marginx = opts.marginx || 0;
        opts.marginy = opts.marginy || 0;
        opts.shiftx = opts.shiftx || 0;
        opts.shifty = opts.shifty || 0;
        // extracts sprite from atlas
        o = {};
        i = ct.res.images[url];
        o.atlas = i;
        o.frames = [];
        o.x = opts.xo || 0;
        o.y = opts.yo || 0;
        if (!opts.untill) {
            opts.untill = opts.cols*opts.rows;
            o.untill = opts.untill;
        }
        o.width = opts.w || 1;
        o.height = opts.h || 1;
        for (var yy = 0; yy < (opts.rows || 1); yy++) {
            for (var xx = 0; xx < opts.cols; xx++) {
                o.frames.push([opts.shiftx + opts.x + xx * (o.width + opts.marginx), opts.shifty + opts.y + yy * (o.height + opts.marginy)]);
                if (yy * opts.cols + xx >= opts.untill) {
                    break;
                }
            }
        }
        if (opts.shape) {
            o.shape = opts.shape;
        } else {
            o.shape = {type: 'point'};
        }
        ct.res.graphs[name] = o;
    },
    parseImages() {
        // filled by IDE and catmods. As usual, atlases are splitted here.
        
                ct.res.makeSprite('BG', 'img/a0.png', {
    "x": 1,
    "y": 1,
    "w": 256,
    "h": 256,
    "xo": 0,
    "yo": 0,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "rect",
        "top": 0,
        "bottom": 256,
        "left": 0,
        "right": 256
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
                ct.res.makeSprite('PlayerShip', 'img/a0.png', {
    "x": 1,
    "y": 260,
    "w": 112,
    "h": 75,
    "xo": 56,
    "yo": 37,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "rect",
        "top": 12,
        "bottom": 32,
        "left": 50,
        "right": 50
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
                ct.res.makeSprite('EnemyShip', 'img/a0.png', {
    "x": 116,
    "y": 260,
    "w": 103,
    "h": 84,
    "xo": 51,
    "yo": 42,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "circle",
        "r": 42
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
                ct.res.makeSprite('Asteroid_Big', 'img/a0.png', {
    "x": 1,
    "y": 338,
    "w": 101,
    "h": 84,
    "xo": 50,
    "yo": 42,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "circle",
        "r": 42
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
                ct.res.makeSprite('Laser_Blue', 'img/a0.png', {
    "x": 222,
    "y": 260,
    "w": 9,
    "h": 54,
    "xo": 4,
    "yo": 27,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "rect",
        "top": 27,
        "bottom": 27,
        "left": 4,
        "right": 5
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
                ct.res.makeSprite('LaserRed', 'img/a0.png', {
    "x": 222,
    "y": 317,
    "w": 48,
    "h": 46,
    "xo": 24,
    "yo": 23,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "circle",
        "r": 23
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
                ct.res.makeSprite('Asteroid_Medium', 'img/a0.png', {
    "x": 234,
    "y": 260,
    "w": 43,
    "h": 43,
    "xo": 21,
    "yo": 21,
    "cols": 1,
    "rows": 1,
    "untill": 0,
    "shape": {
        "type": "circle",
        "r": 21
    },
    "marginx": 0,
    "marginy": 0,
    "shiftx": 0,
    "shifty": 0
});
        
    }
};

// start loading images
for (const i in ct.res.graphUrls) {
    ct.res.fetchImage(ct.res.graphUrls[i]);
}

ct.types = {
    Copy(type) {
    // basic constructor. Returns Copy
        var obj = {
            x: 0,
            y: 0,
            xprev: 0,
            yprev: 0,
            xstart: 0,
            ystart: 0,
            spd: 0,
            dir: 0,
            grav: 0,
            gravdir: 0,
            depth: 0,
            frame: 0,
            imgspd: 1,
            transform: false,
            tx: 1,
            ty: 1,
            tr: 0,
            ta: 1,
            uid: ct.rooms.current.uid
        };
        if (type) {
            ct.u.ext(obj, {
                type,
                depth: ct.types[type].depth, 
                graph: ct.types[type].graph,
                onStep: ct.types[type].onStep,
                onDraw: ct.types[type].onDraw,
                onCreate: ct.types[type].onCreate,
                onDestroy: ct.types[type].onDestroy,
                shape: ct.types[type].graph ? ct.res.graphs[ct.types[type].graph].shape : {}
            });
        }
        ct.rooms.current.uid++;
        return obj;
    },
    list: { },
    make(type, x, y) {
        //advanced constructor. Returns Copy
        const obj = ct.types.Copy(type);
        obj.x = obj.xprev = obj.xstart = x;
        obj.y = obj.yprev = obj.ystart = y;
        
        if (ct.types.list[type]) {
            ct.types.list[type].push(obj);
        } else {
            ct.types.list[type] = [obj];
        }
        ct.stack.push(obj);
        
        ct.types[type].onCreate.apply(obj);
        (function () {
            
        }).apply(obj);
        return obj;
    },
    move(o) {
        // performs movement step with Copy `o`
        var xprev = o.x,
            yprev = o.y,
            hspd, vspd;
        if (!o.grav) { o.grav = 0; o.gravdir = 0; }
        hspd = o.spd * Math.cos(o.dir*Math.PI/-180) + o.grav * Math.cos(o.gravdir*Math.PI/-180);
        vspd = o.spd * Math.sin(o.dir*Math.PI/-180) + o.grav * Math.sin(o.gravdir*Math.PI/-180);
        o.x += hspd;
        o.y += vspd;
        if (o.grav) {
            o.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        }
        if (o.spd > 0) {
            o.dir = ct.u.pdn(xprev, yprev, o.x, o.y);
        }
    },
    addSpeed(o, spd, dir) {
        var hspd, vspd;
        hspd = o.spd * Math.cos(o.dir*Math.PI/-180) + spd * Math.cos(dir*Math.PI/-180);
        vspd = o.spd * Math.sin(o.dir*Math.PI/-180) + spd * Math.sin(dir*Math.PI/-180);
        o.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        if (o.spd > 0) {
            o.dir = ct.u.pdn(o.xprev, o.yprev, o.xprev + hspd, o.yprev + vspd);
        }
    },
    each(func) {
        for (const i in ct.stack) {
            func.apply(ct.stack[i], this);
        }
    },
    'with'(obj, func) {
        func.apply(obj, this);
    }
};
ct.types.copy = ct.types.make;
ct.types.addSpd = ct.types.addSpeed;

ct.types["PlayerShip"] = {
    depth:0,
    graph: "PlayerShip",
    onStep: function () {
/**
 * Move the ship
 */

if (ct.keyboard.down['left']) { // Is the left arrow key pressed?
    this.x -= 8; // Move to the left by X axis
}
if (ct.keyboard.down['right']) { // Is the right arrow key pressed?
    this.x += 8; // Move to the right by X axis
}

if (ct.keyboard.down['up']) { // Is the up arrow key pressed?
    this.y -= 8; // Move up by Y axis
}
if (ct.keyboard.down['down']) { // Is the right arrow key pressed?
    this.y += 8; // Move down by Y axis
}

/**
 * Check whether the ship fell off the viewport
 */
if (this.x < 0) { // Have the ship crossed the left border?
    this.x = 0; // Go back to the left border
}
if (this.x > ct.width) { // Have the ship crossed the right border?
    this.x = ct.width; // Go back to the right border
}
if (this.y < ct.height / 2) { // Have the ship crossed the middle line?
    this.y = 400; // Go back to the middle line
}
if (this.y > ct.height) { // Have the ship crossed the bottom border?
    this.x = ct.height; // Go back to the bottom border
}

if (ct.keyboard.pressed['space']) {
    ct.types.copy('Laser_Blue', this.x, this.y);
}

ct.types.move(this);
    },
    onDraw: function () {
ct.draw(this);
    },
    onDestroy: function () {

    },
    onCreate: function () {

    }
};
ct.types["Laser_Red"] = {
    depth:0,
    graph: "LaserRed",
    onStep: function () {
ct.types.move(this);
    },
    onDraw: function () {
ct.draw(this);
    },
    onDestroy: function () {

    },
    onCreate: function () {

    }
};
ct.types["Laser_Blue"] = {
    depth:0,
    graph: "Laser_Blue",
    onStep: function () {
if (this.y < -40) {
    this.kill = true;
}

ct.types.move(this);
    },
    onDraw: function () {
ct.draw(this);
    },
    onDestroy: function () {

    },
    onCreate: function () {
this.spd = 18;
this.dir = 90;
    }
};
ct.types["EnemyShip"] = {
    depth:0,
    graph: "EnemyShip",
    onStep: function () {
ct.types.move(this);

if (this.y > ct.height + 80) {
    this.kill = true;
}
    },
    onDraw: function () {
ct.draw(this);
    },
    onDestroy: function () {

    },
    onCreate: function () {
this.spd = 3;
this.dir = 270;
    }
};
ct.types["Asteroid_Medium"] = {
    depth:0,
    graph: "Asteroid_Medium",
    onStep: function () {
ct.types.move(this);

if (this.y > ct.height + 80) {
    this.kill = true;
}
    },
    onDraw: function () {
ct.draw(this);
    },
    onDestroy: function () {

    },
    onCreate: function () {
this.spd = ct.random.range(1, 3);
this.dir = ct.random.range(270 - 30, 270 + 30);
    }
};
ct.types["Asteroid_Big"] = {
    depth:0,
    graph: "Asteroid_Big",
    onStep: function () {
ct.types.move(this);

if (this.y > ct.height + 80) {
    this.kill = true;
}
    },
    onDraw: function () {
ct.draw(this);
    },
    onDestroy: function () {

    },
    onCreate: function () {
this.spd = ct.random.range(1, 3);
this.dir = ct.random.range(270 - 30, 270 + 30);
    }
};


ct.types.BACKGROUND = {
    onStep() {void 0;},
    onDraw() {
        var m = ct.x.fillStyle;
        ct.x.fillStyle = this.pattern;
        ct.draw.fix(-ct.rooms.current.x, -ct.rooms.current.y);
        ct.x.fillRect(ct.rooms.current.x, ct.rooms.current.y, ct.width, ct.height);
        ct.draw.unfix();
        ct.x.fillStyle = m;
    },
    onCreate() {
        this.uid = -1;
    },
    onDestroy() {void 0;}
};

ct.sound = {
    /** 
     * Detects if a particular codec is supported in the system 
     * @param {String} type Codec/MIME-type to look for
     * @returns {Boolean} true/false
     */
    detect(type) {
        var au = document.createElement('audio');
        return Boolean(au.canPlayType && au.canPlayType(type).replace(/no/, ''));
    },
    /** 
     * Creates a new Sound object and puts it in resource object 
     * 
     * @param {String} name Sound's name
     * @param {String} wav Local path to the sound in wav format
     * @param {String} mp3 Local path to the sound in mp3 format
     * @param {Number} [poolSize=5] Max number of concurrent sounds playing
     * 
     * @returns {Object} Sound's object
     */
    init(name, wav, mp3, poolSize) {
        var src = '';
        if (ct.sound.mp3 && mp3) {
            src = mp3;
        } else if (ct.sound.wav && wav) {
            src = wav;
        }
        var audio = {
            src,
            direct: document.createElement('audio'),
            pool: [],
            poolSize: poolSize || 5
        };
        if (src !== '') {
            ct.res.soundsLoaded++;
            audio.direct.onerror = audio.direct.onabort = function () {
                console.error('[ct.sound] Oh no! We couldn\'t load ' + src + '!');
                audio.buggy = true;
                ct.res.soundsError++;
                ct.res.soundsLoaded--;
            };
            audio.direct.src = src;
        } else {
            ct.res.soundsError++;
            audio.buggy = true;
            console.error('[ct.sound] We couldn\'t load sound named "' + name + '" because the browser doesn\'t support any of proposed formats.');
        }
        ct.res.sounds[name] = audio;
        return audio;
    },
    /**
     * Spawns a new sound and plays it.
     * 
     * @param {String} name The name of sound to be played
     * @param {Object} [opts] Options object that is applied to a newly created audio tag
     * @param {Function} [cb] A callback, which is called when the sound finishes playing
     * 
     * @returns {HTMLTagAudio|Boolean} The created audio or `false` (if a sound wasn't created)
     */
    spawn(name, opts, cb) {
        if (typeof opts === 'function') {
            cb = opts;
            opts = void 0;
        }
        var s = ct.res.sounds[name];
        if (s.pool.length < s.poolSize) {
            var a = document.createElement('audio');
            a.src = s.src;
            if (opts) {
                ct.u.ext(a, opts);
            }
            s.pool.push(a);
            a.addEventListener('ended', function (e) {
                s.pool.splice(s.pool.indexOf(a), 1);
                if (cb) {
                    cb(true, e);
                }
            });

            a.play();
        } else if (cb) {
            cb(false);
        }
        return false;
    }
};

// define sound types we can support
ct.sound.wav = ct.sound.detect('audio/wav; codecs="1"');
ct.sound.mp3 = ct.sound.detect('audio/mpeg;');


