//
    @attribute entitytype (EventApplicableEntities)
        The asset type that is being added
    @attribute event (IScriptableEvent)
        The event to edit.

    @attribute [onchanged] (Riot function)
        The function is called whenever there was a change in the code.
        No arguments are passed as the [event] attribute is edited directly.

code-editor-scriptable.aCodeEditor
    script.
        this.namespace = 'scriptables';
        this.mixin(window.riotVoc);

        const eventsAPI = require('./data/node_requires/events');
        this.allEvents = eventsAPI.events;

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
                this.codeEditor.setWrapperCode(codePrefix, '}');
            } else {
                this.codeEditor.updateOptions({
                    readOnly: true
                });
                this.codeEditor.setValue(`// ${this.voc.createEventHint}`);
            }
        };

        this.on('mount', () => {
            var editorOptions = {
                language: 'typescript',
                lockWrapper: true
            };
            setTimeout(() => {
                this.codeEditor = window.setupCodeEditor(
                    this.root,
                    Object.assign({}, editorOptions, {
                        value: '',
                        wrapper: [' ', ' ']
                    })
                );
                updateEvent();
                this.codeEditor.onDidChangeModelContent(() => {
                    if (this.currentEvent) {
                        this.currentEvent.code = this.codeEditor.getPureValue();
                    }
                });
                this.codeEditor.focus();
                window.addEventListener('resize', refreshLayout);
            }, 0);
        });
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            this.codeEditor.dispose();
            window.removeEventListener('resize', refreshLayout);
        });

        this.currentEvent = this.opts.event;
        this.on('update', () => {
            if (this.currentEvent !== this.opts.event) {
                this.currentEvent = this.opts.event;
                updateEvent();
            }
        });
