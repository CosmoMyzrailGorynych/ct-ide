behavior-editor.aPanel.aView.flexrow
    .behavior-editor-Properties.nml
        .tall.flexfix.aPanel.pad
            .flexfix-header
                button.wide(onclick="{openFields}")
                    svg.feather
                        use(xlink:href="#edit")
                    span {voc.customFields} ({asset.specification.length})
                .aSpacer
            .flexfix-body
                event-list-scriptable(
                    events="{asset.events}"
                    entitytype="{asset.behaviorType}"
                    onchanged="{changeCodeTab}"
                    currentevent="{currentSheet}"
                    warnbehaviors="yes"
                ).tall
            .flexfix-footer
                .aSpacer
                button.wide(onclick="{behaviorSave}" title="Shift+Control+S" data-hotkey="Shift+Control+S")
                    svg.feather
                        use(xlink:href="#check")
                    span {vocGlob.apply}
    .behavior-editor-anEditorPanel
        .tabwrap.tall(style="position: relative" if="{currentSheet !== 'fields'}")
            div
                .tabbed.noborder
                    code-editor-scriptable(event="{currentSheet}" entitytype="{asset.behaviorType}")
        .aPanel.tall.pad(if="{currentSheet === 'fields'}")
            h1 {voc.customFields}
            p {voc.customFieldsDescription}
            extensions-editor(customextends="{extends}" entity="{asset}" compact="true" onchanged="{() => this.update()}")
    script.
        this.namespace = 'behaviorEditor';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        this.extends = require('./data/node_requires/resources/content').getFieldsExtends();

        this.currentSheet = this.asset.events[0] || 'fields';
        this.changeCodeTab = scriptableEvent => {
            this.currentSheet = scriptableEvent;
            this.update();
        };
        this.openFields = () => {
            this.currentSheet = 'fields';
        };

        this.saveAsset = () => {
            this.writeChanges();
            return true;
        };
        this.behaviorSave = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };

        const update = () => this.update();
        window.orders.on('forceCodeEditorLayout', update);
        this.on('unmount', () => {
            window.orders.off('forceCodeEditorLayout', update);
        });
