/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
(function codeEditorHelpers() {
    const {extend} = require('./data/node_requires/objectUtils');
    const fs = require('fs-extra');
    const path = require('path');

    const lib = [
        './data/typedefs/pixi.js.d.ts',
        './data/typedefs/global.d.ts',
        './data/typedefs/keywordWorkarounds.d.ts'
    ];

    window.signals = window.signals || riot.observable({});
    window.signals.on('monacoBooted', () => {
        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true
        });
        monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true
        });

        for (const file of lib) {
            fs.readFile(path.join(__dirname, file), {
                encoding: 'utf-8'
            })
            .then(ctTyping => {
                monaco.languages.typescript.javascriptDefaults.addExtraLib(ctTyping);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(ctTyping);
            });
        }
    });

    /**
     * Adds custom hotkeys to the editors, specifically Ctrl+Plus,
     * Ctrl+Minus for font size manipulation.
     * @param {any} editor The editor to which to add hotkeys
     * @returns {void}
     */
    var extendHotkeys = (editor) => {
        const zoomInCombo = monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_EQUAL;
        editor.addCommand(zoomInCombo, function monacoZoomIn() {
            var num = Number(localStorage.fontSize);
            if (num < 48) {
                num++;
                localStorage.fontSize = num;
                window.signals.trigger('codeFontUpdated');
            }
            return false;
        });
        const zoomOutCombo = monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_MINUS;
        editor.addCommand(zoomOutCombo, function monacoZoomOut() {
            var num = Number(localStorage.fontSize);
            if (num > 6) {
                num--;
                localStorage.fontSize = num;
                window.signals.trigger('codeFontUpdated');
            }
            return false;
        });
    };

    const isRangeSelection = function (s) {
        if (s.selectionStartLineNumber !== s.positionLineNumber) {
            return true;
        }
        if (s.selectionStartColumn !== s.positionColumn) {
            return true;
        }
        return false;
    };

    // Tons of hacks go below, beware!
    // But maybe it will heal through time
    // @see https://github.com/microsoft/monaco-editor/issues/1661 and everything linked
    // eslint-disable-next-line max-lines-per-function
    const setUpWrappers = function (editor) {
        editor.setPosition({
            column: 0,
            lineNumber: 2
        });
        /* These signal to custom commands
           that the current cursor's position is in the end/start of the editable range */
        const contextSOR = editor.createContextKey('startOfEditable', false),
              contextEOR = editor.createContextKey('endOfEditable', false);

        const restrictSelections = function (selections) {
            selections = selections || editor.getSelections();
            let resetSelections = false;
            const model = editor.getModel();
            const maxLine = model.getLineCount() - 1;
            const lastLineCol = model.getLineContent(Math.max(maxLine, 1)).length + 1;

            contextEOR.set(false);
            contextSOR.set(false);

            for (const selection of selections) {
                if (selection.selectionStartLineNumber < 2) {
                    selection.selectionStartLineNumber = 2;
                    selection.selectionStartColumn = 1;
                    resetSelections = true;
                }
                if (selection.positionLineNumber < 2) {
                    selection.positionLineNumber = 2;
                    selection.positionColumn = 1;
                    resetSelections = true;
                }
                if (selection.selectionStartLineNumber > maxLine) {
                    selection.selectionStartLineNumber = maxLine;
                    selection.selectionStartColumn = lastLineCol;
                    resetSelections = true;
                }
                if (selection.positionLineNumber > maxLine) {
                    selection.positionLineNumber = maxLine;
                    selection.positionColumn = lastLineCol;
                    resetSelections = true;
                }
                /* Get if any of the cursors happened to be in the beginning/end
                    of the editable range, so that we can block Delete/Backspace behavior.
                    Range selections are safe, as they delete the selected content,
                    not that is behind/in front of them. */
                if (!isRangeSelection(selection)) {
                    if (selection.selectionStartLineNumber === 2 &&
                        selection.selectionStartColumn === 1
                    ) {
                        contextSOR.set(true);
                    }
                    if (selection.positionLineNumber === maxLine &&
                        selection.positionColumn === lastLineCol
                    ) {
                        contextEOR.set(true);
                    }
                }
            }
            if (resetSelections) {
                editor.setSelections(selections);
            }
        };

        // Turns out the Delete and Backspace keys do not produce a keyboard event but commands
        // These commands overlay the default ones, thus cancelling the default behaviour
        // @see https://github.com/microsoft/monaco-editor/issues/940
        const voidFunction = function () {
            void 0; // magic!
        };
        editor.addCommand(monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.Backspace, voidFunction, 'startOfEditable');
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Delete, voidFunction, 'endOfEditable');
        editor.addCommand(monaco.KeyCode.Delete, voidFunction, 'endOfEditable');

        // These cheat on the replace widget so that it cannot replace anything in the wrapper.
        // Done by temporarily switching to "replace in selection" mode and back.
        // Atomic replacements "work as expected" without this, for some reason or another.
        const find = editor.getContribution('editor.contrib.findController');
        const oldReplaceAll = find.replaceAll.bind(find);
        find.replaceAll = function replaceAll() {
            const oldSelections = editor.getSelections() ? [...editor.getSelections()] : [];
            const oldSearchScope = find._state.searchScope;
            const oldGetFindScope = find._model._decorations.getFindScope;
            if (!oldSearchScope) {
                // Make up a new replacement scope
                const model = editor.getModel();
                const maxLine = model.getLineCount() - 1;
                const lastLineCol = model.getLineContent(Math.max(maxLine, 1)).length + 1;
                const scope = {
                    endColumn: lastLineCol,
                    endLineNumber: maxLine,
                    positionColumn: 1,
                    positionLineNumber: 2,
                    selectionStartColumn: lastLineCol,
                    selectionStartLineNumber: maxLine,
                    startColumn: 1,
                    startLineNumber: 2
                };
                find._state.change({
                    searchScope: {
                        ...scope
                    }
                }, true);
                editor.setSelection(scope);
                find._model._decorations.getFindScope = (function getFindScope() {
                    return scope;
                });
            }

            oldReplaceAll();

            // Bring the previous editor state back
            find._model._decorations.getFindScope = oldGetFindScope;
            editor.setSelections(oldSelections);
            find._state.change({
                searchScope: oldSearchScope
            }, true);
            find._widget._updateSearchScope();
            restrictSelections();
        };

        // Clamp selections so they can't select wrapping lines
        editor.onDidChangeCursorSelection(function onChangeCursorSelection(evt) {
            const selections = [evt.selection, ...evt.secondarySelections];
            restrictSelections(selections);
        });

        const model = editor.getModel();
        const lastLine = model.getLineCount();
        editor.setHiddenAreas([{
            startLineNumber: 1,
            endLineNumber: 1
        }, {
            startLineNumber: lastLine,
            endLineNumber: lastLine
        }]);
    };

    const themeMappings = {
        Day: 'tomorrow',
        Night: 'ambiance',
        Horizon: 'horizon',
        SpringStream: 'spring',
        LucasDracula: 'lucasdracula',
        default: 'tomorrow'
    };
    const glob = require('./data/node_requires/glob');
    glob.codeEditorThemeMappings = themeMappings;
    window.signals.on('UIThemeChanged', theme => {
        monaco.editor.setTheme(themeMappings[theme] ? themeMappings[theme] : themeMappings.default);
    });
    window.signals.on('codeFontUpdated', () => {
        const editorWrappers = document.querySelectorAll('.aCodeEditor');
        for (const editorWrap of editorWrappers) {
            editorWrap.codeEditor.updateOptions({
                fontLigatures: localStorage.codeLigatures !== 'off',
                lineHeight: (localStorage.codeDense === 'off' ? 1.75 : 1.5) * Number(localStorage.fontSize),
                fontSize: Number(localStorage.fontSize)
            });
        }
    });

    var defaultOptions = {
        language: 'plain_text',
        fixedOverflowWidgets: true,
        colorDecorators: true,

        scrollbar: {
            verticalHasArrows: true,
            horizontalHasArrows: true,
            arrowSize: 24
        },

        get fontFamily() {
            return localStorage.fontFamily || 'Iosevka, monospace';
        },
        get theme() {
            return themeMappings[localStorage.UItheme] ?
                themeMappings[localStorage.UItheme] :
                themeMappings.default;
        },
        get fontLigatures() {
            return localStorage.codeLigatures !== 'off';
        },
        get lineHeight() {
            return (localStorage.codeDense === 'off' ? 1.75 : 1.5) * Number(localStorage.fontSize);
        },
        get fontSize() {
            return Number(localStorage.fontSize);
        }
    };

    /**
     * Mounts a Monaco editor on the passed tag.
     *
     * @global
     * @param {HTMLTextareaElement|HTMLDivElement} tag A tag where an editor should be placed.
     * It can be a textarea or any other block.
     * @param {Object} [options] Options
     * @param {String} [options.mode='plain_text'] Language mode. Sets syntacs highlighting
     * and enables language checks, if relevant.
     * Can be 'plain_text', 'markdown', 'javascript', 'html' or 'css'
     * @returns {any} Editor instance
     */
    window.setupCodeEditor = (textarea, options) => {
        const opts = extend(extend({}, defaultOptions), options);
        opts.value = opts.value || textarea.value || '';
        opts.value = opts.value.replace(/\r\n/g, '\n');
        if (opts.wrapper) {
            opts.value = `${opts.wrapper[0]}\n${opts.value}\n${opts.wrapper[1]}`;
            opts.lineNumbers = num => Math.max((num || 0) - 1, 1);
        }
        const codeEditor = monaco.editor.create(textarea, opts);
        textarea.codeEditor = codeEditor;
        // eslint-disable-next-line id-blacklist
        codeEditor.tag = textarea;
        textarea.classList.add(themeMappings[localStorage.UItheme] ?
            themeMappings[localStorage.UItheme] :
            themeMappings.default);

        codeEditor.getModel()._options.defaultEOL = monaco.editor.DefaultEndOfLine.LF;

        codeEditor.getPureValue = function getPureValue() {
            const val = this.getValue();
            const start = opts.wrapper[0] + '\n',
                  end = '\n' + opts.wrapper[1];
            if (options.wrapper) {
                if (val.indexOf(start) === 0 &&
                    val.lastIndexOf(end) === (val.length - end.length)
                ) {
                    return val.slice((start).length, -end.length);
                }
            }
            return val;
        };

        if (opts.lockWrapper) {
            setUpWrappers(codeEditor);
        }
        extendHotkeys(codeEditor);

        return codeEditor;
    };
})(this);
