//
    Displays a list of arguments of an event and lets a user edit its values.
    Works as a modal window.

    @argument event (IScriptableEvent)
        The event which argument list should be edited

    @argument onapplied (riot function)
        A callback that is called with no arguments when the arguments are applied

    @method toggle
    @method open
    @method close

argument-editor-scriptable
    .aDimmer.pad.fadein(if="{opened}")
        .aModal.pad.npb.cursordefault.appear.flexfix
            .flexfix-header
                h1 {localizeProp(eventFullName, 'name')}
                .aSpacer
            .flexfix-body
                div(if="{!eventSpec}") An error occured :c is it an invalid event?
                table.aPaddedTable.wide(if="{eventSpec}")
                    tr(each="{arg, key in eventSpec.arguments}")
                        td
                            b {parent.localizeArgument(eventFullName, key)}
                        td
                            action-input(
                                if="{arg.type === 'action'}"
                                compact="true"
                                actionname="{parent.opts.event.arguments[key]}"
                                onchanged="{writeValueAndUpdate(key)}"
                            )
                            asset-input(
                                if="{['template', 'room', 'sound', 'tandem', 'font', 'style', 'texture'].indexOf(arg.type) !== -1}"
                                assettypes="{arg.type}"
                                assetid="{parent.opts.event.arguments[key]}"
                                compact="true"
                                disallowjump="true"
                                onchanged="{writeValueAndUpdate(key)}"
                            )
                            label.checkbox(if="{arg.type === 'boolean'}")
                                input(
                                    type="checkbox"
                                    checked="{parent.opts.event.arguments[key] === void 0 ? eventSpec.arguments[key].default : parent.opts.event.arguments[key]}"
                                    onchange="{writeFromInput(key)}"
                                )
                                code.inline {String(parent.opts.event.arguments[key])}
                            input(
                                if="{arg.type === 'string'}"
                                type="text"
                                value="{parent.opts.event.arguments[key] || eventSpec.arguments[key].default || ''}"
                                onchange="{writeFromInput(key)}"
                            )
                            input(
                                if="{arg.type === 'integer'}"
                                type="number"
                                value="{parent.opts.event.arguments[key] || eventSpec.arguments[key].default || 0}"
                                onchange="{writeFromInput(key)}"
                                pattern="[0-9]+"
                                step="1"
                            )
                            input(
                                if="{arg.type === 'float'}"
                                type="number"
                                value="{parent.opts.event.arguments[key] || eventSpec.arguments[key].default || 0}"
                                onchange="{writeFromInput(key)}"
                                step="0.1"
                            )
            .flexfix-footer.inset.flexrow
                button.nogrow(onclick="{cancelArgs}")
                    svg.feather
                        use(xlink:href="#x")
                    span {vocGlob.cancel}
                .aSpacer
                button.nmr.nogrow(onclick="{applyArgs}")
                    svg.feather
                        use(xlink:href="#check")
                    span {vocGlob.apply}
    script.
        const eventsAPI = require('./data/node_requires/events');

        this.localizeArgument = eventsAPI.localizeArgument;
        this.localizeProp = eventsAPI.localizeProp;

        this.allEvents = eventsAPI.events;
        this.getEventByLib = eventsAPI.getEventByLib;

        this.namespace = 'scriptables';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.opened = false;

        this.writeValue = eventKey => value => {
            this.opts.event.arguments[eventKey] = value;
        };
        this.writeValueAndUpdate = eventKey => value => {
            this.opts.event.arguments[eventKey] = value;
            this.update();
        };
        this.writeFromInput = eventKey => e => {
            if (e.target.type === 'checkbox') {
                this.opts.event.arguments[eventKey] = e.target.checked;
            } else {
                this.opts.event.arguments[eventKey] = e.target.value;
            }
        };

        this.cancelArgs = () => {
            this.opts.event.arguments = JSON.parse(this.oldValues);
            this.close();
        };
        this.applyArgs = () => {
            if (this.opts.onapplied) {
                this.opts.onapplied();
            }
            this.close();
        };

        this.close = () => {
            this.opened = false;
            this.update();
        };
        this.open = () => {
            this.opened = true;
            this.eventFullName = `${this.opts.event.lib}_${this.opts.event.eventKey}`;
            this.eventSpec = eventsAPI.getEventByLib(this.opts.event.eventKey, this.opts.event.lib);
            this.oldValues = JSON.stringify(this.opts.event.arguments || {});
            this.update();
        };
        this.toggle = () => {
            if (this.opened) {
                this.close();
            } else {
                this.open();
            }
        };
