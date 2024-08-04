//
    @attribute room (IRoom)
    @attribute onsave (riot function)

room-events-editor.aDimmer.relative.pad.fadein(onclick="{tryClose}")
    .aModal.flexrow.pad.appear
        .tall.flexfix.aPanel.pad.room-events-editor-Properties.nogrow
            .flexfix-body
                event-list-scriptable.tall(
                    events="{room.events}"
                    entitytype="room"
                    onchanged="{changeCodeTab}"
                    currentevent="{currentSheet}"
                )
            .flexfix-footer
                .aSpacer
                button.wide(onclick="{roomSaveEvents}" title="Shift+Control+S" data-hotkey="Shift+Control+S")
                    svg.feather
                        use(xlink:href="#check")
                    span {voc.done}
        .tabwrap.tall(style="position: relative")
            code-editor-scriptable(event="{currentSheet}" asset="{opts.room}" ref="codeeditor")
    script.
        this.namespace = 'roomView';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.room = this.opts.room;
        [this.currentSheet] = this.room.events; // can be undefined, this is ok
        this.tab = 'javascript';
        this.changeTab = tab => () => {
            this.tab = tab;
        };

        this.focusEditor = (tab) => {
            if (tab?.uid === this.room.uid) {
                this.refs.codeeditor.codeEditor.focus();
            }
        };
        window.signals.on('globalTabChanged', this.focusEditor);
        this.on('unmount', () => {
            window.signals.off('globalTabChanged', this.focusEditor);
        });

        this.changeCodeTab = scriptableEvent => {
            this.currentSheet = scriptableEvent;
            this.update();
        };

        this.tryClose = e => {
            if (e.target === this.root) {
                this.roomSaveEvents();
            }
        };
        this.roomSaveEvents = () => {
            this.opts.onsave();
        };
