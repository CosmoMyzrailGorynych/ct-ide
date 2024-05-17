//
    @attribute entitytype (EventApplicableEntities)
        The asset type that is being added
    @attribute event (IScriptableEvent)
        The event to edit.
    @attribute asset (IScriptable)
        The edited asset.
    @attribute [onchanged] (Riot function)
        The function is called whenever there was a change in the code.
        No arguments are passed as the [event] attribute is edited directly.

code-editor-scriptable.relative.wide.tall.flexcol
    catnip-editor(
        if="{window.currentProject.language === 'catnip'}"
        event="{opts.event}" asset="{opts.asset}"
    )
    .relative.tall.wide(ref="codebox" if="{window.currentProject.language !== 'catnip'}")
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
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        const eventsAPI = require('src/node_requires/events');
        const {baseClassToTS} = require('src/node_requires/resources/templates');
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
            if (this.language === 'catnip') {
                return;
            }
            setTimeout(() => {
                this.codeEditor.layout();
            }, 0);
        };

        const {baseTypes} = eventsAPI;
        const updateEvent = () => {
            if (this.language === 'catnip') {
                return;
            }
            if (this.currentEvent) {
                this.codeEditor.updateOptions({
                    readOnly: false
                });
                this.codeEditor.setValue(this.currentEvent.code);
                const eventDeclaration = eventsAPI.getEventByLib(
                    this.currentEvent.eventKey,
                    this.currentEvent.lib
                );
                const varsDeclaration = eventDeclaration ?
                    eventsAPI.getArgumentsTypeScript(eventDeclaration) :
                    '';
                let ctEntity;
                if (this.opts.asset.type === 'behavior') {
                    ctEntity = this.opts.asset.behaviorType === 'template' ?
                        'BasicCopy' :
                        '(typeof Room)[\'prototype\']';
                } else if (this.opts.asset.type === 'room') {
                    ctEntity = '(typeof Room)[\'prototype\']';
                } else { // template, use the base class
                    ctEntity = baseClassToTS[this.opts.asset.baseClass];
                }
                const fields = eventsAPI.getFieldsTypeScript(this.opts.asset);
                const codePrefix = `${baseTypes} function ctJsEvent(this: ${ctEntity}${fields}) {${varsDeclaration}`;
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
        const checkForTypedefChanges = assetId => {
            if (this.language === 'catnip') {
                return;
            }
            if (this.opts.asset.uid === assetId ||
                (this.opts.asset.behaviors && this.opts.asset?.behaviors.find(id => id === assetId))
            ) {
                updateEvent();
            }
        };
        window.signals.on('typedefsChanged', checkForTypedefChanges);
        this.on('unmount', () => {
            window.signals.off('typedefsChanged', checkForTypedefChanges);
        });

        this.on('mount', () => {
            if (this.language === 'catnip') {
                return;
            }
            var editorOptions = {
                language: this.language,
                lockWrapper: this.language === 'typescript'
            };
            setTimeout(() => {
                this.codeEditor = window.setupCodeEditor(
                    this.refs.codebox,
                    Object.assign({}, editorOptions, {
                        value: '',
                        wrapper: (this.language === 'typescript') ? ['{', '}'] : void 0
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
            if (this.language === 'catnip') {
                return;
            }
            setTimeout(() => {
                this.codeEditor.layout();
            }, 150);
        };
        window.orders.on('forceCodeEditorLayout', layout);
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            if (this.language !== 'catnip') {
                this.codeEditor.dispose();
            }
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
