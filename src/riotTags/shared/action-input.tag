//
    A button with a dropdown that lets a user select an Action

    @attribute actionname (string)
        The name of the currently selected action
    @attribute [allowclear] (atomic)
        If set, shows an additional button to clear the input
    @attribute [compact] (atomic)
        If set, displays a more compact layout

    @attribute onchanged (riot function)
        Passes the name of the new event every time the input was changed
        (can also change due to having an invalid action)
action-input
    .aButtonGroup.nml
        button(onclick="{openSelector}" title="{vocGlob.select}" class="{inline: opts.compact}")
            svg.feather
                use(xlink:href="#airplay")
            span(if="{!opts.actionname}") {vocGlob.selectDialogue}
            span(if="{opts.actionname}") {opts.actionname}
        button.square(if="{actionname && opts.allowclear}" title="{vocGlob.clear}" onclick="{clearField}" class="{inline: opts.compact}")
            svg.feather
                use(xlink:href="#x")
    context-menu(ref="menu" menu="{menu}")
    script.
        if (!this.opts.onchanged) {
            console.error('An action-input tag doesn\'t have its onchanged attrubute set, and thus is pointless!');
        }
        if (this.opts.actionName) {
            if (!window.currentProject.actions.find(action => action.name === this.opts.actionName)) {
                // eslint-disable-next-line no-console
                console.warn(`An action-input was passed an invalid action ${this.opts.actionName} and will request to empty its value.`);
                if (this.opts.onchanged) {
                    this.opts.onchanged();
                }
            }
        }

        this.namespace = 'common.scriptables';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.changeField = affixedData => {
            if (this.opts.onchanged) {
                this.opts.onchanged(affixedData.actionName);
            }
        };
        this.clearField = () => {
            if (this.opts.onchanged) {
                this.opts.onchanged();
            }
        };

        this.openSelector = e => {
            this.menu = {
                opened: true,
                items: window.currentProject.actions.map(action => ({
                    label: action.name,
                    affixedData: {
                        actionName: action.name
                    },
                    click: this.changeField
                }))
            };
            this.refs.menu.popup(e.clientX, e.clientY);
        };
