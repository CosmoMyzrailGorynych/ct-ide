/**
 * @author CoMiGo
 *
 */
/*
So originally there were GitHub's Hotkeys,
but I wanted a more automagical workflow of defining hotkeys.

This lib triggers form elements (clicks or focus events, depending on input's type)
on key presses in a declarative way, based on HTML markup plus a couple of scoping functions.

On each key press, the lib queries the document for the resulting key combination.
The selector is `[data-hotkey="Your-Code"]`

You can narrow the scope of the query by calling `hotkey.push(scope)`. (See more methods below.)
The scope is nested, forming a stack. If a scope is specified, it is read from the most recently
added part to the outer scope, trying to call the elements that are inside a scoped parent.
Such parent is defined by adding `data-hotkey-scope="scope"` attribute to an HTML element.

By default, if there are no suitable elements that suit the current scope,
the hotkey event is checked against the whole page. To disable it, add
`data-hotkey-require-scope="scope"` attribute to a form element.

If there are a number of form elements that suit the scope and a hotkey,
only one is triggered. You can set priority with `data-hotkey-priority="10"`.
The default priority is 0.

Use of priorities is not encouraged. Use scope whenever possible.
*/

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
/* GitHub code ends */

const getPriority = function getPriority(elt) {
    if (elt.hasAttribute('data-hotkey-priority')) {
        return Number(elt.getAttribute('data-hotkey-priority'));
    }
    return 0;
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

        // querySelectorAll returns a NodeList, which is not a sortable array. Convert by spreading.
        const elts = [...this.document.querySelectorAll(`[data-hotkey="${code.replace(/"/g, '\\"')}"]`)];

        elts.sort((a, b) => getPriority(b) - getPriority(a));
        if (this.scopeStack.length) {
            // walk from the most recent scope to the last one
            for (let i = this.scopeStack.length - 1; i >= 0; i--) {
                const scope = this.scopeStack[i];
                for (const elt of elts) {
                    if (elt.hasAttribute('data-hotkey-require-scope') &&
                        elt.getAttribute('data-hotkey-require-scope') !== scope
                    ) {
                        continue;
                    }
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
            if (elt.hasAttribute('data-hotkey-require-scope')) {
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
