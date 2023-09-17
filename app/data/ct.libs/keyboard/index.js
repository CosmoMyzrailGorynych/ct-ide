(function ctKeyboard() {
    var keyPrefix = 'keyboard.';
    var setKey = function (key, value) {
        ct.inputs.registry[keyPrefix + key] = value;
    };

    ct.keyboard = {
        string: '',
        lastKey: '',
        lastCode: '',
        alt: false,
        shift: false,
        ctrl: false,
        permitDefault: false,
        clear() {
            delete ct.keyboard.lastKey;
            delete ct.keyboard.lastCode;
            ct.keyboard.string = '';
            ct.keyboard.alt = false;
            ct.keyboard.shift = false;
            ct.keyboard.ctrl = false;
        },
        check: [],
        onDown(e) {
            ct.keyboard.shift = e.shiftKey;
            ct.keyboard.alt = e.altKey;
            ct.keyboard.ctrl = e.ctrlKey;
            ct.keyboard.lastKey = e.key;
            ct.keyboard.lastCode = e.code;
            if (e.code) {
                setKey(e.code, 1);
            } else {
                setKey('Unknown', 1);
            }
            if (e.key) {
                if (e.key.length === 1) {
                    ct.keyboard.string += e.key;
                } else if (e.key === 'Backspace') {
                    ct.keyboard.string = ct.keyboard.string.slice(0, -1);
                } else if (e.key === 'Enter') {
                    ct.keyboard.string = '';
                }
            }
            if (!ct.keyboard.permitDefault) {
                e.preventDefault();
            }
        },
        onUp(e) {
            ct.keyboard.shift = e.shiftKey;
            ct.keyboard.alt = e.altKey;
            ct.keyboard.ctrl = e.ctrlKey;
            if (e.code) {
                setKey(e.code, 0);
            } else {
                setKey('Unknown', 0);
            }
            if (!ct.keyboard.permitDefault) {
                e.preventDefault();
            }
        }
    };

    if (document.addEventListener) {
        document.addEventListener('keydown', ct.keyboard.onDown, false);
        document.addEventListener('keyup', ct.keyboard.onUp, false);
    } else {
        document.attachEvent('onkeydown', ct.keyboard.onDown);
        document.attachEvent('onkeyup', ct.keyboard.onUp);
    }
})();
