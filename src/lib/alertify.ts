/* eslint-disable func-names */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
/* eslint-disable id-length */
/* eslint {
    'no-underscore-dangle': 'off',
    max-params: 'off'
} */

'use strict';
import {soundbox} from './3rdparty/soundbox';

type logType = 'default' | 'warning' | 'error' | 'success';
type modal = {
    type: 'confirm' | 'prompt' | 'alert';
    message: string;
    onOkay?: (value: string | null, evt: MouseEvent) => void;
    onCancel?: (value: string | null, evt: MouseEvent) => void;
}

var TRANSITION_FALLBACK_DURATION = 500;
var hideElement = function (el: Element) {
    if (!el) {
        return;
    }

    var removeThis = function () {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    };

    el.classList.remove('show');
    el.classList.add('hide');
    el.addEventListener('transitionend', removeThis);

    // Fallback for no transitions.
    setTimeout(removeThis, TRANSITION_FALLBACK_DURATION);
};

/**
 * Alertify private object
 */
const settings = {
    parent: document.body,
    version: 'ctjs',
    defaultOkLabel: 'Ok',
    okLabel: 'Ok',
    defaultCancelLabel: 'Cancel',
    cancelLabel: 'Cancel',
    defaultMaxLogItems: 5,
    maxLogItems: 5,
    promptValue: '',
    promptPlaceholder: '',
    closeLogOnClick: false,
    closeLogOnClickDefault: false,
    delay: 5000,
    defaultDelay: 5000,
    logContainerClass: 'alertify-logs',
    logContainerDefaultClass: 'alertify-logs',
    logTemplateMethod: null as null | ((str: string) => string),
    dialogs: {
        buttons: {
            holder: '<nav>{{buttons}}</nav>',
            ok: '<button class=\'ok\' tabindex=\'1\'>{{ok}}</button>',
            cancel: '<button class=\'cancel\' tabindex=\'2\'>{{cancel}}</button>'
        },
        input: '<input type=\'text\'>',
        message: '<p class=\'msg\'>{{message}}</p>',
        log: '<div class=\'{{class}}\'>{{message}}</div>'
    },

    defaultDialogs: {
        buttons: {
            holder: '<nav>{{buttons}}</nav>',
            ok: '<button class=\'ok\' tabindex=\'1\'>{{ok}}</button>',
            cancel: '<button class=\'cancel\' tabindex=\'2\'>{{cancel}}</button>'
        },
        input: '<input type=\'text\'>',
        message: '<p class=\'msg\'>{{message}}</p>',
        log: '<div class=\'{{class}}\'>{{message}}</div>'
    },

    /**
     * Build the proper message box
     *
     * @param item Current object in the queue
     *
     * @return  An HTML string of the message box
     */
    build(item: modal) {
        var btnTxt = settings.dialogs.buttons.ok;
        var html = '<div class=\'dialog\'><div>' + settings.dialogs.message.replace('{{message}}', item.message);

        if (item.type === 'confirm' || item.type === 'prompt') {
            btnTxt = settings.dialogs.buttons.cancel + settings.dialogs.buttons.ok;
        }

        if (item.type === 'prompt') {
            html += settings.dialogs.input;
        }

        html = (html + settings.dialogs.buttons.holder + '</div></div>')
            .replace('{{buttons}}', btnTxt)
            .replace('{{ok}}', settings.okLabel)
            .replace('{{cancel}}', settings.cancelLabel);

        return html;
    },

    setCloseLogOnClick(close: boolean) {
        settings.closeLogOnClick = Boolean(close);
    },

    /**
     * Close the log messages
     *
     * @param elem HTML Element of log message to close
     * @param wait [optional] Time (in ms) to wait before automatically hiding the message, if 0 never hide
     */
    close(elem: Element, wait: number) {
        if (settings.closeLogOnClick) {
            elem.addEventListener('click', function () {
                hideElement(elem);
            });
        }

        wait = wait && !isNaN(Number(wait)) ? Number(wait) : settings.delay;

        if (wait < 0) {
            hideElement(elem);
        } else if (wait > 0) {
            setTimeout(function () {
                hideElement(elem);
            }, wait);
        }
    },

    /**
     * Create a dialog box
     *
     * @param  {String}   message      The message passed from the callee
     * @param  {String}   type         Type of dialog to create
     * @param  {Function} onOkay       [Optional] Callback function when clicked okay.
     * @param  {Function} onCancel     [Optional] Callback function when cancelled.
     *
     * @return {Object} New dialog box
     */
    dialog(
        message: string,
        type: modal['type'],
        onOkay?: (value: string, evt: MouseEvent) => void,
        onCancel?: (value: string, evt: MouseEvent) => void
    ) {
        return settings.setup({
            type,
            message,
            onOkay,
            onCancel
        });
    },

    /**
     * Show a new log message box
     *
     * @param message The message passed from the callee
     * @param type [Optional] Optional type of log message
     * @param click [Optional] Callback
     */
    log(message: string, type?: logType, click?: (e: MouseEvent) => void) {
        var existing = document.querySelectorAll('.alertify-logs > div');
        if (existing) {
            var diff = existing.length - settings.maxLogItems;
            if (diff >= 0) {
                for (var i = 0, _i = diff + 1; i < _i; i++) {
                    settings.close(existing[i], -1);
                }
            }
        }
        settings.notify(message, type, click);
    },

    setLogPosition(str: string) {
        settings.logContainerClass = 'alertify-logs ' + str;
    },

    setupLogContainer() {
        var elLog = document.querySelector('.alertify-logs');
        var className = settings.logContainerClass;
        if (!elLog) {
            elLog = document.createElement('div');
            elLog.className = className;
            settings.parent.appendChild(elLog);
        }

        // Make sure it's positioned properly.
        if (elLog.className !== className) {
            elLog.className = className;
        }

        return elLog;
    },

    /**
     * Add new log message
     * If a type is passed, a class name "{type}" will get added.
     * _alertify allows for custom look and feel for various types of notifications.
     *
     * @param message    The message passed from the callee
     * @param type [Optional] Type of log message
     * @param click [Optional] Callback
     */
    notify(
        message: string,
        type?: logType,
        click?: (e: MouseEvent) => void
    ) {
        var elLog = settings.setupLogContainer();
        var log = document.createElement('div');

        log.className = (type || 'default');
        if (settings.logTemplateMethod) {
            log.innerHTML = settings.logTemplateMethod(message);
        } else {
            log.innerHTML = message;
        }

        // Add the click handler, if specified.
        if (typeof click === 'function') {
            log.addEventListener('click', click);
        } else {
            log.addEventListener('click', () => {
                settings.close(log, -1);
            });
        }

        elLog.appendChild(log);
        setTimeout(function () {
            log.className += ' show';
        }, 10);

        settings.close(log, settings.delay);
    },

    /**
     * Initiate all the required pieces for the dialog box
     *
     * @param item HTML
     */
    setup(item: modal) {
        var el = document.createElement('div');
        el.className = 'alertify hide';
        el.innerHTML = settings.build(item);

        var btnOK: HTMLButtonElement | null = el.querySelector('.ok');
        var btnCancel: HTMLButtonElement | null = el.querySelector('.cancel');
        var input = item.type === 'prompt' ? el.querySelector('input') : null;

        // Set default value/placeholder of input
        if (input) {
            if (typeof settings.promptValue === 'string') {
                input.value = settings.promptValue;
            }
        }

        var setupHandlers = function (resolve?: (event: {
            buttonClicked: 'ok' | 'cancel',
            inputValue?: string,
            event: MouseEvent
        }) => unknown) {
            if (typeof resolve !== 'function') {
                // promises are not available so resolve is a no-op
                resolve = function () {
                    void 0;
                };
            }

            if (btnOK) {
                btnOK.addEventListener('click', function (ev) {
                    if (item.onOkay && typeof item.onOkay === 'function') {
                        if (input) {
                            item.onOkay(input.value, ev);
                        } else {
                            item.onOkay(null, ev);
                        }
                    }

                    if (input) {
                        resolve({
                            buttonClicked: 'ok',
                            inputValue: input.value,
                            event: ev
                        });
                    } else {
                        resolve({
                            buttonClicked: 'ok',
                            event: ev
                        });
                    }

                    hideElement(el);
                });
            }

            if (btnCancel) {
                btnCancel.addEventListener('click', function (ev) {
                    if (item.onCancel && typeof item.onCancel === 'function') {
                        item.onCancel(null, ev);
                    }

                    resolve({
                        buttonClicked: 'cancel',
                        event: ev
                    });

                    hideElement(el);
                });
            }

            if (input) {
                input.addEventListener('keyup', function (ev) {
                    if (ev.which === 13) {
                        btnOK?.click();
                    }
                });
            }
        };

        var promise;

        if (typeof Promise === 'function') {
            promise = new Promise(setupHandlers);
        } else {
            setupHandlers();
        }

        settings.parent.appendChild(el);
        setTimeout(function () {
            el.classList.remove('hide');
            if (input && item.type && item.type === 'prompt') {
                input.select();
                input.focus();
            } else if (btnOK) {
                btnOK.focus();
            }
        }, 100);

        return promise;
    },

    setDelay(time: number | string) {
        time = time || 0;
        settings.delay = (typeof time === 'string' ? parseInt(time as string, 10) : time) || settings.defaultDelay;
        return settings;
    },

    okBtn(label: string) {
        settings.okLabel = label;
        return settings;
    },
    cancelBtn(str: string) {
        settings.cancelLabel = str;
        return settings;
    },

    setMaxLogItems(num?: string | number) {
        settings.maxLogItems = typeof num === 'number' ?
            (num || settings.defaultMaxLogItems) :
            parseInt(num || '', 10) || settings.defaultMaxLogItems;
    },

    theme() {
        settings.dialogs.buttons.ok = settings.defaultDialogs.buttons.ok;
        settings.dialogs.buttons.cancel = settings.defaultDialogs.buttons.cancel;
        settings.dialogs.input = settings.defaultDialogs.input;
    },

    reset() {
        settings.parent = document.body;
        settings.theme();
        settings.okBtn(settings.defaultOkLabel);
        settings.cancelBtn(settings.defaultCancelLabel);
        settings.setMaxLogItems();
        settings.promptValue = '';
        settings.promptPlaceholder = '';
        settings.delay = settings.defaultDelay;
        settings.setCloseLogOnClick(settings.closeLogOnClickDefault);
        settings.setLogPosition('bottom right');
        settings.logTemplateMethod = null;
    },

    injectCSS() {
        if (!document.querySelector('#alertifyCSS')) {
            var [head] = document.getElementsByTagName('head');
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = 'alertifyCSS';
            css.innerHTML = '/* style.css */';
            head.insertBefore(css, head.firstChild);
        }
    },

    removeCSS() {
        var css = document.querySelector('#alertifyCSS');
        if (css && css.parentNode) {
            css.parentNode.removeChild(css);
        }
    }

};
settings.injectCSS();

export class Alertify {
    _$$alertify = settings;
    static parent(elem: HTMLElement) {
        settings.parent = elem;
    }
    reset() {
        settings.reset();
        return this;
    }
    alert(
        message: string,
        onOkay?: (value: string, evt: MouseEvent) => void,
        onCancel?: (value: string, evt: MouseEvent) => void
    ) {
        return settings.dialog(message, 'alert', onOkay, onCancel) || this;
    }
    confirm(
        message: string,
        onOkay?: (value: string, evt: MouseEvent) => void,
        onCancel?: (value: string, evt: MouseEvent) => void
    ) {
        return settings.dialog(message, 'confirm', onOkay, onCancel) || this;
    }
    prompt(
        message: string,
        onOkay?: (value: string, evt: MouseEvent) => void,
        onCancel?: (value: string, evt: MouseEvent) => void
    ) {
        return settings.dialog(message, 'prompt', onOkay, onCancel) || this;
    }
    theme() {
        settings.theme();
        return this;
    }
    log(message: string, click?: (e: MouseEvent) => void) {
        settings.log(message, 'default', click);
        return this;
    }
    success(message: string, click?: (e: MouseEvent) => void) {
        settings.log(message, 'success', click);
        if (localStorage.disableSounds !== 'on') {
            soundbox.play('Success');
        }
        return this;
    }
    error(message: string, click?: (e: MouseEvent) => void) {
        settings.log(message, 'error', click);
        if (localStorage.disableSounds !== 'on') {
            soundbox.play('Failure');
        }
        return this;
    }
    cancelBtn(label: string) {
        settings.cancelBtn(label);
        return this;
    }
    okBtn(label: string) {
        settings.okBtn(label);
        return this;
    }
    delay(time: number | string) {
        settings.setDelay(time);
        return this;
    }
    placeholder(str: string) {
        settings.promptPlaceholder = str;
        return this;
    }
    defaultValue(str: string) {
        settings.promptValue = str;
        return this;
    }
    maxLogItems(num: number | string) {
        settings.setMaxLogItems(num);
        return this;
    }
    closeLogOnClick(close: boolean) {
        settings.setCloseLogOnClick(Boolean(close));
        return this;
    }
    logPosition(str: string) {
        settings.setLogPosition(str || '');
        return this;
    }
    setLogTemplate(templateMethod: null | ((message: string) => string)) {
        settings.logTemplateMethod = templateMethod;
        return this;
    }
    clearLogs() {
        settings.setupLogContainer().innerHTML = '';
        return this;
    }
    version = settings.version;
}

const alertify = new Alertify();
alertify.reset();

window.alertify = alertify;
export default alertify;
