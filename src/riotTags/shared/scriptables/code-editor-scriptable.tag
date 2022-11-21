//
    @attribute entitytype (EventApplicableEntities)
        The asset type that is being added
    @attribute event (IScriptableEvent)
        The event to edit.

    @attribute [onchanged] (Riot function)
        The function is called whenever there was a change in the code.
        No arguments are passed as the [event] attribute is edited directly.

code-editor-scriptable.relative.wide.tall.flexcol
    .relative.tall.wide(ref="codebox")
    .code-editor-scriptable-aProblemPanel.flexrow.nogrow(if="{problem}")
        .nogrow
            svg.feather.warning
                use(xlink:href="#alert-circle")
        pre.nm {problem.stack.slice(8)}
        .nogrow
            button.inline(onclick="{jumpToProblem}")
                svg.feather
                    use(xlink:href="#chevron-up")
                | {voc.jumpToProblem}
    script.
        this.namespace = 'scriptables';
        this.mixin(window.riotVoc);

        const eventsAPI = require('./data/node_requires/events');
        this.language = window.currentProject.language || 'typescript';
        this.allEvents = eventsAPI.events;

        const coffeescript = require('coffeescript');
        const checkProblemsDebounced = window.debounce(() => {
            if (!this.codeEditor || this.language !== 'coffeescript') {
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

        const refreshLayout = () => {
            setTimeout(() => {
                this.codeEditor.layout();
            }, 0);
        };
        const updateEvent = () => {
            if (this.currentEvent) {
                this.codeEditor.updateOptions({
                    readOnly: false
                });
                this.codeEditor.setValue(this.currentEvent.code);
                const eventDeclaration = eventsAPI.getEventByLib(
                    this.currentEvent.eventKey,
                    this.currentEvent.lib
                );
                const varsDeclaration = eventsAPI.getArgumentsTypeScript(eventDeclaration);
                const ctEntity = this.opts.entitytype === 'template' ? 'Copy' : 'Room';
                const codePrefix = `function ctJsEvent(this: ${ctEntity}) {${varsDeclaration}`;
                if (this.language === 'typescript') {
                    this.codeEditor.setWrapperCode(codePrefix, '}');
                }
                this.codeEditor.getModel().ctCodePrefix = codePrefix;
            } else {
                this.codeEditor.updateOptions({
                    readOnly: true
                });
                if (this.language === 'typescript') {
                    this.codeEditor.setValue(`// ${this.voc.createEventHint}`);
                } else if (this.language === 'coffeescript') {
                    this.codeEditor.setValue(`# ${this.voc.createEventHint}`);
                } else {
                    // eslint-disable-next-line no-console
                    console.warning(`Unknown language used in a code-editor-scriptable: ${this.language}. This is most likely an error.`);
                    this.codeEditor.setValue(this.voc.createEventHint);
                }
            }
            checkProblemsDebounced();
        };

        this.on('mount', () => {
            var editorOptions = {
                language: this.language,
                lockWrapper: this.language === 'typescript'
            };
            setTimeout(() => {
                this.codeEditor = window.setupCodeEditor(
                    this.refs.codebox,
                    Object.assign({}, editorOptions, {
                        value: '',
                        wrapper: (this.language === 'typescript') ? [' ', ' '] : void 0
                    })
                );
                updateEvent();
                this.codeEditor.onDidChangeModelContent(() => {
                    if (this.currentEvent) {
                        this.currentEvent.code = this.codeEditor.getPureValue();
                    }
                    checkProblemsDebounced();
                });
                this.codeEditor.focus();
                checkProblemsDebounced();
                window.addEventListener('resize', refreshLayout);
            }, 0);
        });
        const layout = () => {
            setTimeout(() => {
                this.codeEditor.layout();
            }, 150);
        };
        window.orders.on('forceCodeEditorLayout', layout);
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            this.codeEditor.dispose();
            window.removeEventListener('resize', refreshLayout);
            window.orders.off('forceCodeEditorLayout', layout);
        });

        this.currentEvent = this.opts.event;
        this.on('update', () => {
            if (this.currentEvent !== this.opts.event) {
                this.currentEvent = this.opts.event;
                updateEvent();
            }
        });

        this.jumpToProblem = () => {
            this.codeEditor.setPosition({
                lineNumber: this.problem.location.last_line + 1,
                column: this.problem.location.last_column + 1
            });
            this.codeEditor.focus();
        };
