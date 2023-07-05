//
    @attribute room (IRoom)
    @attribute onsave (riot function)
room-events-editor.aView.flexrow.pad
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
        code-editor-scriptable(event="{currentSheet}" entitytype="room" ref="codeeditor")
        //ul.tabs.aNav.nogrow.noshrink
        //    li(onclick="{changeTab('javascript')}" class="{active: tab === 'javascript'}" title="JavaScript (Control+Q)" data-hotkey="Control+q")
        //        svg.feather
        //            use(xlink:href="#code")
        //        span {voc.create}
        //    li(onclick="{changeTab('blocks')}" class="{active: tab === 'blocks'}" title="Blurry (Control+W)" data-hotkey="Control+w")
        //        svg.feather
        //            use(xlink:href="#grid")
        //        span {voc.step}
    script.
        this.namespace = 'roomView';
        this.mixin(window.riotVoc);

        this.room = this.opts.room;
        [this.currentSheet] = this.room.events; // can be undefined, this is ok
        this.tab = 'javascript';
        this.changeTab = tab => () => {
            this.tab = tab;
        };

        this.focusEditor = () => {
            this.refs.codeeditor.codeEditor.focus();
        };
        window.signals.on('roomsFocus', this.focusEditor);
        this.on('unmount', () => {
            window.signals.off('roomsFocus', this.focusEditor);
        });

        this.changeCodeTab = scriptableEvent => {
            this.currentSheet = scriptableEvent;
            this.update();
        };

        this.roomSaveEvents = () => {
            this.opts.onsave();
        };
