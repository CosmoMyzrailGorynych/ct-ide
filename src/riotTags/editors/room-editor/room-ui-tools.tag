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
    // fieldset(if="{opts.selection}")
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
