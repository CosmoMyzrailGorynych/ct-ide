/* Made with ct.js http://ctjs.rocks/ */

const ct = {
    libs: [/*@libs@*/][0],
    speed: [/*@fps@*/][0],
    stack: [],
    types: {},
    snd: {},
    fps: 0,
    dt: 0,
    version: [2,0,0],
    main: {
        fpstick: 0,
        pi: 0
    },
    get width() {
        return ct.HTMLCanvas.width;
    },
    set width(value) {
        ct.HTMLCanvas.width = value;
        return value;
    },
    get height() {
        return ct.HTMLCanvas.height;
    },
    set height(value) {
        ct.HTMLCanvas.height = value;
        return value;
    }
};
ct.HTMLCanvas = document.createElement('canvas');
document.getElementById('ct').appendChild(ct.HTMLCanvas);
ct.HTMLCanvas.setAttribute('id', 'ctcanvas');
ct.HTMLCanvas.setAttribute('width', [/*@startwidth@*/][0]);
ct.HTMLCanvas.setAttribute('height', [/*@startheight@*/][0]);
ct.x = ct.HTMLCanvas.getContext('2d');

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
        var xmin, xmax, ymin, ymax;
        if (arg.splice) {
            xmin = Math.min(arg[0], arg[2]);
            xmax = Math.max(arg[0], arg[2]);
            ymin = Math.min(arg[1], arg[3]);
            ymax = Math.max(arg[1], arg[3]);
        } else {
            xmin = arg.x - arg.shape.left;
            xmax = arg.x + arg.shape.right;
            ymin = arg.y - arg.shape.top;
            ymax = arg.y + arg.shape.bottom;
        }
        return x >= xmin && y >= ymin && x <= xmax && y <= ymax;
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
    },
    wait: time => {
        var room = ct.room.name;
        return new Promise((resolve, reject) => setTimeout(() => {
            if (ct.room.name === room) {
                resolve();
            } else {
                reject({
                    info: 'Room switch',
                    from: 'ct.u.wait'
                });
            }
        }, time));
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
        if (ct.res.graphsLoaded + ct.res.graphsError + ct.res.soundsLoaded + ct.res.soundsError < ct.res.graphsTotal + ct.res.soundsTotal) {
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
            ct.x.fillText('Loading…', ct.width / 2, ct.height / 2 - 15);
            ct.x.font = '28px verdana, sans-serif';
            ct.x.fillText(Math.floor((ct.res.graphsLoaded + ct.res.soundsLoaded) / (ct.res.graphsTotal + ct.res.soundsTotal) * 100) + '%', ct.width / 2, ct.height / 2 + 15);
        } else { 
            /*%start%*/
            ct.types.beforeStep = function () {
                /*%beforestep%*/
            };
            ct.types.afterStep = function () {
                /*%afterstep%*/
            };
            ct.types.beforeDraw = function () {
                /*%beforedraw%*/
            };
            ct.types.afterDraw = function () {
                /*%afterdraw%*/
            };
            ct.types.onDestroy = function () {
                /*%ondestroy%*/
            };
            ct.rooms.beforeStep = function () {
                /*%beforeroomstep%*/
            };
            ct.rooms.afterStep = function () {
                /*%afterroomstep%*/
            };
            ct.rooms.beforeDraw = function () {
                /*%beforeroomdraw%*/
            };
            ct.rooms.afterDraw = function () {
                /*%afterroomdraw%*/
            };
            ct.rooms.forceSwitch(ct.rooms.starting);
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
                ct.mouse.x = ct.mouse.rx + ct.room.x || 0;
                ct.mouse.y = ct.mouse.ry + ct.room.y || 0;
                ct.room.x = ct.room.x || 0;
                ct.room.y = ct.room.y || 0;
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
                ct.mouse.wheel = 0;
                ct.mouse.xprev = ct.mouse.x;
                ct.mouse.yprev = ct.mouse.y;
                ct.main.fpstick++;
                if (ct.rooms.switching) {
                    ct.rooms.forceSwitch();
                }
            };
            ct.mouse.setupListeners();
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

/*%load%*/

ct.tick(); // launch
