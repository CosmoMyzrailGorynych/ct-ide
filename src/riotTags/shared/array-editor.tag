//
    The tag allows editing a list of items of a specified type

    @attribute entity (riot object)
        The entity to edit
    @attribute inputtype (string)
        The main input type used in the array editor.
        One of the types supported by extensions-editor, except for headers, arrays, .
    @attribute [onchanged] (riot Function)
        A callback to call when the entity has changed.
    @attribute [wide] (atomic)

array-editor
    ul.aStripedList
        li.flexrow(each="{item, index in opts.entity}")
            .monospace.nogrow {index}
            .aSpacer.nogrow
            input.nogrow(
                if="{parent.inputtype === 'checkbox'}"
                type="checkbox"
                checked="{item}"
                onchange="{parent.wireAndNotify('this.opts.entity.'+ index)}"
            )
            asset-input(
                if="{['texture', 'template', 'room', 'sound'].includes(parent.opts.inputtype)}"
                assettype="{parent.opts.inputtype}s"
                allowclear="yep"
                class="compact"
                assetid="{item}"
                onchanged="{parent.writeUid(index)}"
            )
            .aPoint2DInput(if="{parent.opts.inputtype === 'point2D'}")
                label
                    span X:
                    input(
                        type="number"
                        value="{item[0] || 0}"
                        onchange="{ensurePoint2DAndWire(entity, index, [0, 0], 'this.opts.entity.'+ index + '.0')}"
                    )
                .aSpacer
                label
                    span.nogrow Y:
                    input(
                        type="number"
                        value="{item[1] || 0}"
                        onchange="{ensurePoint2DAndWire(entity, index, [0, 0], 'this.opts.entity.'+ index + '.1')}"
                    )
            color-input(
                if="{parent.opts.inputtype === 'color'}"
                class="{wide: parent.opts.wide}"
                color="{item}"
                hidealpha="{ext.noalpha ? 'noalpha' : ''}"
                onapply="{parent.wire('this.opts.entity.'+ index)}"
            )
            input(
                if="{parent.opts.inputtype === 'text'}"
                class="{wide: parent.opts.wide}"
                type="text"
                value="{item}"
                onchange="{parent.wire('this.opts.entity.'+ index)}"
            )
            textarea(
                if="{parent.opts.inputtype === 'textfield'}"
                class="{wide: parent.opts.wide}"
                value="{item}"
                onchange="{parent.wire('this.opts.entity.'+ index)}"
            )
            textarea.monospace(
                if="{parent.opts.inputtype === 'code'}"
                class="{wide: parent.opts.wide}"
                value="{item}"
                onchange="{parent.wire('this.opts.entity.'+ index)}"
            )
            input(
                if="{parent.opts.inputtype === 'number'}"
                class="{wide: parent.opts.wide}"
                type="number"
                value="{item}"
                onchange="{parent.wire('this.opts.entity.'+ index)}"
            )
            .aSliderWrap(if="{parent.opts.inputtype === 'slider'}")
                input(
                    class="{wide: parent.opts.wide}"
                    type="range"
                    value="{item}"
                    onchange="{parent.wire('this.opts.entity.'+ index)}"
                    min="0" max="100" step="0.1"
                )
            .flexrow(if="{parent.opts.inputtype === 'sliderAndNumber'}")
                .aSliderWrap
                    input(
                        class="{compact: parent.opts.compact}"
                        type="range"
                        value="{item}"
                        onchange="{parent.wire('this.opts.entity.'+ index)}"
                        min="0" max="100" step="0.1"
                    )
                .aSpacer
                input(
                    class="{compact: parent.opts.compact, invalid: ext.required && !Number.isFinite(parent.opts.entity[ext.key])}"
                    type="number"
                    value="{item}"
                    onchange="{wireAndNotify('this.opts.entity.'+ ext.key)}"
                    min="0" max="100" step="0.1"
                )
            .aSpacer.nogrow
            .nogrow
                // Use opacity to keep nice layout
                .anActionableIcon(onclick="{moveUp(index)}" title="{voc.moveUp}" style="{index === 0 ? 'opacity: 0;' : ''}")
                    svg.feather
                        use(xlink:href="#arrow-up")
                .anActionableIcon(onclick="{moveDown(index)}"  style="{index === parent.opts.entity.length - 1 ? 'opacity: 0;' : ''}" title="{voc.moveDown}")
                    svg.feather
                        use(xlink:href="#arrow-down")
                .anActionableIcon(onclick="{deleteRow(index)}" title="{voc.deleteRow}")
                    svg.feather.red
                        use(xlink:href="#delete")
    button(onclick="{addRow}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.addRow}
    script.
        this.mixin(window.riotWired);
        this.wireAndNotify = (...args1) => (...args2) => {
            this.wire(...args1)(...args2);
            if (this.opts.onchanged) {
                this.opts.onchanged();
            }
        };
        this.namespace = 'extensionsEditor';
        this.mixin(window.riotVoc);

        this.on('update', () => {
            if (!this.opts.entity) {
                console.error('array-editor tag did not receive its `entity` object for editing!');
                // eslint-disable-next-line no-console
                console.warn(this);
            }
        });

        this.writeUid = index => obj => {
            if (obj) {
                this.opts.entity[index] = obj.uid;
            } else {
                this.opts.entity[index] = -1;
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

        this.addRow = e => {
            if (['texture', 'template', 'room', 'sound'].includes(this.opts.inputtype)) {
                this.opts.entity.push(-1);
            } else if (['point2D', 'number', 'slider', 'sliderAndNumber'].includes(this.opts.inputtype)) {
                this.opts.entity.push(0);
            } else {
                this.opts.entity.push('');
            }
            if (this.opts.onchanged) {
                this.opts.onchanged();
            }
        };

        this.moveUp = row => e => {
            if (e.item.ind === 0) {
                return;
            }
            const array = this.opts.entity,
                  ind = array.indexOf(row);
            [array[ind - 1], array[ind]] = [array[ind], array[ind - 1]];
        };
        this.moveDown = row => () => {
            const array = this.opts.entity,
                  ind = array.indexOf(row);
            if (ind >= array.length - 1) {
                return;
            }
            [array[ind], array[ind + 1]] = [array[ind + 1], array[ind]];
        };
        this.deleteRow = row => () => {
            const array = this.opts.entity,
                  ind = array.indexOf(row);
            array.splice(ind, 1);
        };
