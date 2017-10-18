/* eslint {
    'no-underscore-dangle': 'off',
    max-params: 'off'
} */

(function() {
    
    'use strict';

    var TRANSITION_FALLBACK_DURATION = 500;
    var hideElement = function(el) {

        if (!el) {
            return;
        }

        var removeThis = function() {
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

    var Alertify = function () {

        /**
         * Alertify private object
         * @type {Object}
         */
        var _alertify = {
            parent: document.body,
            version: '1.0.11',
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
             * @param  {Object} item    Current object in the queue
             *
             * @return {String}         An HTML string of the message box
             */
            build(item) {

                var btnTxt = this.dialogs.buttons.ok;
                var html = '<div class=\'dialog\'><div>' + this.dialogs.message.replace('{{message}}', item.message);

                if (item.type === 'confirm' || item.type === 'prompt') {
                    btnTxt = this.dialogs.buttons.cancel + this.dialogs.buttons.ok;
                }

                if (item.type === 'prompt') {
                    html += this.dialogs.input;
                }

                html = (html + this.dialogs.buttons.holder + '</div></div>')
                    .replace('{{buttons}}', btnTxt)
                    .replace('{{ok}}', this.okLabel)
                    .replace('{{cancel}}', this.cancelLabel);

                return html;

            },

            setCloseLogOnClick(bool) {
                this.closeLogOnClick = Boolean(bool);
            },

            /**
             * Close the log messages
             *
             * @param  {Object} elem    HTML Element of log message to close
             * @param  {Number} wait    [optional] Time (in ms) to wait before automatically hiding the message, if 0 never hide
             *
             * @return {undefined}
             */
            close(elem, wait) {

                if (this.closeLogOnClick) {
                    elem.addEventListener('click', function() {
                        hideElement(elem);
                    });
                }

                wait = wait && !isNaN(Number(wait)) ? Number(wait) : this.delay;

                if (wait < 0) {
                    hideElement(elem);
                } else if (wait > 0) {
                    setTimeout(function() {
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
            dialog(message, type, onOkay, onCancel) {
                return this.setup({
                    type,
                    message,
                    onOkay,
                    onCancel
                });
            },

            /**
             * Show a new log message box
             *
             * @param  {String} message    The message passed from the callee
             * @param  {String} type       [Optional] Optional type of log message
             * @param  {Number} click      [Optional] Callback
             *
             * @return {void}
             */
            log(message, type, click) {

                var existing = document.querySelectorAll('.alertify-logs > div');
                if (existing) {
                    var diff = existing.length - this.maxLogItems;
                    if (diff >= 0) {
                        for (var i = 0, _i = diff + 1; i < _i; i++) {
                            this.close(existing[i], -1);
                        }
                    }
                }

                this.notify(message, type, click);
            },

            setLogPosition(str) {
                this.logContainerClass = 'alertify-logs ' + str;
            },

            setupLogContainer() {

                var elLog = document.querySelector('.alertify-logs');
                var className = this.logContainerClass;
                if (!elLog) {
                    elLog = document.createElement('div');
                    elLog.className = className;
                    this.parent.appendChild(elLog);
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
             * This allows for custom look and feel for various types of notifications.
             *
             * @param  {String} message    The message passed from the callee
             * @param  {String} type       [Optional] Type of log message
             * @param  {Number} click      [Optional] Callback
             *
             * @return {undefined}
             */
            notify(message, type, click) {

                var elLog = this.setupLogContainer();
                var log = document.createElement('div');

                log.className = (type || 'default');
                if (_alertify.logTemplateMethod) {
                    log.innerHTML = _alertify.logTemplateMethod(message);
                } else {
                    log.innerHTML = message;
                }

                // Add the click handler, if specified.
                if (typeof click === 'function') {
                    log.addEventListener('click', click);
                }

                elLog.appendChild(log);
                setTimeout(function() {
                    log.className += ' show';
                }, 10);

                this.close(log, this.delay);

            },

            /**
             * Initiate all the required pieces for the dialog box
             * 
             * @param {String} item HTML
             *
             * @return {undefined}
             */
            setup(item) {

                var el = document.createElement('div');
                el.className = 'alertify hide';
                el.innerHTML = this.build(item);

                var btnOK = el.querySelector('.ok');
                var btnCancel = el.querySelector('.cancel');
                var input = item.type === 'prompt'? el.querySelector('input') : null;

                // Set default value/placeholder of input
                if (input) {
                    if (typeof this.promptValue === 'string') {
                        input.value = this.promptValue;
                    }
                }

                var setupHandlers = function(resolve) {
                    if (typeof resolve !== 'function') {
                        // promises are not available so resolve is a no-op
                        resolve = function () {void 0;};
                    }

                    if (btnOK) {
                        btnOK.addEventListener('click', function(ev) {
                            if (item.onOkay && typeof item.onOkay === 'function') {
                                if (input) {
                                    item.onOkay(input.value, ev);
                                } else {
                                    item.onOkay(ev);
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
                        btnCancel.addEventListener('click', function(ev) {
                            if (item.onCancel && typeof item.onCancel === 'function') {
                                item.onCancel(ev);
                            }

                            resolve({
                                buttonClicked: 'cancel',
                                event: ev
                            });

                            hideElement(el);
                        });
                    }

                    if (input) {
                        input.addEventListener('keyup', function(ev) {
                            if (ev.which === 13) {
                                btnOK.click();
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

                this.parent.appendChild(el);
                setTimeout(function() {
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

            okBtn(label) {
                this.okLabel = label;
                return this;
            },

            setDelay(time) {
                time = time || 0;
                this.delay = isNaN(time) ? this.defaultDelay : parseInt(time, 10);
                return this;
            },

            cancelBtn(str) {
                this.cancelLabel = str;
                return this;
            },

            setMaxLogItems(num) {
                this.maxLogItems = parseInt(num || this.defaultMaxLogItems, 10);
            },

            theme() {
                this.dialogs.buttons.ok = this.defaultDialogs.buttons.ok;
                this.dialogs.buttons.cancel = this.defaultDialogs.buttons.cancel;
                this.dialogs.input = this.defaultDialogs.input;
            },

            reset() {
                this.parent = document.body;
                this.theme('default');
                this.okBtn(this.defaultOkLabel);
                this.cancelBtn(this.defaultCancelLabel);
                this.setMaxLogItems();
                this.promptValue = '';
                this.promptPlaceholder = '';
                this.delay = this.defaultDelay;
                this.setCloseLogOnClick(this.closeLogOnClickDefault);
                this.setLogPosition('bottom right');
                this.logTemplateMethod = null;
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

        _alertify.injectCSS();

        return {
            _$$alertify: _alertify,
            parent(elem) {
                _alertify.parent = elem;
            },
            reset() {
                _alertify.reset();
                return this;
            },
            alert(message, onOkay, onCancel) {
                return _alertify.dialog(message, 'alert', onOkay, onCancel) || this;
            },
            confirm(message, onOkay, onCancel) {
                return _alertify.dialog(message, 'confirm', onOkay, onCancel) || this;
            },
            prompt(message, onOkay, onCancel) {
                return _alertify.dialog(message, 'prompt', onOkay, onCancel) || this;
            },
            log(message, click) {
                _alertify.log(message, 'default', click);
                return this;
            },
            theme(themeStr) {
                _alertify.theme(themeStr);
                return this;
            },
            success(message, click) {
                _alertify.log(message, 'success', click);
                return this;
            },
            error(message, click) {
                _alertify.log(message, 'error', click);
                return this;
            },
            cancelBtn(label) {
                _alertify.cancelBtn(label);
                return this;
            },
            okBtn(label) {
                _alertify.okBtn(label);
                return this;
            },
            delay(time) {
                _alertify.setDelay(time);
                return this;
            },
            placeholder(str) {
                _alertify.promptPlaceholder = str;
                return this;
            },
            defaultValue(str) {
                _alertify.promptValue = str;
                return this;
            },
            maxLogItems(num) {
                _alertify.setMaxLogItems(num);
                return this;
            },
            closeLogOnClick(bool) {
                _alertify.setCloseLogOnClick(Boolean(bool));
                return this;
            },
            logPosition(str) {
                _alertify.setLogPosition(str || '');
                return this;
            },
            setLogTemplate(templateMethod) {
                _alertify.logTemplateMethod = templateMethod;
                return this;
            },
            clearLogs() {
                _alertify.setupLogContainer().innerHTML = '';
                return this;
            },
            version: _alertify.version
        };
    };

    // AMD, window, and NPM support
    if (typeof module !== 'undefined' && Boolean(module) && Boolean(module.exports)) {
        // Preserve backwards compatibility
        module.exports = function() {
            return new Alertify();
        };
        var obj = new Alertify();
        for (var key in obj) {
            module.exports[key] = obj[key];
        }
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return new Alertify();
        });
    } else {
        window.alertify = new Alertify();
    }

}());

window.alertify.reset();
