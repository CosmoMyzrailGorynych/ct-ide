(function (ct) {
    var keyPrefix = 'touch.';
    var setKey = function(key, value) {
        ct.inputs.registry[keyPrefix + key] = value;
    };
    var lastPanNum = 0,
        lastPanX = 0,
        lastPanY = 0,
        lastScaleDistance = 0,
        lastRotation = 0;
    // updates Action system's input methods for singular, double and triple touches
    var countTouches = () => {
        setKey('Any', ct.touch.events.length > 0? 1 : 0);
        setKey('Double', ct.touch.events.length > 1? 1 : 0);
        setKey('Triple', ct.touch.events.length > 2? 1 : 0);
    };
    // returns a new object with the necessary information about a touch event
    var copyTouch = e => {
        var rect = ct.pixiApp.view.getBoundingClientRect();
        var touch = {
            id: e.identifier,
            x: (e.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x,
            y: (e.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y,
            clientX: e.clientX,
            clientY: e.clientY,
            r: e.radiusX? Math.max(e.radiusX, e.radiusY) : 0
        };
        touch.xprev = touch.x;
        touch.yprev = touch.y;
        return touch;
    };
    var findTouch = id => {
        for (let i = 0; i < ct.touch.events.length; i++) {
            if (ct.touch.events[i].id === id) {
                return ct.touch.events[i];
            }
        }
        return false;
    };
    var findTouchId = id => {
        for (let i = 0; i < ct.touch.events.length; i++) {
            if (ct.touch.events[i].id === id) {
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
            ct.touch.events.push(touch);
            ct.touch.x = touch.x;
            ct.touch.y = touch.y;
        }
        countTouches();
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
                upd.clientX = touch.clientX;
                upd.clientY = touch.clientY;
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
                ct.touch.released.push(ct.touch.events.splice(ind, 1)[0]);
            }
        }
        countTouches();
    };
    var mouseDown = function (e) {
        const rect = ct.pixiApp.view.getBoundingClientRect();
        var touch = {
            id: -1,
            x: (e.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x,
            y: (e.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y,
            clientX: e.clientX,
            clientY: e.clientY,
            r: 0
        };
        ct.touch.events.push(touch);
        ct.touch.x = touch.x;
        ct.touch.y = touch.y;
    };
    var mouseMove = function (e) {
        const rect = ct.pixiApp.view.getBoundingClientRect(),
              touch = findTouch(-1);
        if (touch) {
            touch.x = (e.clientX - rect.left) * ct.viewWidth / rect.width + ct.rooms.current.x;
            touch.y = (e.clientY - rect.top) * ct.viewHeight / rect.height + ct.rooms.current.y;
            touch.clientX = e.clientX;
            touch.clientY = e.clientY;
            ct.touch.x = touch.x;
            ct.touch.y = touch.y;
        }
    };
    var mouseUp = function () {
        var ind = findTouchId;
        if (ind !== -1) {
            ct.touch.events.splice(ind, 1);
        }
    };
    ct.touch = {
        released: [],
        setupListeners() {
            document.addEventListener('touchstart', handleStart, false);
            document.addEventListener('touchstart', () => {
                ct.touch.enabled = true;
            }, {
                once: true
            });
            document.addEventListener('touchend', handleRelease, false);
            document.addEventListener('touchcancel', handleRelease, false);
            document.addEventListener('touchmove', handleMove, false);
        },
        setupMouseListeners() {
            document.addEventListener('mousemove', mouseMove, false);
            document.addEventListener('mouseup', mouseUp, false);
            document.addEventListener('mousedown', mouseDown, false);
        },
        enabled: false,
        events: [],
        x: 0,
        y: 0,
        clear() {
            ct.touch.events.length = 0;
            ct.touch.clearReleased();
            countTouches();
        },
        clearReleased() {
            ct.touch.released.length = 0;
        },
        collide(copy, id, rel) {
            var set = rel? ct.touch.released : ct.touch.events;
            if (id !== void 0 && id !== false) {
                const i = findTouchId(id);
                if (i === -1) {
                    return false;
                }
                return ct.place.collide(copy, {
                    x: set[i].x,
                    y: set[i].y,
                    shape: {
                        type: set[i].r? 'circle' : 'point',
                        r: set[i].r
                    },
                    scale: {
                        x: 1,
                        y: 1
                   }
                });
            }
            for (let i = 0, l = set.length; i < l; i++) {
                if (ct.place.collide(copy, {
                    x: set[i].x,
                    y: set[i].y,
                    shape: {
                        type: set[i].r? 'circle' : 'point',
                        r: set[i].r
                    },
                    scale: {
                        x: 1,
                        y: 1
                   }
                })) {
                    return true;
                }
            }
            return false;
        },
        hovers(copy, id, rel) {
            return ct.mouse? (ct.mouse.hovers(copy) || ct.touch.collide(copy, id, rel)) : ct.touch.collide(copy, id, rel);
        },
        getById: findTouch,
        updateGestures: function () {
            let x = 0,
                y = 0;
            const rect = ct.pixiApp.view.getBoundingClientRect();
            for (const event of ct.touch.events) {
                x += (event.clientX - rect.left) / rect.width;
                y += (event.clientY - rect.top) / rect.height;
            }
            x /= ct.touch.events.length;
            y /= ct.touch.events.length;
            
            let rotation = 0,
                distance = lastScaleDistance;
            if (ct.touch.events.length > 1) {
                const events = [
                    ct.touch.events[0],
                    ct.touch.events[1]
                ].sort((a, b) => a.id - b.id);
                rotation = ct.u.pdn(
                    events[0].x, 
                    events[0].y, 
                    events[1].x, 
                    events[1].y);
                distance = ct.u.pdc(
                    events[0].x, 
                    events[0].y, 
                    events[1].x, 
                    events[1].y);
            }
    
            if (lastPanNum === ct.touch.events.length) {
                if (ct.touch.events.length > 1) {
                    setKey('DeltaRotation', (ct.u.degToRad(ct.u.deltaDir(lastRotation, rotation))));
                    setKey('DeltaPinch', distance / lastScaleDistance - 1);
                } else {
                    setKey('DeltaPinch', 0);
                    setKey('DeltaRotation', 0);
                }
                if (!ct.touch.events.length) {
                    setKey('PanX', 0);
                    setKey('PanY', 0);
                } else {
                    setKey('PanX', x - lastPanX);
                    setKey('PanY', y - lastPanY);
                }
            } else {
                // skip gesture updates to avoid shaking on new presses
                lastPanNum = ct.touch.events.length;
                setKey('DeltaPinch', 0);
                setKey('DeltaRotation', 0);
                setKey('PanX', 0);
                setKey('PanY', 0);
            }
            lastPanX = x;
            lastPanY = y;
            lastRotation = rotation;
            lastScaleDistance = distance;
        }
    };
})(ct);
