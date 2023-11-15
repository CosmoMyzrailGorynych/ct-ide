room-ui-tools
    .aNotice(if="{!opts.selection}")
        span {voc.noSelectionNotice}
    h2.nmt(if="{opts.selection}")
        span {getName()}
    fieldset(if="{opts.selection && opts.selection.text}")
        h3 {voc.textSettings}
        label.block
            b {voc.customText}:
            br
            textarea.wide(
                value="{opts.selection.customTextSettings.customText}"
                oninput="{wireText('customText')}"
            )
        label.block
            b {voc.customTextSize}:
            br
            input(
                type="text"
                value="{opts.selection.customTextSettings.fontSize}"
                oninput="{wireText('fontSize')}"
            )
        label.block
            b {voc.wordWrapWidth}:
            br
            input(
                type="text"
                value="{opts.selection.customTextSettings.wordWrapWidth}"
                oninput="{wireText('wordWrapWidth')}"
            )
        b {voc.textAlignment}:
        br
        .aButtonGroupNine
            button(
                onclick="{setAlign(0, 0)}"
                title="{vocGlob.alignModes.topLeft}"
                class="{active: opts.selection.text.anchor.x === 0 && opts.selection.text.anchor.y === 0}"
            )
                svg.feather
                    use(xlink:href="#align-top-left")
            button(
                onclick="{setAlign(0.5, 0)}"
                title="{vocGlob.alignModes.topCenter}"
                class="{active: opts.selection.text.anchor.x === 0.5 && opts.selection.text.anchor.y === 0}"
            )
                svg.feather
                    use(xlink:href="#align-top-center")
            button(
                onclick="{setAlign(1, 0)}"
                title="{vocGlob.alignModes.topRight}"
                class="{active: opts.selection.text.anchor.x === 1 && opts.selection.text.anchor.y === 0}"
            )
                svg.feather
                    use(xlink:href="#align-top-right")
            button(
                onclick="{setAlign(0, 0.5)}"
                title="{vocGlob.alignModes.left}"
                class="{active: opts.selection.text.anchor.x === 0 && opts.selection.text.anchor.y === 0.5}"
            )
                svg.feather
                    use(xlink:href="#align-center-left")
            button(
                onclick="{setAlign(0.5, 0.5)}"
                title="{vocGlob.alignModes.center}"
                class="{active: opts.selection.text.anchor.x === 0.5 && opts.selection.text.anchor.y === 0.5}"
            )
                svg.feather
                    use(xlink:href="#align-center-center")
            button(
                onclick="{setAlign(1, 0.5)}"
                title="{vocGlob.alignModes.right}"
                class="{active: opts.selection.text.anchor.x === 1 && opts.selection.text.anchor.y === 0.5}"
            )
                svg.feather
                    use(xlink:href="#align-center-right")
            button(
                onclick="{setAlign(0, 1)}"
                title="{vocGlob.alignModes.bottomLeft}"
                class="{active: opts.selection.text.anchor.x === 0 && opts.selection.text.anchor.y === 1}"
            )
                svg.feather
                    use(xlink:href="#align-bottom-left")
            button(
                onclick="{setAlign(0.5, 1)}"
                title="{vocGlob.alignModes.bottom}"
                class="{active: opts.selection.text.anchor.x === 0.5 && opts.selection.text.anchor.y === 1}"
            )
                svg.feather
                    use(xlink:href="#align-bottom-center")
            button(
                onclick="{setAlign(1, 1)}"
                title="{vocGlob.alignModes.bottomRight}"
                class="{active: opts.selection.text.anchor.x === 1 && opts.selection.text.anchor.y === 1}"
            )
                svg.feather
                    use(xlink:href="#align-bottom-right")
    fieldset(if="{opts.selection}")
        h3 {voc.alignmentSettings}
        label.checkbox
            input(
                type="checkbox"
                checked="{Boolean(opts.selection.align)}"
                onchange="{toggleAutoAlign}"
            )
            span {voc.enableAutoAlignment}
            hover-hint(text="{voc.autoAlignHint}")
        b(if="{opts.selection.align}") {voc.frame}
        .anAlignmentMap(if="{opts.selection.align}")
            .anAlignmentMap-aContainer.withdots
            .pintopright.small.dim {vocGlob.assetTypes.room[0].slice(0, 1).toUpperCase()}{vocGlob.assetTypes.room[0].slice(1)}
            .x1y1
                input.inline.nm(
                    type="number" step="5" min="0" max="100"
                    value="{opts.selection.align.frame.x1}"
                    oninput="{wire('opts.selection.align.frame.x1')}"
                )
                span.dim  ×
                input.inline.nm(
                    type="number" step="5" min="0" max="100"
                    value="{opts.selection.align.frame.y1}"
                    oninput="{wire('opts.selection.align.frame.y1')}"
                )
            .x2y2
                input.inline.nm(
                    type="number" step="5" min="0" max="100"
                    value="{opts.selection.align.frame.x2}"
                    oninput="{wire('opts.selection.align.frame.x2')}"
                )
                span.dim  ×
                input.inline.nm(
                    type="number" step="5" min="0" max="100"
                    value="{opts.selection.align.frame.y2}"
                    oninput="{wire('opts.selection.align.frame.y2')}"
                )
            .center.small.dim {voc.outerFrameMarker}
        b(if="{opts.selection.align}") {voc.framePadding}
        .anAlignmentMap(if="{opts.selection.align}")
            .anAlignmentMap-aContainer
            .pintopright.small.dim {voc.outerFrameMarker}
            input.inline.nm.top(
                type="number" step="8" min="0"
                value="{opts.selection.align.padding.top}"
                oninput="{wire('opts.selection.align.padding.top')}"
            )
            input.inline.nm.right(
                type="number" step="8" min="0"
                value="{opts.selection.align.padding.right}"
                oninput="{wire('opts.selection.align.padding.right')}"
            )
            input.inline.nm.bottom(
                type="number" step="8" min="0"
                value="{opts.selection.align.padding.bottom}"
                oninput="{wire('opts.selection.align.padding.bottom')}"
            )
            input.inline.nm.left(
                type="number" step="8" min="0"
                value="{opts.selection.align.padding.left}"
                oninput="{wire('opts.selection.align.padding.left')}"
            )
            .center.small.dim {voc.innerFrameMarker}
        b(if="{opts.selection.align}") {voc.constrains}
        .anAlignmentMap(if="{opts.selection.align}")
            .anAlignmentMap-aContainer
            .pintopright.small.dim {voc.innerFrameMarker}
            button.square.inline.nm.left(
                onclick="{lockLeft}"
                title="{voc.constrainsTooltips.left}"
                class="{active: ['start', 'both'].includes(opts.selection.align.alignX)}"
            )
                svg.feather
                    use(xlink:href="#{['start', 'both'].includes(opts.selection.align.alignX) ? 'lock' : 'unlock'}")
            button.square.inline.nm.right(
                onclick="{lockRight}"
                title="{voc.constrainsTooltips.right}"
                class="{active: ['end', 'both'].includes(opts.selection.align.alignX)}"
            )
                svg.feather
                    use(xlink:href="#{['end', 'both'].includes(opts.selection.align.alignX) ? 'lock' : 'unlock'}")
            button.square.inline.nm.top(
                onclick="{lockTop}"
                title="{voc.constrainsTooltips.top}"
                class="{active: ['start', 'both'].includes(opts.selection.align.alignY)}"
            )
                svg.feather
                    use(xlink:href="#{['start', 'both'].includes(opts.selection.align.alignY) ? 'lock' : 'unlock'}")
            button.square.inline.nm.bottom(
                onclick="{lockBottom}"
                title="{voc.constrainsTooltips.bottom}"
                class="{active: ['end', 'both'].includes(opts.selection.align.alignY)}"
            )
                svg.feather
                    use(xlink:href="#{['end', 'both'].includes(opts.selection.align.alignY) ? 'lock' : 'unlock'}")
            .center
                span.crop.small.dim {getName()}
                br
                button.square.inline.nm(
                    onclick="{lockCenterVertical}"
                    title="{voc.constrainsTooltips.centerVertical}"
                    class="{active: opts.selection.align.alignY === 'center'}"
                )
                    svg.feather
                        use(xlink:href="#align-center-vertical")
                button.square.inline.nm(
                    onclick="{lockCenterHorizontal}"
                    title="{voc.constrainsTooltips.centerHorizontal}"
                    class="{active: opts.selection.align.alignX === 'center'}"
                )
                    svg.feather
                        use(xlink:href="#align-center-horizontal")
    script.
        this.namespace = 'roomView.uiTools';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);

        const {getById} = require('./data/node_requires/resources');
        this.getName = () => getById('template', this.opts.selection.templateId).name;

        this.memorizeChanges = () => {
            this.opts.pixieditor.history.snapshotUi();
        };

        this.wireText = key => e => {
            this.wire(`opts.selection.customTextSettings.${key}`)(e);
            this.opts.selection.updateText();
            this.memorizeChanges();
        };

        this.setAlign = (x, y) => () => {
            const cts = this.opts.selection.customTextSettings;
            cts.anchor ??= {};
            cts.anchor.x = x;
            cts.anchor.y = y;
            this.opts.selection.updateText();
            this.memorizeChanges();
        };

        const {getDefaultAlign} = require('./data/node_requires/resources/rooms');
        this.toggleAutoAlign = () => {
            const copy = this.opts.selection;
            if (copy.align) {
                delete copy.align;
            } else {
                copy.align = getDefaultAlign();
            }
        };
        this.lockLeft = () => {
            const {align} = this.opts.selection;
            if (align.alignX === 'start') {
                align.alignX = 'scale';
            } else if (align.alignX === 'both') {
                align.alignX = 'end';
            } else if (align.alignX === 'end') {
                align.alignX = 'both';
            } else { // scale & center
                align.alignX = 'start';
            }
        };
        this.lockRight = () => {
            const {align} = this.opts.selection;
            if (align.alignX === 'end') {
                align.alignX = 'scale';
            } else if (align.alignX === 'both') {
                align.alignX = 'start';
            } else if (align.alignX === 'start') {
                align.alignX = 'both';
            } else { // scale & center
                align.alignX = 'end';
            }
        };
        this.lockTop = () => {
            const {align} = this.opts.selection;
            if (align.alignY === 'start') {
                align.alignY = 'scale';
            } else if (align.alignY === 'both') {
                align.alignY = 'end';
            } else if (align.alignY === 'end') {
                align.alignY = 'both';
            } else { // scale & center
                align.alignY = 'start';
            }
        };
        this.lockBottom = () => {
            const {align} = this.opts.selection;
            if (align.alignY === 'end') {
                align.alignY = 'scale';
            } else if (align.alignY === 'both') {
                align.alignY = 'start';
            } else if (align.alignY === 'start') {
                align.alignY = 'both';
            } else { // scale & center
                align.alignY = 'end';
            }
        };
        this.lockCenterVertical = () => {
            const {align} = this.opts.selection;
            if (align.alignY === 'center') {
                align.alignY = 'scale';
            } else {
                align.alignY = 'center';
            }
        };
        this.lockCenterHorizontal = () => {
            const {align} = this.opts.selection;
            if (align.alignX === 'center') {
                align.alignX = 'scale';
            } else {
                align.alignX = 'center';
            }
        };
