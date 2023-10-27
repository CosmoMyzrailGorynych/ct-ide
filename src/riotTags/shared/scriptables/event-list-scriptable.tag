//
    A tag that displays an editable event list and responds when a user selects a particular event.
    Type definitions for attributes described here are placed in node_requires/events folder
    and resources/IScriptable interface.

    @attribute events (IScriptableEvent[])
        The event list that is currently in the edited entity.
        This array is modified to add new events, edit existing ones.
    @attribute entitytype (EventApplicableEntities)
        The asset type that is being added
    @attribute [currentevent] (IScriptableEvent)
        Currently selected event.
        Defaults to the first event in the `events` attributes.

    @attribute [warnbehaviors] (atomic)
        If set, will show warning icons for events that make behaviors static.

    @attribute onchanged (Riot function)
        A callback that is called whenever a new event was picked.
        It can happen as a direct response to a user input, or can happen,
        for example, when the previously selected event was deleted.

        The callback is passed the newly selected event (IScriptableEvent).

event-list-scriptable.flexfix(class="{opts.class}")
    .flexfix-body
        ui.aMenu
            li.flexrow(
                each="{event in opts.events}"
                class="{active: currentEvent === event}"
                onclick="{pickEvent}"
                title="{localizeField(getEventByLib(event.eventKey, event.lib), 'hint')}"
            )
                svg.feather.act.nogrow.noshrink(if="{!getIsParametrized(event) || !getIcon(event)}")
                    use(xlink:href="#{getEventByLib(event.eventKey, event.lib).icon}")
                img.icon.nogrow.noshrink(if="{getIsParametrized(event) && getIcon(event)}" src="{getIcon(event)}")
                span.nogrow.crop(title="{localizeName(event)}") {localizeName(event)}
                div.noshrink.nogrow(
                    if="{parent.opts.warnbehaviors && isStatic(event)}"
                    title="{voc.staticEventWarning}"
                )
                    svg.feather.warning.anActionableIcon
                        use(xlink:href="#snowflake")
                .aSpacer.noshrink
                svg.feather.anActionableIcon.noshrink.nogrow(
                    if="{getIsParametrized(event)}"
                    onclick="{promptEditEvent(event)}"
                )
                    use(xlink:href="#edit")
                svg.feather.anActionableIcon.noshrink.nogrow(
                    onclick="{promptRemoveEvent(event)}"
                )
                    use(xlink:href="#trash")
    .flexfix-footer
        .event-list-scriptable-LocalVars(if="{opts.events?.length && getHasLocalVars(currentEvent)}")
            h3 {voc.localEventVars}
            ul.aStripedList.nmt
                li.npl.npr.cursorhelp(
                    each="{var, varName in getLocals(currentEvent)}"
                    title="{getLocalDescription(varName, currentEvent)}"
                ).flexrow
                    .nogrow.noshrink
                        code.inline.nml {varName}
                    .crop
                        code \{{var.type}\}
                        |
                        | {getLocalDescription(varName, currentEvent)}
        .flexrow
            docs-shortcut.nogrow(
                hidelabel="hidelabel"
                path="/ct.templates.html"
                button="true"
                wide="true"
                title="{voc.learnAboutTemplates}"
                if="{opts.entitytype === 'template'}"
            )
            .aSpacer.nogrow(if="{opts.entitytype === 'template'}")
            .relative
                button.nm.wide(onclick="{openEventMenu}")
                    svg.feather
                        use(xlink:href="#plus")
                        span {voc.addEvent}
    modal-menu(menu="{eventsMenu}" ref="eventsMenu" enablesearch="true")
    argument-editor-scriptable(event="{this.currentEvent}" ref="argumentsMenu" onapplied="{onArgumentsApplied}")
    script.
        const eventsAPI = require('./data/node_requires/events');
        this.allEvents = eventsAPI.events;
        this.getEventByLib = eventsAPI.getEventByLib;

        const getFullKey = scriptableEvt => `${scriptableEvt.lib}_${scriptableEvt.eventKey}`;

        this.localizeName = scriptableEvt => {
            if (this.getIsParametrized(scriptableEvt)) {
                return eventsAPI.localizeParametrized(getFullKey(scriptableEvt), scriptableEvt);
            }
            return eventsAPI.localizeProp(getFullKey(scriptableEvt), 'name');
        };
        this.getIcon = scriptableEvt => eventsAPI.tryGetIcon(getFullKey(scriptableEvt), scriptableEvt);
        this.isStatic = scriptableEvt => !eventsAPI
            .canBeDynamicBehavior(eventsAPI.getEventByLib(scriptableEvt.eventKey, scriptableEvt.lib));

        this.namespace = 'scriptables';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.getIsParametrized = scriptableEvt => {
            const event = this.getEventByLib(scriptableEvt.eventKey, scriptableEvt.lib);
            return event.arguments && Object.keys(event.arguments).length;
        };
        this.getHasLocalVars = scriptableEvt => {
            const event = this.getEventByLib(scriptableEvt.eventKey, scriptableEvt.lib);
            return event.locals && Object.keys(event.locals).length;
        };
        this.getLocals = scriptableEvt => this.getEventByLib(
            scriptableEvt.eventKey,
            scriptableEvt.lib
        ).locals;
        this.getLocalDescription = (varName, scriptableEvt) => eventsAPI.localizeLocalVarDesc(
            getFullKey(scriptableEvt),
            varName
        );

        this.addEvent = (affixedData) => {
            const parametrized = affixedData.event.arguments &&
                Object.keys(affixedData.event.arguments).length;
            const {repeatable} = affixedData.event;
            const newEventPath = eventsAPI.splitEventName(affixedData.eventKey);
            if (!repeatable &&
                this.opts.events.find(event => event.eventKey === newEventPath[1] &&
                    event.lib === newEventPath[0])
            ) {
                window.alertify.error(this.voc.eventAlreadyExists);
                return;
            }
            const newEvent = {
                eventKey: newEventPath[1],
                code: '',
                arguments: {},
                lib: newEventPath[0]
            };
            this.opts.events.push(newEvent);
            this.currentEvent = newEvent;
            this.opts.onchanged(this.currentEvent);
            if (parametrized) {
                const args = affixedData.event.arguments;
                for (const key in args) {
                    if (['integer', 'float'].includes(args[key].type)) {
                        newEvent.arguments[key] = 0;
                    } else if (['template', 'room', 'sound', 'tandem', 'font', 'style', 'texture'].includes(args[key].type)) {
                        newEvent.arguments[key] = -1;
                    } else if (args[key].type === 'boolean') {
                        newEvent.arguments[key] = false;
                    } else {
                        newEvent.arguments[key] = '';
                    }
                }
                this.update();
                this.refs.argumentsMenu.open();
            }
        };
        this.onArgumentsApplied = () => {
            this.update();
        };

        this.eventsMenu = eventsAPI.bakeCategories(this.opts.entitytype, this.addEvent);

        if (!this.opts.events) {
            console.error('event-list-scriptable was not provided with an `events` attribute.');
            // eslint-disable-next-line no-console
            console.warn(this);
        }
        if (!this.opts.entitytype) {
            console.error('event-list-scriptable was not provided with an `entitytype` attribute.');
            // eslint-disable-next-line no-console
            console.warn(this);
        }

        // Can turn into `undefined` if `events` is an empty array, this is ok
        this.currentEvent = this.opts.currentevent || this.opts.events[0];

        this.pickEvent = e => {
            const {event} = e.item;
            this.currentEvent = event;
            if (this.opts.onchanged) {
                this.opts.onchanged(event);
            }
        };

        this.promptEditEvent = event => () => {
            this.currentEvent = event;
            this.update();
            this.refs.argumentsMenu.open();
        };
        this.promptRemoveEvent = event => () => {
            alertify
            .okBtn(this.vocGlob.delete)
            .cancelBtn(this.vocGlob.cancel)
            .confirm(this.voc.removeEventConfirm)
            .then(e => {
                alertify
                .okBtn(this.vocGlob.ok)
                .cancelBtn(this.vocGlob.cancel);
                if (e.buttonClicked !== 'ok') {
                    return;
                }
                this.opts.events.splice(this.opts.events.indexOf(event), 1);
                if (this.currentEvent === event) {
                    if (this.opts.events.length) {
                        [this.currentEvent] = this.opts.events;
                    } else {
                        this.currentEvent = void 0;
                    }
                    if (this.opts.onchanged) {
                        this.opts.onchanged(this.currentEvent);
                    }
                }
            });
        };

        this.openEventMenu = () => {
            this.refs.eventsMenu.open();
        };
