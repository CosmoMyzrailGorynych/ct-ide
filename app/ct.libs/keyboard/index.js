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
        } else {
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
