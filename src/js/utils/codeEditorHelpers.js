/* eslint-disable id-blacklist */
/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
(function codeEditorHelpers() {
    const {extend} = require('src/node_requires/objectUtils');
    const fs = require('/src/node_requires/neutralino-fs-extra');
    const path = require('path');

    window.signals = window.signals || riot.observable({});
    // eslint-disable-next-line max-lines-per-function
    window.signals.on('monacoBooted', async () => {
        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true,
            target: 'ES2020',
            downlevelIteration: true,
            alwaysStrict: true
        });
        monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true,
            target: 'ES2020',
            downlevelIteration: true,
            alwaysStrict: true
        });

        // Disable the built-in hover provider
        const ts = monaco.languages.typescript;
        const globalsPromise = fs.readFile(path.join(__dirname, './data/typedefs/global.d.ts'), {
            encoding: 'utf-8'
        });
        const ctDtsPromise = fs.readFile(path.join(__dirname, './data/typedefs/ct.d.ts'), {
            encoding: 'utf-8'
        });
        const pixiDtsPromise = fs.readFile(path.join(__dirname, './data/typedefs/pixi.d.ts'), {
            encoding: 'utf-8'
        });
        const [ctDts, pixiDts, globalsDts] = await Promise.all([
            ctDtsPromise,
            pixiDtsPromise,
            globalsPromise
        ]);

        // Republish pixi.js and ct.js objects in global space
        const exposePixiModule = `
        declare module 'pixi.js' {
            export * from 'bundles/pixi.js/src/index';
        }`;

        const {baseClassToTS} = require('src/node_requires/resources/templates');
        const baseClassesImports = `
        import {${Object.values(baseClassToTS).map(bc => `${bc} as ${bc}Temp`)
                                              .join(', ')}} from 'src/ct.release/templateBaseClasses/index';
        `;
        const baseClassesGlobals = Object.values(baseClassToTS)
            .map(bc => `type ${bc} = ${bc}Temp;`)
            .join('\n');

        const exposeCtJsModules = `
        import * as pixiTemp from 'bundles/pixi.js/src/index';
        import {actionsLib as actionsTemp, inputsLib as inputsTemp} from 'src/ct.release/inputs';
        import backgroundsTemp from 'src/ct.release/backgrounds';
        import Camera from 'src/ct.release/camera';
        import contentTemp from 'src/ct.release/content';
        import emittersTemp from 'src/ct.release/emitters';
        import resTemp from 'src/ct.release/res';
        import roomsTemp, {Room as roomClass} from 'src/ct.release/rooms';
        import {scriptsLib as scriptsTemp} from 'src/ct.release/scripts';
        import soundsTemp from 'src/ct.release/sounds';
        import stylesTemp from 'src/ct.release/styles';
        import templatesTemp, {BasicCopy as BasicCopyTemp} from 'src/ct.release/templates';
        ${baseClassesImports}
        import tilemapsTemp from 'src/ct.release/tilemaps';
        import timerTemp from 'src/ct.release/timer';
        import uTemp from 'src/ct.release/u';
        import behaviorsTemp from 'src/ct.release/behaviors';
        import {meta as metaTemp, settings as settingsTemp, pixiApp as pixiAppTemp} from 'src/ct.release/index';
        declare global {
            var PIXI: typeof pixiTemp;
            type Room = roomClass;
            var actions: typeof actionsTemp;
            var backgrounds: typeof backgroundsTemp;
            var behaviors: typeof behaviorsTemp;
            var camera: typeof Camera;
            var content: typeof contentTemp;
            var emitters: typeof emittersTemp;
            var inputs: typeof inputsTemp;
            var meta: typeof metaTemp;
            var res: typeof resTemp;
            var rooms: typeof roomsTemp;
            var scripts: typeof scriptsTemp;
            var settings: typeof settingsTemp;
            var sounds: typeof soundsTemp;
            var styles: typeof stylesTemp;
            var templates: typeof templatesTemp;
            var tilemaps: typeof tilemapsTemp;
            var timer: typeof timerTemp;
            var u: typeof uTemp;

            type BasicCopy = BasicCopyTemp;
            ${baseClassesGlobals}

            var pixiApp: typeof pixiAppTemp;
        }`;
        ts.javascriptDefaults.addExtraLib(ctDts, monaco.Uri.parse('file:///ctjs.d.ts'));
        ts.typescriptDefaults.addExtraLib(ctDts, monaco.Uri.parse('file:///ctjs.d.ts'));
        ts.javascriptDefaults.addExtraLib(pixiDts, monaco.Uri.parse('file:///pixi.ts'));
        ts.typescriptDefaults.addExtraLib(pixiDts, monaco.Uri.parse('file:///pixi.ts'));
        ts.javascriptDefaults.addExtraLib(exposePixiModule, monaco.Uri.parse('file:///piximodule.d.ts'));
        ts.typescriptDefaults.addExtraLib(exposePixiModule, monaco.Uri.parse('file:///piximodule.d.ts'));
        ts.javascriptDefaults.addExtraLib(exposeCtJsModules, monaco.Uri.parse('file:///ctjsModules.d.ts'));
        ts.typescriptDefaults.addExtraLib(exposeCtJsModules, monaco.Uri.parse('file:///ctjsModules.d.ts'));
        ts.javascriptDefaults.addExtraLib(globalsDts, monaco.Uri.parse('file:///globals.d.ts'));
        ts.typescriptDefaults.addExtraLib(globalsDts, monaco.Uri.parse('file:///globals.d.ts'));
    });

    /**
     * Adds custom hotkeys to the editors, specifically Ctrl+Plus,
     * Ctrl+Minus for font size manipulation.
     * @param {any} editor The editor to which to add hotkeys
     * @returns {void}
     */
    var extendHotkeys = (editor) => {
        const zoomInCombo = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal;
        editor.addCommand(zoomInCombo, function monacoZoomIn() {
            var num = Number(localStorage.fontSize);
            if (num < 48) {
                num++;
                localStorage.fontSize = num;
                window.signals.trigger('codeFontUpdated');
            }
            return false;
        });
        const zoomOutCombo = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus;
        editor.addCommand(zoomOutCombo, function monacoZoomOut() {
            var num = Number(localStorage.fontSize);
            if (num > 6) {
                num--;
                localStorage.fontSize = num;
                window.signals.trigger('codeFontUpdated');
            }
            return false;
        });

        // Make certain hotkeys bubble up to ct.IDE instead of being consumed by monaco-editor.
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            const event = new KeyboardEvent('keydown', {
                key: 'S',
                code: 'KeyS',
                ctrlKey: true
            });
            document.body.dispatchEvent(event);
        });
        editor.addCommand(monaco.KeyCode.F5, () => {
            const event = new KeyboardEvent('keydown', {
                key: 'F5',
                code: 'F5'
            });
            document.body.dispatchEvent(event);
        });
        editor.addCommand(monaco.KeyCode.F5 | monaco.KeyMod.Alt, () => {
            const event = new KeyboardEvent('keydown', {
                key: 'F5',
                code: 'F5',
                altKey: true
            });
            document.body.dispatchEvent(event);
        });
        editor.addCommand(monaco.KeyCode.KeyP | monaco.KeyMod.CtrlCmd, () => {
            const event = new KeyboardEvent('keydown', {
                key: 'p',
                code: 'p',
                ctrlKey: true
            });
            document.body.dispatchEvent(event);
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
        editor.setHiddenAreas([]);
        editor.setHiddenAreas([{
            startLineNumber: 1,
            endLineNumber: 1
        }, {
            startLineNumber: lastLine,
            endLineNumber: lastLine
        }]);
    };

    // When any of the code editor settings are changed,
    // find all monaco instances and update their display settings
    window.signals.on('codeFontUpdated', () => {
        const editors = document.querySelectorAll('.monaco-editor');
        for (const editor of editors) {
            editor.parentElement.codeEditor.updateOptions({
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
            return localStorage.UItheme || 'Day';
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

        monaco.editor.remeasureFonts();

        opts.value = opts.value || textarea.value || '';
        opts.value = opts.value.replace(/\r\n/g, '\n');
        let wrapStart, wrapEnd;
        if (opts.wrapper) {
            [wrapStart, wrapEnd] = opts.wrapper;
            opts.value = `${wrapStart}\n${opts.value}\n${wrapEnd}`;
            opts.lineNumbers = num => (num > 1 ? num - 1 : 1);
        } else {
            wrapStart = wrapEnd = '';
        }
        const codeEditor = monaco.editor.create(textarea, opts);
        textarea.codeEditor = codeEditor;
        // eslint-disable-next-line id-blacklist
        codeEditor.tag = textarea;
        textarea.classList.add(localStorage.UItheme || 'Day');

        codeEditor.getModel()._options.defaultEOL = monaco.editor.DefaultEndOfLine.LF;

        codeEditor.getPureValue = function getPureValue() {
            const val = this.getValue();
            const start = wrapStart + '\n',
                  end = '\n' + wrapEnd;
            if (opts.wrapper) {
                if (val.indexOf(start) === 0 &&
                    val.lastIndexOf(end) === (val.length - end.length)
                ) {
                    return val.slice((start).length, -end.length);
                }
            }
            return val;
        };
        codeEditor.setWrapperCode = function setWrapperCode(start, end) {
            const oldVal = this.getValue();
            wrapStart = start;
            wrapEnd = end;
            if (options.wrapper) {
                if (oldVal.indexOf(start) === 0 &&
                    oldVal.lastIndexOf(end) === (oldVal.length - end.length)
                ) {
                    this.setValue(`${wrapStart}\n${oldVal.slice((start).length, -end.length)}\n${wrapEnd}`);
                } else {
                    this.setValue(`${wrapStart}\n${oldVal}\n${wrapEnd}`);
                }
            }
            const model = codeEditor.getModel();
            const lastLine = model.getLineCount();
            codeEditor.setHiddenAreas([]);
            codeEditor.setHiddenAreas([{
                startLineNumber: 1,
                endLineNumber: 1
            }, {
                startLineNumber: lastLine,
                endLineNumber: lastLine
            }]);
            codeEditor.setSelection({
                startColumn: 0,
                endColumn: 0,
                startLineNumber: 2,
                endLineNumber: 2
            });
        };

        if (opts.lockWrapper) {
            setUpWrappers(codeEditor);
        }
        extendHotkeys(codeEditor);

        return codeEditor;
    };
})();
