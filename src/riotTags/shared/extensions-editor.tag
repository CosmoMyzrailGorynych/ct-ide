//
    The tag shows editable extends for a given asset type.
    Will be an empty inline element if no suitable extends were found.

    @attribute entity (riot object)
        An object to which apply editing to.
    @attribute type (string, 'type'|'tileLayer'|'room'|'copy')
        The type of the edited asset. Not needed if customextends is set.

    @attribute [compact] (atomic)
        Whether to use a more compact layout, replacing full-text hints with icons
        and using more compact classes for fields.
    @attribute [wide] (atomic)
        Whether to prefer a full-width layout. Useful for making neat columns of editable fields.

    @attribute [customextends] (riot Array<object>)
        Instead of reading modules' directory, use these extends specification instead.
        Useful for quickly generating markup for built-in fields.

    Extensions are an array of objects. The format of an extension is as following:

    declare interface IExtensionField {
        name: string, // the displayed name.
        // Below 'h1', 'h2', 'h3', 'h4' are purely decorational, for grouping fields. Others denote the type of an input field.
        type: 'h1' | 'h2' | 'h3' | 'h4' | 'text' | 'textfield' | 'code' | 'number' |
              'slider' | 'sliderAndNumber' | 'point2D' | 'checkbox' | 'radio' | 'texture' | 'type' |
              'color',
        key?: string, // the name of a JSON key to write into the `opts.entity`. Not needed for hN types, but required otherwise
                      // The key may have special suffixes that tell the exporter to unwrap foreign keys (resources' UIDs) into asset names.
                      // These are supposed to always be used with `'type'` and `'texture'` input types.
                      // Example: 'enemyClass@@type', 'background@@texture'.
        default?: any, // the default value; it is not written to the `opts.entity`, but is shown in inputs.
        help?: string, // a text label describing the purpose of a field
        options?: Array<{ // Used with type === 'radio'.
            value: any,
            name: string,
            help?: string
        }>,
        array?: boolean, // Whether to display an editable list instead of just one field.
        collect?: boolean, // Whether to collect values and suggest them later as an auto-completion results. (Not yet implemented)
        collectScope?: string // The name of a category under which to store suggestions from `collect`.
    }

extensions-editor
    virtual(each="{ext in extensions}")
        h1(if="{ext.type === 'h1'}") {ext.name}
        h2(if="{ext.type === 'h2'}") {ext.name}
        h3(if="{ext.type === 'h3'}") {ext.name}
        h4(if="{ext.type === 'h4'}") {ext.name}
        dl(class="{compact: compact}" if="{['h1', 'h2', 'h3', 'h4'].indexOf(ext.type) === -1}")
            dt(if="{!parent.opts.intable}")
                label.block.checkbox(if="{ext.type === 'checkbox'}")
                    input.nogrow(
                        if="{ext.type === 'checkbox'}"
                        type="checkbox"
                        checked="{parent.opts.entity[ext.key] || ext.default}"
                        onchange="{wire('this.opts.entity.'+ ext.key)}"
                    )
                    span   {ext.name}
                    hover-hint(if="{ext.help && parent.opts.compact}" text="{ext.help}")
                span(if="{ext.type !== 'checkbox'}")
                    b {ext.name}
                    b :
                    hover-hint(if="{ext.help && parent.opts.compact}" text="{ext.help}")
            dd(if="{ext.type === 'table'}")
                .aTableWrap
                    table.nicetable
                        tr
                            th.center(if="{!parent.opts.compact}") №
                            th(each="{field in ext.fields}")
                                | {field.name}
                                hover-hint(if="{field.help}" text="{field.help}")
                            th Actions
                        tr(each="{entry, ind in parent.opts.entity[ext.key]}" no-reorder)
                            td.center(if="{!parent.opts.compact}")
                                code {ind}
                            td(each="{field in ext.fields}")
                                extensions-editor(intable="true" compact="compact" entity="{entry}" customextends="{[field]}")
                            td
                                // Use opacity to keep nice layout
                                .anActionableIcon(onclick="{moveUp(ext, entry)}" title="{voc.moveUp}" style="{ind === 0 ? 'opacity: 0;' : ''}")
                                    svg.feather
                                        use(xlink:href="data/icons.svg#arrow-up")
                                .anActionableIcon(onclick="{moveDown(ext, entry)}"  style="{ind === parent.parent.opts.entity[ext.key].length - 1 ? 'opacity: 0;' : ''}" title="{voc.moveDown}")
                                    svg.feather
                                        use(xlink:href="data/icons.svg#arrow-down")
                                .anActionableIcon(onclick="{deleteRow(ext, entry)}" title="{voc.deleteScript}")
                                    svg.feather.red
                                        use(xlink:href="data/icons.svg#delete")
                            tr(if="{!parent.opts.entity[ext.key] || !parent.opts.entity[ext.key].length}")
                                td(colspan="{ext.fields.length + (parent.opts.compact ? 1 : 2)}") {parent.voc.noEntries}
                button(onclick="{parent.addRow}")
                    svg.feather
                        use(xlink:href="data/icons.svg#plus")
                    span {parent.voc.addRow}
            dd(if="{ext.type !== 'table'}")
                input.nogrow(
                    if="{ext.type === 'checkbox' && parent.opts.intable}"
                    type="checkbox"
                    checked="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                )
                texture-input(
                    if="{ext.type === 'texture'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    val="{parent.opts.entity[ext.key] || ext.default}"
                    onselected="{writeUid(ext.key)}"
                )
                .aPoint2DInput(if="{ext.type === 'point2D'}" class="{compact: parent.opts.compact, wide: parent.opts.wide}")
                    label
                        span X:
                        input(
                            class="{compact: parent.opts.compact}"
                            type="number"
                            step="8"
                            value="{parent.opts.entity[ext.key]? parent.opts.entity[ext.key][0] : ext.default[0]}"
                            onchange="{wire('this.opts.entity.'+ ext.key + '.0')}"
                        )
                    .spacer
                    label
                        span.nogrow Y:
                        input(
                            class="{compact: parent.opts.compact}"
                            type="number"
                            step="8"
                            value="{parent.opts.entity[ext.key]? parent.opts.entity[ext.key][1] : ext.default[1]}"
                            onchange="{wire('this.opts.entity.'+ ext.key + '.1')}"
                        )
                type-input(
                    if="{ext.type === 'type'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    val="{parent.opts.entity[ext.key] || ext.default}"
                    onselected="{writeUid(ext.key)}"
                )
                color-input(
                    if="{ext.type === 'color'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    color="{parent.opts.entity[ext.key] || ext.default}"
                    hidealpha="{ext.noalpha ? 'noalpha' : ''}"
                    onapply="{wire('this.opts.entity.'+ ext.key)}"
                )
                input(
                    if="{ext.type === 'text'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    type="text"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                )
                textarea(
                    if="{ext.type === 'textfield'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                )
                textarea.monospace(
                    if="{ext.type === 'code'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                )
                input(
                    if="{ext.type === 'number'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    type="number"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                    min="{ext.min}"
                    max="{ext.max}"
                    step="{ext.step}"
                )
                .aSliderWrap(if="{ext.type === 'slider'}")
                    input(
                        class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                        type="range"
                        value="{parent.opts.entity[ext.key] || ext.default}"
                        onchange="{wire('this.opts.entity.'+ ext.key)}"
                        min="{ext.min}"
                        max="{ext.max}"
                        step="{ext.step}"
                    )
                .flexrow(if="{ext.type === 'sliderAndNumber'}")
                    .aSliderWrap
                        input(
                            class="{compact: parent.opts.compact}"
                            type="range"
                            value="{parent.opts.entity[ext.key] || ext.default}"
                            onchange="{wire('this.opts.entity.'+ ext.key)}"
                            min="{ext.min}"
                            max="{ext.max}"
                            step="{ext.step}"
                        )
                    .spacer
                    input(
                        class="{compact: parent.opts.compact}"
                        type="number"
                        value="{parent.opts.entity[ext.key] || ext.default}"
                        onchange="{wire('this.opts.entity.'+ ext.key)}"
                        min="{ext.min}"
                        max="{ext.max}"
                        step="{ext.step}"
                    )
                label.block.checkbox(if="{ext.type === 'radio'}" each="{option in ext.options}")
                    input(
                        type="radio"
                        value="{option.value}"
                        checked="{parent.parent.opts.entity[ext.key] === option.value}"
                        onchange="{wire('this.opts.entity.'+ ext.key)}"
                    )
                    |   {option.name}
                    div.desc(if="{option.help}") {option.help}
                select(
                    if="{ext.type === 'select'}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                    class="{wide: parent.opts.wide}"
                )
                    option(
                        each="{option in ext.options}"
                        value="{option.value}"
                        selected="{parent.parent.opts.entity[ext.key] === option.value}"
                    ) {option.name}
                .dim(if="{ext.help && !parent.opts.compact}") {ext.help}
    script.
        const libsDir = './data/ct.libs';
        const fs = require('fs-extra'),
              path = require('path');

        this.mixin(window.riotWired);
        this.namespace = 'extensionsEditor';
        this.mixin(window.riotVoc);

        this.extensions = [];
        this.refreshExtends = () => {
            if (this.opts.customextends) {
                this.extensions = this.opts.customextends;
                return;
            }

            this.extensions = [];

            for (const lib in global.currentProject.libs) {
                fs.readJSON(path.join(libsDir, lib, 'module.json'))
                .then(moduleJson => {
                    const key = this.opts.type + 'Extends';
                    if (key in moduleJson) {
                        this.extensions.push(...moduleJson[key]);
                    }
                    this.update();
                });
            }
        };

        this.on('update', () => {
            if (!this.opts.entity) {
                console.error('extension-editor tag did not receive its `entity` object for editing!');
                // eslint-disable-next-line no-console
                console.warn(this);
            }
            if (this.opts.customextends && this.opts.customextends !== this.extensions) {
                this.extensions = this.opts.customextends;
            }
        });

        this.writeUid = field => obj => {
            if (obj) {
                this.opts.entity[field] = obj.uid;
            } else {
                this.opts.entity[field] = -1;
            }
            this.update();
        };

        this.addRow = e => {
            const {ext} = e.item;
            if (!this.opts.entity[ext.key]) {
                this.opts.entity[ext.key] = [];
            }
            const row = {};
            for (const field of ext.fields) {
                row[field.key]  = field.default;
            }
            this.opts.entity[ext.key].push(row);
        };

        this.moveUp = (field, row) => e => {
            if (e.item.ind === 0) {
                return;
            }
            const array = this.opts.entity[field.key],
                  ind = array.indexOf(row);
            [array[ind - 1], array[ind]] = [array[ind], array[ind - 1]];
            //this.update();
        };
        this.moveDown = (field, row) => e => {
            const array = this.opts.entity[field.key],
                  ind = array.indexOf(row);
            if (ind >= array.length - 1) {
                return;
            }
            [array[ind], array[ind + 1]] = [array[ind + 1], array[ind]];
            //this.update();
        };
        this.deleteRow = (field, row) => e => {
            const array = this.opts.entity[field.key],
                  ind = array.indexOf(row);
            array.splice(ind, 1);
        };

        window.signals.on('modulesChanged', this.refreshExtends);
        this.on('unmount', () => {
            window.signals.off('modulesChanged', this.refreshExtends);
        });
        this.refreshExtends();
