/****************************************
          [ keyboard cotomod ]
[ (c) Cosmo Myzrail Gorynych 2013, 2015 ]
****************************************/

ct.keyboard = {
    'string':'',
    'pressed':[],
    'released':[],
    'down':[],
    'alt':false,
    'shift':false,
    'ctrl':false,
    'clear': function () {
        ct.keyboard.pressed = [];
        ct.keyboard.released = [];
        ct.keyboard.alt = false;
        ct.keyboard.shift = false;
        ct.keyboard.ctrl = false;
    },
    'check': [],
    'getkey': function (k) {
            if (k == 8) {
                ct.keyboard.key = 'backspace';
                ct.keyboard.string = ct.keyboard.string.slice(0,-1);
            }
            else if (k == 32) { ct.keyboard.key = 'space'; ct.keyboard.string += ' ';}
            else if (k == 37) ct.keyboard.key = 'left';
            else if (k == 38) ct.keyboard.key = 'up';
            else if (k == 39) ct.keyboard.key = 'right';
            else if (k == 40) ct.keyboard.key = 'down';
            else if (k == 27) ct.keyboard.key = 'escape';
            else if (k == 16) ct.keyboard.key = 'shift';
            else if (k == 17) ct.keyboard.key = 'control';
            else if (k == 18) ct.keyboard.key = 'alt';
            else if (k == 33) ct.keyboard.key = 'pageup';
            else if (k == 34) ct.keyboard.key = 'pagedown';
            else if (k == 35) ct.keyboard.key = 'end';
            else if (k == 36) ct.keyboard.key = 'home';
            else if (k == 45) ct.keyboard.key = 'insert';
            else if (k == 46) ct.keyboard.key = 'delete';
            else {
                ct.keyboard.key = String.fromCharCode(k);
                if (ct.keyboard.shift) {
                    if (k == 49) ct.keyboard.string += '!';
                    else if (k == 50) ct.keyboard.string += '@';    
                    else if (k == 51) ct.keyboard.string += '#';
                    else if (k == 52) ct.keyboard.string += '$';
                    else if (k == 53) ct.keyboard.string += '%';
                    else if (k == 54) ct.keyboard.string += '^';
                    else if (k == 55) ct.keyboard.string += '&';
                    else if (k == 56) ct.keyboard.string += '*';
                    else if (k == 57) ct.keyboard.string += '(';
                    else if (k == 48) ct.keyboard.string += ')';
                    else if (k == 187) ct.keyboard.string += '+';
                    else if (k == 188) ct.keyboard.string += '<';
                    else if (k == 189) ct.keyboard.string += '_';
                    else if (k == 190) ct.keyboard.string += '>';
                    else if (k == 191) ct.keyboard.string += '?';
                    else if (k == 219) ct.keyboard.string += '{'; 
                    else if (k == 221) ct.keyboard.string += '}';
                    else if (k == 186) ct.keyboard.string += ':';
                    else if (k == 222) ct.keyboard.string += '"';
                    else ct.keyboard.string += String.fromCharCode(k);
                } 
                else if (k == 187) ct.keyboard.string += '=';
                else if (k == 188) ct.keyboard.string += ',';
                else if (k == 190) ct.keyboard.string += '.';
                else if (k == 191) ct.keyboard.string += '/';
                else if (k == 219) ct.keyboard.string += '[';
                else if (k == 221) ct.keyboard.string += ']';
                else if (k == 186) ct.keyboard.string += ';';
                else if (k == 222) ct.keyboard.string += "'";
                else ct.keyboard.string += String.fromCharCode(k).toLowerCase();
        }
    },
    'ondown': function (e) {
        ct.keyboard.shift = e.shiftKey;
        ct.keyboard.alt = e.altKey;
        ct.keyboard.ctrl = e.ctrlKey;
        ct.keyboard.getkey(e.keyCode);
        ct.keyboard.pressed[ct.keyboard.key] = true;
        ct.keyboard.down[ct.keyboard.key] = true;
        e.preventDefault();
    },
    'onup': function (e) {
        ct.keyboard.shift = e.shiftKey;
        ct.keyboard.alt = e.altKey;
        ct.keyboard.ctrl = e.ctrlKey;
        ct.keyboard.getkey(e.keyCode);
        ct.keyboard.released[ct.keyboard.key] = true;
        delete ct.keyboard.down[ct.keyboard.key];
        e.preventDefault();
    }
};

document.addEventListener ? document.addEventListener("keydown", ct.keyboard.ondown, false) : document.attachEvent("onkeydown", ct.keyboard.ondown);
document.addEventListener ? document.addEventListener("keyup", ct.keyboard.onup, false) : document.attachEvent("onkeyup", ct.keyboard.onup);
ct.libs += ' keyboard';