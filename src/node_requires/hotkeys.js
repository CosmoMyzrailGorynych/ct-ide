/* From @github/hotkey
    see https://github.com/github/hotkey/ */
const isFormField = function (inputElement) {
    if (!(inputElement instanceof HTMLElement)) {
        return false;
    }
    var name = inputElement.nodeName.toLowerCase();
    var type = (inputElement.getAttribute('type') || '').toLowerCase();
    /* eslint no-mixed-operators: off*/
    return name === 'select' ||
            name === 'textarea' ||
            name === 'input' &&
            type !== 'submit' &&
            type !== 'reset' &&
            type !== 'checkbox' &&
            type !== 'radio' ||
            inputElement.isContentEditable;
};

const getCode = e => ''
    .concat(e.ctrlKey ? 'Control+' : '')
    .concat(e.altKey ? 'Alt+' : '')
    .concat(e.metaKey ? 'Meta+' : '')
    .concat(e.key);

const listenerRef = Symbol('keydownListener');
const offDomEventsRef = Symbol('offDomEventsRef');
const hotkeyRef = Symbol('hotkey');

class Hotkeys {
    constructor(doc) {
        this.document = doc;
        this.document[hotkeyRef] = this;
        this.scopeStack = [];

        this[offDomEventsRef] = new Map();

        this[listenerRef] = e => {
            const code = getCode(e);
            this.trigger(code);
        };
        this.document.body.addEventListener('keydown', this[listenerRef]);
    }

    on(code, event) {
        if (!this[offDomEventsRef].has(code)) {
            this[offDomEventsRef].set(code, []);
        }
        if (this[offDomEventsRef].get(code).indexOf(event) === -1) {
            this[offDomEventsRef].get(code).push(event);
        }
    }
    off(code, event) {
        if (event) {
            const ind = this[offDomEventsRef].get(code).indexOf(event);
            if (ind !== -1) {
                this[offDomEventsRef].get(code).splice(ind, 1);
            }
        } else {
            this[offDomEventsRef].set(code, []);
        }
    }
    trigger(code) {
        const offDom = this[offDomEventsRef].get(code);
        if (offDom) {
            for (const event of offDom) {
                event();
            }
        }
        const elts = this.document.querySelectorAll(`[data-hotkey="${code.replace(/"/g, '\\"')}"]`);
        if (this.scopeStack.length) {
            // walk from the most recent scope to the last one
            for (let i = this.scopeStack.length - 1; i >= 0; i--) {
                const scope = this.scopeStack[i];
                for (const elt of elts) {
                    if (!elt.closest(`[data-hotkey-scope="${scope}"]`)) {
                        continue;
                    }
                    if (isFormField(elt)) {
                        elt.focus();
                    } else {
                        elt.click();
                    }
                    return;
                }
            }
        }
        // Look for all the elements if no scope
        // is specified or no scoped elements were found
        for (const elt of elts) {
            if (isFormField(elt)) {
                elt.focus();
            } else {
                elt.click();
            }
            return;
        }
    }

    get scope() {
        return this.scopeStack[this.scopeStack.length - 1];
    }
    set scope(val) {
        if (Array.isArray(val)) {
            this.scopeStack = val;
        } else {
            this.scopeStack = val.split(' ');
        }
    }
    push(val) {
        this.scopeStack.push(val);
    }
    pop() {
        return this.scopeStack.pop();
    }
    remove(val) {
        const ind = this.scopeStack.indexOf(val);
        if (val !== -1) {
            this.scopeStack.splice(ind, 1);
        }
        return ind !== -1;
    }
    exit(val) {
        const ind = this.scopeStack.indexOf(val);
        if (val !== -1) {
            this.scopeStack.splice(ind);
        }
        return ind !== -1;
    }
    cleanScope() {
        this.scopeStack.length = 0;
    }
    inScope(val) {
        return this.scopeStack.indexOf(val) !== -1;
    }

    unmount() {
        this.document.body.removeEventListener('keydown', this[listenerRef]);
    }
}

module.exports = function mountHotkeys(doc) {
    doc = doc || document;
    if (!doc) {
        throw new Error('Can\'t find the document object! Am I in a bare node.js context?!');
    }
    if (hotkeyRef in doc) {
        return doc[hotkeyRef];
    }
    return new Hotkeys(doc);
};
