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
    collapsible-section(
        heading="{voc.viewportHeading}"
        defaultstate="opened"
        storestatekey="roomEditorViewport"
        hlevel="4"
    )
        fieldset
            .aPoint2DInput.compact.wide
                label
                    b {parent.voc.width}
                    br
                    input.wide(
                        type="number" min="1" step="8"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.wire('this.opts.room.width')}"
                        onchange="{parent.recordChange(parent.opts.room, 'width')}"
                        value="{parent.opts.room.width}"
                    )
                .aSpacer
                label
                    b {parent.voc.height}
                    br
                    input.wide(
                        type="number" min="1" step="8"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.wire('this.opts.room.height')}"
                        onchange="{parent.recordChange(parent.opts.room, 'height')}"
                        value="{parent.opts.room.height}"
                    )
        fieldset
            b {parent.voc.followTemplate}
            docs-shortcut.toright(
                title="{voc.followCodeHint}"
                path="/tips-n-tricks/viewport-management.html#following-a-copy"
            )
            asset-input.wide(
                assettype="templates"
                allowclear="allowclear"
                compact="compact"
                assetid="{parent.opts.room.follow}"
                onchanged="{parent.setFollow}"
            )
        fieldset
            label.checkbox
                input(
                    type="checkbox"
                    checked="{parent.opts.room.restrictCamera}"
                    onchange="{parent.handleToggle(parent.opts.room, 'restrictCamera')}"
                )
                span {parent.voc.restrictCamera}
        fieldset
            .aPoint2DInput.compact.wide(if="{parent.opts.room.restrictCamera}")
                label
                    b {parent.voc.minimumX}:
                    |
                    input.compact.wide(
                        step="{parent.opts.room.gridX}" type="number"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.wire('this.opts.room.restrictMinX')}"
                        onchange="{parent.recordChange(parent.opts.room, 'restrictMinX')}"
                        value="{parent.opts.room.restrictMinX === void 0 ? 0 : parent.opts.room.restrictMinX}"
                    )
                .aSpacer
                label
                    b.nogrow {parent.voc.minimumY}:
                    |
                    input.compact.wide(
                        step="{parent.opts.room.gridY}" type="number"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.wire('this.opts.room.restrictMinY')}"
                        onchange="{parent.recordChange(opts.room, 'restrictMinY')}"
                        value="{parent.opts.room.restrictMinY === void 0 ? 0 : parent.opts.room.restrictMinY}"
                    )
            .aPoint2DInput.compact.wide(if="{parent.opts.room.restrictCamera}")
                label
                    b {parent.voc.maximumX}:
                    |
                    input.compact.wide(
                        step="{parent.opts.room.gridX}" type="number"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.wire('this.opts.room.restrictMaxX')}"
                        onchange="{parent.recordChange(parent.opts.room, 'restrictMaxX')}"
                        value="{parent.opts.room.restrictMaxX === void 0 ? parent.opts.room.width : parent.opts.room.restrictMaxX}"
                    )
                .aSpacer
                label
                    b.nogrow {parent.voc.maximumY}:
                    |
                    input.compact.wide(
                        step="{parent.opts.room.gridY}" type="number"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.wire('this.opts.room.restrictMaxY')}"
                        onchange="{parent.recordChange(parent.opts.room, 'restrictMaxY')}"
                        value="{parent.opts.room.restrictMaxY === void 0 ? parent.opts.room.height : parent.opts.room.restrictMaxY}"
                    )
    .aSpacer
    fieldset
        b {voc.backgroundColor}
        br
        color-input.wide(
            onchange="{changeBgColor}"
            color="{opts.room.backgroundColor || '#000000'}"
            hidealpha="hidealpha"
        )

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

        this.setFollow = uid => {
            const prevValue = this.opts.room.follow;
            this.opts.room.follow = uid;
            this.opts.history.pushChange({
                type: 'propChange',
                key: 'follow',
                target: this.opts.room,
                before: prevValue,
                after: uid
            });
            this.update();
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
