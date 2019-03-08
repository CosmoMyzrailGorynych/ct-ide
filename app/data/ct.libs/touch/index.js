(function (ct) {
    var copyTouch = e => {
        var rect = ct.pixiApp.view.getBoundingClientRect();
        var touch = {
            id: e.identifier,
            x: (e.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x,
            y: (e.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y,
            r: e.radiusX? Math.max(e.radiusX, e.radiusY) : 0
        };
        touch.xprev = touch.x;
        touch.yprev = touch.y;
        return touch;
    };
    var findTouch = id => {
        for (let i = 0; i < ct.touch.down.length; i++) {
            if (ct.touch.down[i].id === id) {
                return ct.touch.down[i];
            }
        }
        return false;
    };
    var findTouchId = id => {
        for (let i = 0; i < ct.touch.down.length; i++) {
            if (ct.touch.down[i].id === id) {
                return i;
            }
        }
        return -1;
    };
    var handleStart = function(e) {
        if (![/*%preventdefault%*/][0]) {
            e.preventDefault();
        }
        for (let i = 0, l = e.changedTouches.length; i < l; i++) {
            var touch = copyTouch(e.changedTouches[i]);
            ct.touch.down.push(touch);
            ct.touch.pressed.push(touch);
            ct.touch.x = touch.x;
            ct.touch.y = touch.y;
        }
    };
    var handleMove = function(e) {
        if (![/*%preventdefault%*/][0]) {
            e.preventDefault();
        }
        for (let i = 0, l = e.changedTouches.length; i < l; i++) {
            const touch = e.changedTouches[i],
                  upd = findTouch(e.changedTouches[i].identifier);
            if (upd) {
                const rect = ct.pixiApp.view.getBoundingClientRect();
                upd.x = (touch.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x;
                upd.y = (touch.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y;
                upd.r = touch.radiusX? Math.max(touch.radiusX, touch.radiusY) : 0;
                ct.touch.x = upd.x;
                ct.touch.y = upd.y;
            }
        }
    };
    var handleRelease = function(e) {
        if (![/*%preventdefault%*/][0]) {
            e.preventDefault();
        }
        var touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const ind = findTouchId(touches[i].identifier);
            if (ind !== -1) {
                var [released] = ct.touch.down.splice(ind, 1);
                ct.touch.released.push(released);
            }
        }
    };
    var mouseDown = function (e) {
        const rect = ct.pixiApp.view.getBoundingClientRect();
        var touch = {
            id: -1,
            x: (e.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x,
            y: (e.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y,
            r: 0
        };
        ct.touch.down.push(touch);
        ct.touch.pressed.push(touch);
        ct.touch.x = touch.x;
        ct.touch.y = touch.y;
    };
    var mouseMove = function (e) {
        const rect = ct.pixiApp.view.getBoundingClientRect(),
              touch = findTouch(-1);
        if (touch) {
            touch.x = (e.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x;
            touch.y = (e.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y;
            ct.touch.x = touch.x;
            ct.touch.y = touch.y;
        }
    };
    var mouseUp = function () {
        var ind = findTouchId;
        if (ind !== -1) {
            var [touch] = ct.touch.down.splice(ind, 1);
            ct.touch.released.push(touch);
        }
    };
    ct.touch = {
        setupListeners() {
            document.addEventListener('touchstart', handleStart, false);
            document.addEventListener('touchend', handleRelease, false);
            document.addEventListener('touchcancel', handleRelease, false);
            document.addEventListener('touchmove', handleMove, false);
        },
        setupMouseListeners() {
            document.addEventListener('mousemove', mouseMove, false);
            document.addEventListener('mouseup', mouseUp, false);
            document.addEventListener('mousedown', mouseDown, false);
        },
        down: [],
        pressed: [],
        released: [],
        x: 0,
        y: 0,
        clear() {
            ct.touch.down.length = 0;
            ct.touch.pressed.length = 0;
            ct.touch.released.length = 0;
        },
        collide(copy, id) {
            if (id !== void 0) {
                const i = findTouchId(id);
                if (i === -1) {
                    return false;
                }
                return ct.place.collide(copy, {
                    x: ct.touch.down[i].x,
                    y: ct.touch.down[i].y,
                    shape: {
                        type: ct.touch.down[i].r? 'circle' : 'point',
                        r: ct.touch.down[i].r
                    }
                });
            }
            for (let i = 0, l = ct.touch.down.length; i < l; i++) {
                if (ct.place.collide(copy, {
                    x: ct.touch.down[i].x,
                    y: ct.touch.down[i].y,
                    shape: {
                        type: ct.touch.down[i].r? 'circle' : 'point',
                        r: ct.touch.down[i].r
                    }
                })) {
                    return true;
                }
            }
            return false;
        },
        getById: findTouch
    };
})(ct);
