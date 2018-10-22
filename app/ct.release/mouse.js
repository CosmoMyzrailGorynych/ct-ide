ct.mouse = {
    x: 0,
    y: 0,
    xprev: 0,
    yprev: 0,
    inside: false,
    pressed: false,
    down: false,
    released: false,
    button: 0,
    wheel: 0,
    clear() {
        ct.mouse.pressed = false;
        ct.mouse.down = false;
        ct.mouse.released = false;
        ct.mouse.wheel = 0;
    },
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
    }
};

ct.mouse.listenermove = function(e) {
    var rect = ct.HTMLCanvas.getBoundingClientRect();
    ct.mouse.rx = (e.clientX - rect.left) * ct.width / rect.width;
    ct.mouse.ry = (e.clientY - rect.top) * ct.height / rect.height;
    ct.mouse.x = ct.mouse.rx + ct.rooms.current.x;
    ct.mouse.y = ct.mouse.ry + ct.rooms.current.y;
    if (ct.mouse.rx > 0 && ct.mouse.ry > 0 && ct.mouse.ry < ct.height && ct.mouse.rx < ct.width) {
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
ct.mouse.listenerwheel = function (e) {
    ct.mouse.wheel = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    e.preventDefault();
};

ct.mouse.setupListeners = function () {
    if (document.addEventListener) {
        document.addEventListener('mousemove', ct.mouse.listenermove, false);
        document.addEventListener('mouseup', ct.mouse.listenerup, false);
        document.addEventListener('mousedown', ct.mouse.listenerdown, false);
        document.addEventListener('mousewheel', ct.mouse.listenerwheel, false);
        document.addEventListener('DOMMouseScroll', ct.mouse.listenerwheel, false);
    } else { // IE?
        document.attachEvent('onmousemove', ct.mouse.listenermove);
        document.attachEvent('onmouseup', ct.mouse.listenerup);
        document.attachEvent('onmousedown', ct.mouse.listenerdown);
        document.attachEvent('onmousewheel', ct.mouse.listenerwheel);
    }
};
