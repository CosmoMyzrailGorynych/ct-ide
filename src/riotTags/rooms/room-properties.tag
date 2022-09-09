//
    @attribute room
    @attribute updatebg (riot function)
    @attribute history (History)
room-properties
    fieldset
        label
            b {voc.name}
            br
            input.wide(
                type="text"
                onfocus="{rememberValue}"
                oninput="{wire('this.opts.room.name')}"
                onchange="{recordChange(opts.room, 'name')}"
                value="{opts.room.name}"
            )
    fieldset
        .aPoint2DInput.compact.wide
            label
                b {voc.width}
                br
                input.wide(
                    type="number" min="1" step="8"
                    onfocus="{rememberValue}"
                    oninput="{wire('this.opts.room.width')}"
                    onchange="{recordChange(opts.room, 'width')}"
                    value="{opts.room.width}"
                )
            .aSpacer
            label
                b {voc.height}
                br
                input.wide(
                    type="number" min="1" step="8"
                    onfocus="{rememberValue}"
                    oninput="{wire('this.opts.room.height')}"
                    onchange="{recordChange(opts.room, 'height')}"
                    value="{opts.room.height}"
                )
    fieldset
        label.checkbox
            input(
                type="checkbox"
                checked="{opts.room.restrictCamera}"
                onchange="{handleToggle(opts.room, 'restrictCamera')}"
            )
            span {voc.restrictCamera}
    fieldset
        .aPoint2DInput.compact.wide(if="{opts.room.restrictCamera}")
            label
                b {voc.minimumX}:
                |
                input.compact(
                    step="{opts.room.gridX}" type="number"
                    onfocus="{rememberValue}"
                    oninput="{wire('this.opts.room.restrictMinX')}"
                    onchange="{recordChange(opts.room, 'restrictMinX')}"
                    value="{opts.room.restrictMinX === void 0 ? 0 : opts.room.restrictMinX}"
                )
            .aSpacer
            label
                b.nogrow {voc.minimumY}:
                |
                input.compact(
                    step="{opts.room.gridY}" type="number"
                    onfocus="{rememberValue}"
                    oninput="{wire('this.opts.room.restrictMinY')}"
                    onchange="{recordChange(opts.room, 'restrictMinY')}"
                    value="{opts.room.restrictMinY === void 0 ? 0 : opts.room.restrictMinY}"
                )
        .aPoint2DInput.compact.wide(if="{opts.room.restrictCamera}")
            label
                b {voc.maximumX}:
                |
                input.compact(
                    step="{opts.room.gridX}" type="number"
                    onfocus="{rememberValue}"
                    oninput="{wire('this.opts.room.restrictMaxX')}"
                    onchange="{recordChange(opts.room, 'restrictMaxX')}"
                    value="{opts.room.restrictMaxX === void 0 ? opts.room.width : opts.room.restrictMaxX}"
                )
            .aSpacer
            label
                b.nogrow {voc.maximumY}:
                |
                input.compact(
                    step="{opts.room.gridY}" type="number"
                    onfocus="{rememberValue}"
                    oninput="{wire('this.opts.room.restrictMaxY')}"
                    onchange="{recordChange(opts.room, 'restrictMaxY')}"
                    value="{opts.room.restrictMaxY === void 0 ? opts.room.height : opts.room.restrictMaxY}"
                )

    fieldset
        b {voc.backgroundColor}
        br
        color-input.wide(onchange="{changeBgColor}" color="{opts.room.backgroundColor || '#000000'}")

    fieldset
        label.block.checkbox
            input(
                type="checkbox" checked="{opts.room.isUi}"
                onchange="{handleToggle(opts.room, 'isUi')}"
            )
            b {voc.isUi}

    fieldset
        extensions-editor(entity="{opts.room.extends}" type="room" wide="true" compact="true")

    script.
        this.namespace = 'roomView';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        var prevValue;
        this.rememberValue = e => {
            if (e.target.type === 'number') {
                prevValue = Number(e.target.value);
            } else {
                prevValue = e.target.value;
            }
        };
        this.recordChange = (entity, key) => e => {
            if (!this.opts.history) {
                return;
            }
            let {value} = e.target;
            if (e.target.type === 'number') {
                value = Number(value);
            }
            this.opts.history.pushChange({
                type: 'propChange',
                key,
                target: entity,
                before: prevValue,
                after: value
            });
        };

        this.changeBgColor = (e, color) => {
            const prevChange = this.opts.room.backgroundColor;
            this.opts.updatebg(e, color);
            this.opts.history.pushChange({
                type: 'propChange',
                key: 'backgroundColor',
                target: this.opts.room,
                before: prevChange,
                after: this.opts.room.backgroundColor
            });
        };
        this.handleToggle = (entity, key) => () => {
            const prevValue = entity[key];
            entity[key] = !entity[key];
            this.opts.history.pushChange({
                type: 'propChange',
                key,
                target: entity,
                before: prevValue,
                after: entity[key]
            });
        };
