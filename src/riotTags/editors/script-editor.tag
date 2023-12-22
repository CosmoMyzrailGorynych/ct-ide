script-editor.aPanel.aView.flexfix
    .script-editor-aCodeEditor.flexfix-body.relative.pad
        .tabwrap.tall(style="position: relative")
            .relative.tall.wide(ref="codebox")
    .flexfix-footer.pad.npt
        .script-editor-aProblemPanel.wide.flexrow(if="{problem}")
            .nogrow
                svg.feather.warning
                    use(xlink:href="#alert-circle")
            pre.nm {problem.stack.slice(8)}
            .nogrow
                button.inline(onclick="{jumpToProblem}")
                    svg.feather
                        use(xlink:href="#chevron-up")
                    | {vocFull.scriptables.jumpToProblem}
    .flexfix-footer.flexrow.pad.npt
        label.block.checkbox.nogrow.alignmiddle
            input(type="checkbox" checked="{asset.runAutomatically}" onchange="{wire('asset.runAutomatically')}")
            span {voc.runAutomatically}
        .aSpacer.noshrink.nogrow
        label.block.nogrow.alignmiddle
            span {voc.language}
            select(value="{asset.language}" onchange="{changeLanguage}")
                option(value="typescript") TypeScript / JavaScript
                option(value="coffeescript") CoffeeScript
        .aSpacer.noshrink
        button(onclick="{convertCoffee}" if="{asset.language === 'coffeescript'}" disabled="{problem ? 'disabled' : ''}")
            svg.icon
                use(xlink:href="#javascript")
            span {voc.convertToJavaScript}
        .aSpacer.nogrow.noshrink
        button(onclick="{scriptSave}" title="Shift+Control+S" data-hotkey="Shift+Control+S")
            svg.feather
                use(xlink:href="#check")
            span {vocGlob.apply}
    script.
        this.namespace = 'scriptView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        const eventsAPI = require('./data/node_requires/events');
        const {baseTypes} = eventsAPI;

        this.saveAsset = () => {
            this.writeChanges();
            return true;
        };
        this.scriptSave = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };

        const coffeescript = require('coffeescript');
        const checkProblemsDebounced = window.debounce(() => {
            if (!this.codeEditor || this.asset.language !== 'coffeescript') {
                return;
            }
            const oldProblem = this.problem;
            try {
                coffeescript.compile(this.codeEditor.getValue(), {
                    bare: true,
                    sourcemaps: false
                });
                this.problem = false;
            } catch (err) {
                this.problem = err;
            }
            if (oldProblem !== this.problem) {
                this.update();
                this.codeEditor.layout();
            }
        }, 750);

        let prevLanguage = this.asset.language;
        const updateEditor = () => {
            this.codeEditor.updateOptions({
                readOnly: false
            });
            if (prevLanguage !== this.asset.language) {
                monaco.editor.setModelLanguage(this.codeEditor.getModel(), this.asset.language);
                prevLanguage = this.asset.language;
            }
            const codePrefix = `${baseTypes} function ctJsScript(options: Record<string, any>) {`;
            this.codeEditor.setValue(this.asset.code);
            if (this.asset.language === 'typescript') {
                this.codeEditor.setWrapperCode(codePrefix, '}');
            } else {
                this.codeEditor.setWrapperCode(' ', ' ');
            }
            this.codeEditor.getModel().ctCodePrefix = codePrefix;
        };

        this.changeLanguage = e => {
            const newLang = e.target.value;
            this.asset.language = newLang;
            updateEditor();
        };

        const layout = () => {
            setTimeout(() => {
                this.codeEditor.layout();
            }, 150);
        };
        this.on('mount', () => {
            const editorOptions = {
                language: this.asset.language
            };
            setTimeout(() => {
                this.codeEditor = window.setupCodeEditor(
                    this.refs.codebox,
                    Object.assign({}, editorOptions, {
                        value: '',
                        wrapper: [' ', ' ']
                    })
                );
                updateEditor();
                this.codeEditor.onDidChangeModelContent(() => {
                    if (this.asset) {
                        this.asset.code = this.codeEditor.getPureValue();
                    }
                    checkProblemsDebounced();
                });
                this.codeEditor.focus();
                checkProblemsDebounced();
                window.addEventListener('resize', layout);
            }, 0);
        });
        window.orders.on('forceCodeEditorLayout', layout);
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            this.codeEditor.dispose();
            window.removeEventListener('resize', layout);
            window.orders.off('forceCodeEditorLayout', layout);
        });

        this.jumpToProblem = () => {
            this.codeEditor.setPosition({
                lineNumber: this.problem.location.last_line + 1,
                column: this.problem.location.last_column + 1
            });
            this.codeEditor.focus();
        };

        this.convertCoffee = () => {
            try {
                const val = coffeescript.compile(this.codeEditor.getValue(), {
                    bare: true,
                    sourcemaps: false
                });
                this.problem = false;
                this.asset.code = val;
                this.asset.language = 'typescript';
                updateEditor();
            } catch (err) {
                this.problem = err;
            }
        };

