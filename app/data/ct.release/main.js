/* Made with ct.js http://ctjs.rocks/ */
const deadPool = []; // a pool of `kill`-ed copies for delaying frequent garbage collection
setInterval(function () {
    deadPool.length = 0;
}, 1000 * 60);

const ct = {
    libs: [/*@libs@*/][0],
    speed: [/*@maxfps@*/][0] || 60,
    types: {},
    snd: {},
    stack: [],
    fps: [/*@maxfps@*/][0] || 60,
    dt: 0,
    version: '/*@ctversion@*/',
    meta: [/*@projectmeta@*/][0],
    main: {
        fpstick: 0,
        pi: 0
    },
    get width() {
        return ct.pixiApp.renderer.view.width;
    },
    set width(value) {
        ct.pixiApp.renderer.resize(value, ct.height);
        return value;
    },
    get height() {
        return ct.pixiApp.renderer.view.height;
    },
    set height(value) {
        ct.pixiApp.renderer.resize(ct.width, value);
        return value;
    }
};

// eslint-disable-next-line no-console
console.table({
    '😺 Made with:': 'ct.js game editor',
    '🙀 Version:': `v${ct.version}`,
    '😻 Website:': 'https://ctjs.rocks/',
});

ct.highDensity = [/*@highDensity@*/][0];
ct.pixiApp = new PIXI.Application({
    width: [/*@startwidth@*/][0],
    height: [/*@startheight@*/][0],
    antialias: ![/*@pixelatedrender@*/][0],
    powerPreference: 'high-performance',
    sharedTicker: true,
    sharedLoader: true
});
PIXI.settings.ROUND_PIXELS = [/*@pixelatedrender@*/][0];
PIXI.Ticker.shared.maxFPS = [/*@maxfps@*/][0] || 0;
if (!ct.pixiApp.renderer.options.antialias) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
}
ct.stage = ct.pixiApp.stage;
ct.pixiApp.renderer.autoDensity = ct.highDensity;
document.getElementById('ct').appendChild(ct.pixiApp.view);

ct.u = {
    // lengthdir_x
    ldx(l, d) {
        return l * Math.cos(d * Math.PI / -180);
    },
    // lengthdir_y
    ldy(l, d) {
        return l * Math.sin(d * Math.PI / -180);
    },
    // Point-point DirectioN
    pdn(x1, y1, x2, y2) {
        return (Math.atan2(y2 - y1, x2 - x1) * -180 / Math.PI + 360) % 360;
    },
    // Point-point DistanCe
    pdc(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },
    degToRad(deg) {
        return deg * Math.PI / -180;
    },
    radToDeg(rad) {
        return rad / Math.PI * -180;
    },
    /**
     * Rotates a vector (x; y) by deg around (0; 0)
     * @param {Number} x The x component
     * @param {Number} y The y component
     * @param {Number} deg The degree to rotate by
     * @returns {Array} A pair of new `x` and `y` parameters.
     */
    rotate(x, y, deg) {
        return ct.u.rotateRad(x, y, ct.u.degToRad(deg));
    },
    rotateRad(x, y, rad) {
        const sin = Math.sin(rad),
              cos = Math.cos(rad);
        return [
            cos * x - sin * y,
            cos * y + sin * x
        ];
    },
    deltaDir(dir1, dir2) {
        dir1 = ((dir1 % 360) + 360) % 360;
        dir2 = ((dir2 % 360) + 360) % 360;
        var t = dir1,
            h = dir2,
            ta = h - t;
        if (ta > 180) {
            ta -= 360;
        }
        if (ta < -180) {
            ta += 360;
        }
        return ta;
    },
    clamp(min, val, max) {
        return Math.max(min, Math.min(max, val));
    },
    lerp(a, b, alpha) {
        return a + (b-a)*alpha;
    },
    unlerp(a, b, val) {
        return (val - a) / (b - a);
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
            xmin = arg.x - arg.shape.left * arg.scale.x;
            xmax = arg.x + arg.shape.right * arg.scale.x;
            ymin = arg.y - arg.shape.top * arg.scale.y;
            ymax = arg.y + arg.shape.bottom * arg.scale.y;
        }
        return x >= xmin && y >= ymin && x <= xmax && y <= ymax;
    },
    pcircle(x, y, arg) {
        if (arg.splice) {
            return ct.u.pdc(x, y, arg[0], arg[1]) < arg[2];
        }
        return ct.u.pdc(0, 0, (arg.x - x) / arg.scale.x, (arg.y - y) / arg.scale.y) < arg.shape.r;
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
        return o1;
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

const removeKilledCopies = (array) => {
    let j = 0;
    for(let i = 0; i < array.length; i++) {
        if (!array[i].kill) {
            array[j++] = array[i];
        }
    }
  
    array.length = j;
    return array;
};
ct.loop = function(delta) {
    ct.delta = delta;
    ct.inputs.updateActions();
    for (let i = 0, li = ct.stack.length; i < li; i++) {
        ct.types.beforeStep.apply(ct.stack[i]);
        ct.stack[i].onStep.apply(ct.stack[i]);
        ct.types.afterStep.apply(ct.stack[i]);
    }

    ct.rooms.beforeStep.apply(ct.room);
    ct.room.onStep.apply(ct.room);
    ct.rooms.afterStep.apply(ct.room);
    // copies
    for (let i = 0; i < ct.stack.length; i++) {
        if (ct.stack[i].kill && !ct.stack[i]._destroyed) {
            ct.stack[i].destroy({children: true});
        }
    }
    for (const copy of ct.stack) {
        if (copy._destroyed) {
            copy.kill = true;
            ct.types.onDestroy.apply(copy);
            copy.onDestroy.apply(copy);
            deadPool.push(copy);
        }
    }
    removeKilledCopies(ct.stack);

    // ct.types.list[type: String]
    for (const i in ct.types.list) {
        removeKilledCopies(ct.types.list[i]);
    }

    for (const cont of ct.stage.children) {
        cont.children.sort((a, b) =>
            ((a.depth || 0) - (b.depth || 0)) || ((a.uid || 0) - (b.uid || 0)) || 0
        );
    }
    const r = ct.room;
    if (r.follow) {
        const speed = Math.min(1, (1-r.followDrift)*ct.delta);
        if (r.follow.kill) {
            delete r.follow;
        } else if (r.center) {
            r.x += speed * (r.follow.x + r.followShiftX - r.x - ct.viewWidth / 2);
            r.y += speed * (r.follow.y + r.followShiftY - r.y - ct.viewHeight / 2);
        } else {
            let cx = 0,
                cy = 0,
                w = 0,
                h = 0;
            w = Math.min(r.borderX, ct.viewWidth / 2);
            h = Math.min(r.borderY, ct.viewHeight / 2);
            if (r.follow.x + r.followShiftX - r.x < w) {
                cx = r.follow.x + r.followShiftX - r.x - w;
            }
            if (r.follow.y + r.followShiftY - r.y < h) {
                cy = r.follow.y + r.followShiftY - r.y - h;
            }
            if (r.follow.x + r.followShiftX - r.x > ct.viewWidth - w) {
                cx = r.follow.x + r.followShiftX - r.x - ct.viewWidth + w;
            }
            if (r.follow.y + r.followShiftY - r.y > ct.viewHeight - h) {
                cy = r.follow.y + r.followShiftY - r.y - ct.viewHeight + h;
            }
            r.x = Math.floor(r.x + speed * cx);
            r.y = Math.floor(r.y + speed * cy);
        }
    }
    r.x = r.x || 0;
    r.y = r.y || 0;
    r.x = Math.round(r.x);
    r.y = Math.round(r.y);

    // console.log("loop")
    for (let i = 0, li = ct.stack.length; i < li; i++) {
        // console.log(ct.stack[i].type);
        ct.types.beforeDraw.apply(ct.stack[i]);
        ct.stack[i].onDraw.apply(ct.stack[i]);
        ct.types.afterDraw.apply(ct.stack[i]);
        ct.stack[i].xprev = ct.stack[i].x;
        ct.stack[i].yprev = ct.stack[i].y;
    }

    ct.rooms.beforeDraw.apply(r);
    ct.room.onDraw.apply(r);
    ct.rooms.afterDraw.apply(r);

    ct.main.fpstick++;
    if (ct.rooms.switching) {
        ct.rooms.forceSwitch();
    }
};

/*%load%*/
