//
    The tag shows editable extends for a given asset type.
    Will be an empty inline element if no suitable extends were found.

    @attribute entity (riot object)
        An object to which apply editing to.
    @attribute type (string, 'template'|'tileLayer'|'room'|'copy')
        The type of the edited asset. Not needed if customextends is set.

    @attribute [compact] (atomic)
        Whether to use a more compact layout, replacing full-text hints with icons
        and using more compact classes for fields.
    @attribute [wide] (atomic)
        Whether to prefer a full-width layout. Useful for making neat columns of editable fields.

    @attribute [customextends] (riot Array<IExtensionField>)
        Instead of reading modules' directory, use these extends specification instead.
        Useful for quickly generating markup for built-in fields.

    @attribute [onchanged] (riot Function)
        A callback to call when any of the fields were changed.

    Extensions are an array of objects. The format of an extension is as following:

    declare interface IExtensionField {
        name: string, // the displayed name.
        // Below 'h1', 'h2', 'h3', 'h4' are purely decorational, for grouping fields. Others denote the type of an input field.
        type: 'h1' | 'h2' | 'h3' | 'h4' |
              'text' | 'textfield' | 'code' |
              'number' | 'slider' | 'sliderAndNumber' | 'point2D' | 'color' |
              'checkbox' | 'radio' | 'select' |
              'group' | 'table' | 'array' |
              'texture' | 'template' | 'room' | 'sound' | 'icon',
        key?: string, // the name of a JSON key to write into the `opts.entity`. Not needed for hN types, but required otherwise
                      // The key may have special suffixes that tell the exporter to unwrap foreign keys (resources' UIDs) into asset names.
                      // These are supposed to always be used with `'template'` and `'texture'` input types.
                      // Example: 'enemyClass@@template', 'background@@texture'.
        default?: any, // the default value; it is not written to the `opts.entity`, but is shown in inputs.
        help?: string, // a text label describing the purpose of a field
        required?: boolean, // Adds an asterisk and will mark empty or unchecked fields with red color. ⚠ No other logic provided!
        if?: string, // Shows the field only when the value for the specified key of the same object is truthy.
        options?: Array<{ // Used with type === 'radio' and type === 'select'.
            value: any,
            name: string,
            help?: string
        }>,
        arrayType?: string, // The type of the fields used for the array editor (when `type` is 'array').
                            // It supports a subset of fields supported by extensions-editor itself,
                            // excluding headers, groups, tables, icons, radio, select, and arrays.
        items?: Array<IExtensionField>, // For type === 'group', the grouped items.
        fields?: Array<IExtensionField>, // For type === 'table'
        collect?: boolean, // Whether to collect values and suggest them later as an auto-completion results. (Not yet implemented)
        collectScope?: string // The name of a category under which to store suggestions from `collect`.
    }

extensions-editor
    virtual(each="{ext in extensions}" if="{!ext.if || opts.entity[ext.if]}")
        // ext="{ext}" is a workaround to lost loop variables in yields
        collapsible-section.aPanel(
            ext="{ext}"
            if="{ext.type === 'group'}"
            heading="{localizeField(ext, 'name')}"
            hlevel="{parent.opts.compact? 4 : 3}"
            defaultstate="{ext.openedByDefault? 'opened' : 'closed'}"
            storestatekey="catmod-{ext.lsKey}"
        )
            extensions-editor(
                entity="{parent.opts.entity}"
                customextends="{opts.ext.items}"
                compact="{parent.opts.compact || void 0}"
                wide="{parent.opts.wide || void 0}"
            )
        h1(if="{ext.type === 'h1'}") {localizeField(ext, 'name')}
        h2(if="{ext.type === 'h2'}") {localizeField(ext, 'name')}
        h3(if="{ext.type === 'h3'}") {localizeField(ext, 'name')}
        h4(if="{ext.type === 'h4'}") {localizeField(ext, 'name')}
        dl(class="{compact: compact}" if="{['h1', 'h2', 'h3', 'h4', 'group'].indexOf(ext.type) === -1}")
            dt(if="{!parent.opts.intable}")
                label.block.checkbox(if="{ext.type === 'checkbox'}")
                    input.nogrow(
                        if="{ext.type === 'checkbox'}"
                        type="checkbox"
                        checked="{parent.opts.entity[ext.key] || ext.default}"
                        onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                        class="{invalid: ext.required && !(parent.opts.entity[ext.key] || ext.default)}"
                    )
                    span {localizeField(ext, 'name')}
                    span.red(if="{ext.required}" title="{vocGlob.required}") *
                    hover-hint(if="{ext.help && parent.opts.compact}" text="{localizeField(ext, 'help')}")
                span(if="{ext.type !== 'checkbox'}")
                    b {localizeField(ext, 'name')}
                    b :
                    span.red(if="{ext.required}" title="{vocGlob.required}") *
                    hover-hint(if="{ext.help && parent.opts.compact}" text="{localizeField(ext, 'help')}")
            dd(if="{ext.type === 'table'}")
                .aTableWrap
                    table.aNiceTable(class="{wide: parent.opts.wide}")
                        tr
                            th(if="{!parent.opts.compact}") №
                            th(each="{field in ext.fields}")
                                | {parent.localizeField(field, 'name')}
                                span.red(if="{field.required}" title="{vocGlob.required}") *
                                hover-hint(if="{field.help}" text="{parent.localizeField(field, 'help')}")
                            th {voc.actions}
                        tr(each="{entry, ind in parent.opts.entity[ext.key]}" no-reorder)
                            td.center(if="{!parent.parent.opts.compact}")
                                code {ind}
                            td(each="{field in ext.fields}")
                                extensions-editor(intable="true" compact="compact" entity="{entry}" customextends="{[field]}")
                            td
                                // Use opacity to keep nice layout
                                .anActionableIcon(onclick="{moveUp(ext, entry)}" title="{voc.moveUp}")
                                    svg.feather
                                        use(xlink:href="#arrow-up")
                                .anActionableIcon(onclick="{moveDown(ext, entry)}" title="{voc.moveDown}")
                                    svg.feather
                                        use(xlink:href="#arrow-down")
                                .anActionableIcon(onclick="{deleteRow(ext, entry)}" title="{voc.deleteRow}")
                                    svg.feather.red
                                        use(xlink:href="#delete")
                            tr(if="{!parent.opts.entity[ext.key] || !parent.opts.entity[ext.key].length}")
                                td(colspan="{ext.fields.length + (parent.opts.compact ? 1 : 2)}") {parent.voc.noEntries}
                button(onclick="{parent.addRow}")
                    svg.feather
                        use(xlink:href="#plus")
                    span {parent.voc.addRow}
            dd(if="{ext.type !== 'table'}")
                input.nogrow(
                    if="{ext.type === 'checkbox' && parent.opts.intable}"
                    type="checkbox"
                    checked="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                    class="{invalid: ext.required && !(parent.opts.entity[ext.key] || ext.default)}"
                )
                asset-input(
                    if="{['texture', 'template', 'room', 'sound', 'tandem'].includes(ext.type)}"
                    assettype="{ext.type}s"
                    allowclear="yep"
                    compact="{parent.opts.compact}"
                    class="{wide: parent.opts.wide, invalid: ext.required && (parent.opts.entity[ext.key] || ext.default) === -1}"
                    assetid="{parent.opts.entity[ext.key] || ext.default}"
                    onchanged="{writeUid(ext.key)}"
                )
                .aPoint2DInput(if="{ext.type === 'point2D'}" class="{compact: parent.opts.compact, wide: parent.opts.wide}")
                    label
                        span X:
                        input(
                            class="{compact: parent.opts.compact}"
                            type="number"
                            step="{ext.step || 8}"
                            value="{parent.opts.entity[ext.key]? parent.opts.entity[ext.key][0] : ext.default[0]}"
                            onchange="{ensurePoint2DAndWire(parent.opts.entity, ext.key, ext.default, 'this.opts.entity.'+ ext.key + '.0')}"
                        )
                    .aSpacer
                    label
                        span.nogrow Y:
                        input(
                            class="{compact: parent.opts.compact}"
                            type="number"
                            step="{ext.step || 8}"
                            value="{parent.opts.entity[ext.key]? parent.opts.entity[ext.key][1] : ext.default[1]}"
                            onchange="{ensurePoint2DAndWire(parent.opts.entity, ext.key, ext.default, 'this.opts.entity.'+ ext.key + '.1')}"
                        )
                icon-input(
                    if="{ext.type === 'icon'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    val="{parent.opts.entity[ext.key] || ext.default}"
                    onselected="{writeAsIs(ext.key)}"
                )
                color-input(
                    if="{ext.type === 'color'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                    color="{parent.opts.entity[ext.key] || ext.default}"
                    hidealpha="{ext.noalpha ? 'noalpha' : ''}"
                    onapply="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                )
                input(
                    if="{ext.type === 'text'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide, invalid: ext.required && !parent.opts.entity[ext.key]}"
                    type="text"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                )
                textarea(
                    if="{ext.type === 'textfield'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide, invalid: ext.required && !parent.opts.entity[ext.key]}"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                )
                textarea.monospace(
                    if="{ext.type === 'code'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide, invalid: ext.required && !parent.opts.entity[ext.key]}"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                )
                input(
                    if="{ext.type === 'number'}"
                    class="{compact: parent.opts.compact, wide: parent.opts.wide, invalid: ext.required && !Number.isFinite(parent.opts.entity[ext.key])}"
                    type="number"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                    min="{ext.min}"
                    max="{ext.max}"
                    step="{ext.step}"
                )
                .aSliderWrap(if="{ext.type === 'slider'}")
                    input(
                        class="{compact: parent.opts.compact, wide: parent.opts.wide}"
                        type="range"
                        value="{parent.opts.entity[ext.key] || ext.default}"
                        onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
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
                            onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                            min="{ext.min}"
                            max="{ext.max}"
                            step="{ext.step}"
                        )
                    .aSpacer
                    input(
                        class="{compact: parent.opts.compact, invalid: ext.required && !Number.isFinite(parent.opts.entity[ext.key])}"
                        type="number"
                        value="{parent.opts.entity[ext.key] || ext.default}"
                        onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                        min="{ext.min}"
                        max="{ext.max}"
                        step="{ext.step}"
                    )
                label.block.checkbox(if="{ext.type === 'radio'}" each="{option in ext.options}")
                    input(
                        type="radio"
                        value="{option.value}"
                        checked="{parent.parent.opts.entity[ext.key] === option.value}"
                        onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                    )
                    | {parent.parent.localizeField(option, 'name')}
                    div.desc(if="{option.help}") {parent.parent.localizeField(option, 'help')}
                select(
                    if="{ext.type === 'select'}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                    class="{wide: parent.opts.wide}"
                )
                    option(
                        each="{option in ext.options}"
                        value="{option.value}"
                        selected="{parent.parent.opts.entity[ext.key] === option.value}"
                        disabled="{option.value === ''}"
                    ) {parent.parent.localizeField(option, 'name')}
                array-editor(if="{ext.type === 'array'}" inputtype="{ext.arrayType}" entity="{parent.opts.entity[ext.key]}" compact="{parent.opts.compact}")
                .dim(if="{ext.help && !parent.opts.compact}") {localizeField(ext, 'help')}
    script.
        const libsDir = './data/ct.libs';
        const fs = require('fs-extra'),
              path = require('path');

        this.mixin(window.riotWired);
        this.wireAndNotify = (...args1) => (...args2) => {
            this.wire(...args1)(...args2);
            if (this.opts.onchanged) {
                this.opts.onchanged();
            }
        };
        this.namespace = 'extensionsEditor';
        this.mixin(window.riotVoc);

        this.fixBrokenArrays = () => {
            for (const field of this.extensions) {
                if (!(field.key in this.opts.entity) && ['table', 'array'].includes(field.type)) {
                    this.opts.entity[field.key] = [];
                }
            }
        };

        this.extensions = [];
        this.refreshExtends = () => {
            if (this.opts.customextends) {
                this.extensions = this.opts.customextends;
                this.fixBrokenArrays();
                return;
            }

            this.extensions = [];

            const promises = [];
            for (const lib in global.currentProject.libs) {
                promises.push(fs.readJSON(path.join(libsDir, lib, 'module.json'))
                    .then(moduleJson => {
                        const key = this.opts.type + 'Extends';
                        if (key in moduleJson) {
                            this.extensions.push(...moduleJson[key]);
                        }
                    }));
            }
            Promise.all(promises).then(() => {
                this.fixBrokenArrays();
                this.update();
            });
        };

        var cachedEntity;
        this.on('update', () => {
            if (!this.opts.entity) {
                console.error('extension-editor tag did not receive its `entity` object for editing!');
                // eslint-disable-next-line no-console
                console.warn(this);
            }
            if (this.opts.customextends && this.opts.customextends !== this.extensions) {
                this.extensions = this.opts.customextends;
            }
            if (this.opts.entity !== cachedEntity) {
                this.fixBrokenArrays();
                cachedEntity = this.opts.entity;
            }
        });

        this.writeUid = field => id => {
            if (id) {
                this.opts.entity[field] = id;
            } else {
                this.opts.entity[field] = -1;
            }
            this.update();
        };
        this.writeAsIs = field => val => {
            this.opts.entity[field] = val;
            this.update();
        };

        this.ensurePoint2DAndWire = (obj, field, def, way) => e => {
            if (!obj[field]) {
                obj[field] = [...def];
            }
            this.wire(way)(e);
        };

        this.ensurePoint2DAndWire = (obj, field, def, way) => e => {
            if (!obj[field]) {
                obj[field] = [...def];
            }
            this.wire(way)(e);
        };

        this.addRow = e => {
            const {ext} = e.item;
            if (!this.opts.entity[ext.key]) {
                this.opts.entity[ext.key] = [];
            }
            const row = {};
            for (const field of ext.fields) {
                if (field.default) {
                    if (field.default instanceof Function) {
                        row[field.key] = field.default();
                    } else {
                        row[field.key] = field.default;
                    }
                }
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
        };
        this.moveDown = (field, row) => () => {
            const array = this.opts.entity[field.key],
                  ind = array.indexOf(row);
            if (ind >= array.length - 1) {
                return;
            }
            [array[ind], array[ind + 1]] = [array[ind + 1], array[ind]];
        };
        this.deleteRow = (field, row) => () => {
            const array = this.opts.entity[field.key],
                  ind = array.indexOf(row);
            array.splice(ind, 1);
        };

        window.signals.on('modulesChanged', this.refreshExtends);
        this.on('unmount', () => {
            window.signals.off('modulesChanged', this.refreshExtends);
        });
        this.refreshExtends();
