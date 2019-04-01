(function () {
    var keyPrefix = 'mouse.';
    var setKey = function(key, value) {
        ct.inputs.registry[keyPrefix + key] = value;
    };
    var buttonMap = {
        0: 'Left',
        1: 'Middle',
        2: 'Right',
        3: 'Special1',
        4: 'Special2',
        5: 'Special3',
        6: 'Special4',
        7: 'Special5',
        8: 'Special6',
        unknown: 'Unknown'
    };

    ct.mouse = {
        rx: 0,
        ry: 0,
        xprev: 0,
        yprev: 0,
        inside: false,
        pressed: false,
        down: false,
        released: false,
        button: 0,
        hovers(copy) {
            if (!copy.shape) {
                return false;
            }
            if (copy.shape.type === 'rect') {
                return ct.u.prect(ct.mouse.x, ct.mouse.y, copy);
            }
            if (copy.shape.type === 'circle') {
                return ct.u.pcircle(ct.mouse.x, ct.mouse.y, copy);
            }
            if (copy.shape.type === 'point') {
                return ct.mouse.x === copy.x && ct.mouse.y === copy.y;
            }
            return false;
        },
        get x() {
            return ct.mouse.rx + ct.rooms.current.x;
        },
        get y() {
            return ct.mouse.ry + ct.rooms.current.y;
        }
    };
    
    ct.mouse.listenerMove = function(e) {
        var rect = ct.pixiApp.view.getBoundingClientRect();
        ct.mouse.rx = (e.clientX - rect.left) * ct.viewWidth / rect.width;
        ct.mouse.ry = (e.clientY - rect.top) * ct.viewHeight / rect.height;
        ct.mouse.x = ct.mouse.rx + ct.rooms.current.x;
        ct.mouse.y = ct.mouse.ry + ct.rooms.current.y;
        if (ct.mouse.rx > 0 && ct.mouse.ry > 0 && ct.mouse.ry < ct.viewHeight && ct.mouse.rx < ct.viewWidth) {
            ct.mouse.inside = true;
        } else {
            ct.mouse.inside = false;
        }
        window.focus();
    };
    ct.mouse.listenerDown = function (e) {
        setKey(buttonMap[e.button] || buttonMap.unknown, 1);
        ct.mouse.pressed = true;
        ct.mouse.down = true;
        ct.mouse.button = e.button;
        window.focus();
        e.preventDefault();
    };
    ct.mouse.listenerUp = function (e) {
        setKey(buttonMap[e.button] || buttonMap.unknown, 0);
        ct.mouse.released = true;
        ct.mouse.down = false;
        ct.mouse.button = e.button;
        window.focus();
        e.preventDefault();
    };
    ct.mouse.listenerContextMenu = function (e) {
        e.preventDefault();
    };
    ct.mouse.listenerWheel = function (e) {
        ct.mouse.wheel = e.wheelDelta || -e.detail < 0? -1 : 1;
        setKey('wheel', ct.mouse.wheel);
        e.preventDefault();
    };
    
    ct.mouse.setupListeners = function () {
        if (document.addEventListener) {
            document.addEventListener('mousemove', ct.mouse.listenerMove, false);
            document.addEventListener('mouseup', ct.mouse.listenerUp, false);
            document.addEventListener('mousedown', ct.mouse.listenerDown, false);
            document.addEventListener('wheel', ct.mouse.listenerWheel, false);
            document.addEventListener('contextmenu', ct.mouse.listenerContextMenu, false);
            document.addEventListener('DOMMouseScroll', ct.mouse.listenerWheel, false);
        } else { // IE?
            document.attachEvent('onmousemove', ct.mouse.listenerMove);
            document.attachEvent('onmouseup', ct.mouse.listenerUp);
            document.attachEvent('onmousedown', ct.mouse.listenerDown);
            document.attachEvent('oncontextmenu', ct.mouse.listenerWheel);
            document.attachEvent('onmousewheel', ct.mouse.listenerContextMenu);
        }
    };
})();
