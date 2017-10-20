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
};
ct.mouse.listenerdown = function (e) {
    ct.mouse.pressed = true;
    ct.mouse.down = true;
    ct.mouse.button = e.button;
    e.preventDefault();
};
ct.mouse.listenerup = function (e) {
    ct.mouse.released = true;
    ct.mouse.down = false;
    ct.mouse.button = e.button;
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
