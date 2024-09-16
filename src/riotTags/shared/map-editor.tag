//
    This tag allows editing a map, where key and value types can be of different type.

    @attribute entity (riot object)
        The entity to edit
    @attribute keytype (string)
        The input type used for keys.
        One of the types supported by extensions-editor, except for headers, arrays, maps, groups and tables.
    @attribute valuetype (string)
        The input type used for keys.
        One of the types supported by extensions-editor, except for headers, arrays, maps, groups and tables.
    @attribute [onchanged] (riot Function)
        A callback to call when the entity has changed.
    @attribute [wide] (atomic)
    @attribute [compact] (atomic)

map-editor
    table.aNiceTable.nmt(class="{dense: opts.compact}")
        tr
            th {vocFull.settings.content.key}
            th {vocFull.settings.content.value}
            th
        tr(if="{!Object.keys(opts.entity).length}")
            td(colspan="3") {voc.noEntries}
        tr(each="{value, key in opts.entity}" no-reorder)
            td
                input.nogrow(
                    if="{parent.opts.keytype === 'checkbox'}"
                    type="checkbox"
                    checked="{key}"
                    onchange="{parent.changeKey}"
                )
                asset-input(
                    if="{assetTypes.includes(parent.opts.keytype)}"
                    assettypes="{parent.opts.keytype}"
                    allowclear="yep"
                    compact="compact"
                    assetid="{key}"
                    onchanged="{parent.changeKeyUid(key)}"
                )
                select(
                    if="{parent.opts.keytype.startsWith('enum@')}"
                    onchange="{parent.changeKey}"
                    class="{wide: parent.opts.wide}"
                    value="{key}"
                )
                    option(
                        each="{option in getEnumValues(parent.opts.keytype.split('@')[1])}"
                        value="{option}"
                        selected="{key === option}"
                    ) {option}
                color-input(
                    if="{parent.opts.keytype === 'color'}"
                    class="{wide: parent.opts.wide}"
                    color="{key}"
                    hidealpha="{ext.noalpha ? 'noalpha' : ''}"
                    onapply="{parent.changeKey}"
                )
                input(
                    if="{parent.opts.keytype === 'text'}"
                    class="{wide: parent.opts.wide}"
                    type="text"
                    value="{key}"
                    onchange="{parent.changeKey}"
                )
                textarea(
                    if="{parent.opts.keytype === 'textfield'}"
                    class="{wide: parent.opts.wide}"
                    value="{key}"
                    onchange="{parent.changeKey}"
                )
                textarea.monospace(
                    if="{parent.opts.keytype === 'code'}"
                    class="{wide: parent.opts.wide}"
                    value="{key}"
                    onchange="{parent.changeKey}"
                )
                input(
                    if="{parent.opts.keytype === 'number'}"
                    class="{wide: parent.opts.wide}"
                    type="number"
                    value="{key}"
                    onchange="{parent.changeKey}"
                )
                .aSliderWrap(if="{parent.opts.keytype === 'slider'}")
                    input(
                        class="{wide: parent.opts.wide}"
                        type="range"
                        value="{key}"
                        onchange="{parent.changeKey}"
                        min="0" max="100" step="0.1"
                    )
                .flexrow(if="{parent.opts.keytype === 'sliderAndNumber'}")
                    .aSliderWrap
                        input(
                            class="{compact: parent.opts.compact}"
                            type="range"
                            value="{key}"
                            onchange="{parent.changeKey}"
                            min="0" max="100" step="0.1"
                        )
                    .aSpacer
                    input(
                        class="{compact: parent.opts.compact, invalid: ext.required && !Number.isFinite(parent.opts.entity[ext.key])}"
                        type="number"
                        value="{key}"
                        onchange="{parent.changeKey}"
                        min="0" max="100" step="0.1"
                    )
            td
                input.nogrow(
                    if="{parent.opts.valuetype === 'checkbox'}"
                    type="checkbox"
                    checked="{value}"
                    onchange="{parent.changeValue}"
                )
                asset-input(
                    if="{assetTypes.includes(parent.opts.valuetype)}"
                    assettypes="{parent.opts.valuetype}"
                    allowclear="yep"
                    compact="compact"
                    assetid="{value}"
                    onchanged="{parent.changeValueUid(key)}"
                )
                select(
                    if="{parent.opts.valuetype.startsWith('enum@')}"
                    onchange="{parent.changeValue}"
                    class="{wide: parent.opts.wide}"
                )
                    option(
                        each="{option in getEnumValues(parent.opts.valuetype.split('@')[1])}"
                        value="{option}"
                        selected="{key === option}"
                    ) {option}
                color-input(
                    if="{parent.opts.valuetype === 'color'}"
                    class="{wide: parent.opts.wide}"
                    color="{value}"
                    hidealpha="{ext.noalpha ? 'noalpha' : ''}"
                    onapply="{parent.changeValue}"
                )
                input(
                    if="{parent.opts.valuetype === 'text'}"
                    class="{wide: parent.opts.wide}"
                    type="text"
                    value="{value}"
                    onchange="{parent.changeValue}"
                )
                textarea(
                    if="{parent.opts.valuetype === 'textfield'}"
                    class="{wide: parent.opts.wide}"
                    value="{value}"
                    onchange="{parent.changeValue}"
                )
                textarea.monospace(
                    if="{parent.opts.valuetype === 'code'}"
                    class="{wide: parent.opts.wide}"
                    value="{value}"
                    onchange="{parent.changeValue}"
                )
                input(
                    if="{parent.opts.valuetype === 'number'}"
                    class="{wide: parent.opts.wide}"
                    type="number"
                    value="{value}"
                    onchange="{parent.changeValue}"
                )
                .aSliderWrap(if="{parent.opts.valuetype === 'slider'}")
                    input(
                        class="{wide: parent.opts.wide}"
                        type="range"
                        value="{value}"
                        onchange="{parent.changeValue}"
                        min="0" max="100" step="0.1"
                    )
                .flexrow(if="{parent.opts.valuetype === 'sliderAndNumber'}")
                    .aSliderWrap
                        input(
                            class="{compact: parent.opts.compact}"
                            type="range"
                            value="{value}"
                            onchange="{parent.changeValue}"
                            min="0" max="100" step="0.1"
                        )
                    .aSpacer
                    input(
                        class="{compact: parent.opts.compact, invalid: ext.required && !Number.isFinite(parent.opts.entity[ext.key])}"
                        type="number"
                        value="{value}"
                        onchange="{parent.changeValue}"
                        min="0" max="100" step="0.1"
                    )
            td
                .anActionableIcon(title="{vocGlob.delete}" onclick="{deleteKey}")
                    svg.feather.red
                        use(xlink:href="#delete")
    button(onclick="{addRow}" class="{inline: opts.compact}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.addRow}
    script.
        const {assetTypes, getById} = require('src/node_requires/resources');
        this.assetTypes = assetTypes;
        this.getEnumValues = (id) => {
            const {values} = getById('enum', id);
            return values;
        };

        this.mixin(require('src/node_requires/riotMixins/wire').default);
        this.wireAndNotify = (...args1) => (...args2) => {
            this.wire(...args1)(...args2);
            if (this.opts.onchanged) {
                this.opts.onchanged();
            }
        };
        this.namespace = 'extensionsEditor';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        if (this.opts.setlength) {
            this.opts.entity.length = Number(this.opts.setlength);
        }

        this.on('update', () => {
            if (!this.opts.entity) {
                console.error('array-editor tag did not receive its `entity` object for editing!');
                // eslint-disable-next-line no-console
                console.warn(this);
            }
        });

        const getValue = input => {
            if (input instanceof HTMLInputElement && input.type === 'checkbox') {
                return input.checked;
            } else if (input instanceof HTMLInputElement && (input.type === 'number' || input.type === 'range')) {
                let val = Number(input.value);
                if (input.hasAttribute('data-wired-force-minmax')) {
                    val = Math.max(Number(input.min), Math.min(Number(input.max), val));
                }
                return val;
            }
            return input.value;
        };
        this.changeKey = e => {
            const {key, value} = e.item;
            delete this.opts.entity[key];
            this.opts.entity[getValue(e.target)] = value;
        };
        this.changeKeyUid = key => uid => {
            const value = this.opts.entity[key];
            delete this.opts.entity[key];
            this.opts.entity[uid || -1] = value;
            this.update();
        };
        this.changeValue = e => {
            const {key} = e.item;
            this.opts.entity[key] = getValue(e.target);
        };
        this.changeValueUid = key => uid => {
            this.opts.entity[key] = uid || -1;
            this.update();
        };

        this.addRow = () => {
            let key, value;
            if ([assetTypes].includes(this.opts.valuetype)) {
                value = -1;
            } else if (this.opts.valuetype === 'checkbox') {
                value = false;
            } else if (['number', 'sliderAndNumber', 'slider'].includes(this.opts.valuetype)) {
                value = 0;
            } else if (this.opts.valuetype.startsWith('enum@')) {
                const [, uid] = this.opts.valuetype.split('@');
                [value] = getById('enum', uid).values;
            } else {
                value = '';
            }

            if ([assetTypes].includes(this.opts.keytype) && !(-1 in this.opts.entity)) {
                key = -1;
            } else if (this.opts.keytype === 'checkbox' && !this.opts.entity.false) { // Why would someone ever use it?
                key = false;
            } else if (['number', 'sliderAndNumber', 'slider'].includes(this.opts.keytype)) {
                key = 0;
                while (key in this.opts.entity) {
                    key++;
                }
            } else if (this.opts.keytype.startsWith('enum@')) {
                const [, uid] = this.opts.keytype.split('@');
                let i = 0;
                const {values} = getById('enum', uid);
                while (i < values.length && (values[i] in this.opts.entity)) {
                    i++;
                }
                key = values[i];
            } else {
                let i = 0;
                while (`key${i}` in this.opts.entity) {
                    i++;
                }
                key = `key${i}`;
            }
            if (key !== void 0) {
                this.opts.entity[key] = value;
            }
        };
        this.deleteKey = e => {
            const {key} = e.item;
            delete this.opts.entity[key];
        };
