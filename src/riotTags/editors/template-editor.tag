mixin templateProperties
    collapsible-section.anInsetPanel(
        heading="{vocGlob.assetTypes.behavior[2].slice(0, 1).toUpperCase() + vocGlob.assetTypes.behavior[2].slice(1)}"
        storestatekey="templateBehaviors"
        hlevel="4"
    )
        behavior-list(
            onchanged="{parent.updateBehaviorExtends}"
            asset="{parent.asset}"
        )
    collapsible-section.anInsetPanel(
        if="{['NineSlicePlane', 'Button'].includes(asset.baseClass)}"
        heading="{voc.panelHeading}"
        storestatekey="templateNineSlice"
        hlevel="4"
    )
        fieldset.aNinePatchGrid
            input.aNinePatchElement.top(
                title="{parent.voc.nineSliceTop}"
                type="number" min="1" step="8"
                value="{parent.asset.nineSliceSettings.top}"
                oninput="{parent.wire('asset.nineSliceSettings.top')}"
            )
            input.aNinePatchElement.right(
                title="{parent.voc.nineSliceRight}"
                type="number" min="1" step="8"
                value="{parent.asset.nineSliceSettings.right}"
                oninput="{parent.wire('asset.nineSliceSettings.right')}"
            )
            input.aNinePatchElement.bottom(
                title="{parent.voc.nineSliceBottom}"
                type="number" min="1" step="8"
                value="{parent.asset.nineSliceSettings.bottom}"
                oninput="{parent.wire('asset.nineSliceSettings.bottom')}"
            )
            input.aNinePatchElement.left(
                title="{parent.voc.nineSliceLeft}"
                type="number" min="1" step="8"
                value="{parent.asset.nineSliceSettings.left}"
                oninput="{parent.wire('asset.nineSliceSettings.left')}"
            )
        fieldset
            label.block.checkbox
                input(
                    type="checkbox"
                    checked="{parent.asset.nineSliceSettings.autoUpdate}"
                    onchange="{parent.wire('asset.nineSliceSettings.autoUpdate')}"
                )
                span {parent.voc.autoUpdateNineSlice}
                hover-hint(text="{parent.voc.autoUpdateNineSliceHint}")
    collapsible-section.anInsetPanel(
        heading="{voc.appearance}"
        storestatekey="templateEditorAppearance"
        hlevel="4"
    )
        // Button states' textures
        fieldset(if="{parent.asset.baseClass === 'Button'}")
            b {parent.voc.hoverTexture}:
            asset-input.wide(
                assettypes="texture"
                assetid="{parent.asset.hoverTexture || -1}"
                allowclear="allowclear"
                onchanged="{parent.applyButtonTexture('hoverTexture')}"
            )
            b {parent.voc.pressedTexture}:
            asset-input.wide(
                assettypes="texture"
                assetid="{parent.asset.pressedTexture || -1}"
                allowclear="allowclear"
                onchanged="{parent.applyButtonTexture('pressedTexture')}"
            )
            b {parent.voc.disabledTexture}:
            asset-input.wide(
                assettypes="texture"
                assetid="{parent.asset.disabledTexture || -1}"
                allowclear="allowclear"
                onchanged="{parent.applyButtonTexture('disabledTexture')}"
            )
        // Text style selector for buttons and other UI elements more complex than a text label
        fieldset(if="{parent.asset.baseClass === 'Button'}")
            b {parent.voc.textStyle}:
            asset-input.wide(
                assettypes="style"
                assetid="{parent.asset.textStyle || -1}"
                allowclear="allowclear"
                onchanged="{parent.applyStyle}"
            )
        fieldset
            label.block
                b {parent.voc.depth}
                input.wide(
                    type="number"
                    onchange="{parent.wire('asset.depth')}"
                    value="{parent.asset.depth}"
                )
            label.block
                b {parent.voc.opacity}
                input.wide(
                    type="number" min="0" max="1" step="0.1"
                    onchange="{parent.wire('asset.extends.alpha')}"
                    value="{parent.asset.extends.alpha ?? 1}"
                )
            label.block(if="{parent.asset.baseClass !== 'Container'}")
                b {parent.voc.blendMode}
                select.wide(onchange="{parent.wire('asset.blendMode')}")
                    option(value="normal" selected="{parent.asset.blendMode === 'normal' || !parent.asset.blendMode}") {parent.voc.blendModes.normal}
                    option(value="add" selected="{parent.asset.blendMode === 'add'}") {parent.voc.blendModes.add}
                    option(value="multiply" selected="{parent.asset.blendMode === 'multiply'}") {parent.voc.blendModes.multiply}
                    option(value="screen" selected="{parent.asset.blendMode === 'screen'}") {parent.voc.blendModes.screen}
        fieldset(if="{['Text', 'Button'].includes(parent.asset.baseClass)}")
            label.block
                b {parent.voc.defaultText}
                input(
                    type="text"
                    value="{parent.asset.defaultText}"
                    onchange="{parent.wire('asset.defaultText')}"
                )
        fieldset
            label.flexrow(if="{parent.asset.baseClass === 'AnimatedSprite'}")
                b.nogrow.alignmiddle {parent.voc.animationFPS}
                .aSpacer.nogrow
                input.alignmiddle(type="number" max="60" min="1" step="1" value="{parent.asset.animationFPS ?? 60}" onchange="{parent.wire('asset.animationFPS')}")
            label.block.checkbox(if="{parent.asset.baseClass === 'AnimatedSprite'}")
                input(type="checkbox" checked="{parent.asset.playAnimationOnStart}" onchange="{parent.wire('asset.playAnimationOnStart')}")
                span {parent.voc.playAnimationOnStart}
            label.block.checkbox(if="{parent.asset.baseClass === 'AnimatedSprite'}")
                input(type="checkbox" checked="{parent.asset.loopAnimation}" onchange="{parent.wire('asset.loopAnimation')}")
                span {parent.voc.loopAnimation}
            label.block.checkbox
                input(type="checkbox" checked="{parent.asset.visible ?? true}" onchange="{parent.wire('asset.visible')}")
                span {parent.voc.visible}
    .aSpacer(if="{behaviorExtends.length}")
    extensions-editor(
        entity="{asset.extends}"
        customextends="{behaviorExtends}"
        compact="compact" wide="wide"
    )
    .aSpacer
    extensions-editor(type="template" entity="{asset.extends}" wide="yep" compact="probably")

mixin eventsList
    event-list-scriptable(
        events="{asset.events}"
        entitytype="template"
        baseclass="{asset.baseClass}"
        onchanged="{changeCodeTab}"
        currentevent="{currentSheet}"
    ).tall

template-editor.aPanel.aView.flexrow
    .template-editor-Properties.nml(class="{alt: localStorage.altTemplateLayout === 'on'}")
        .tall.flexfix.aPanel.pad
            .flexfix-header
                asset-input.wide(
                    if="{['AnimatedSprite', 'NineSlicePlane', 'Button'].includes(asset.baseClass)}"
                    assettypes="texture"
                    assetid="{asset.texture || -1}"
                    large="large"
                    allowclear="allowclear"
                    onchanged="{applyTexture}"
                )
                asset-input.wide(
                    if="{asset.baseClass === 'Text'}"
                    assettypes="style"
                    assetid="{asset.textStyle || -1}"
                    large="large"
                    allowclear="allowclear"
                    onchanged="{applyStyle}"
                )
                .aSpacer
                .relative
                    button.wide.flexrow(onclick="{showbaseClassMenu}")
                        svg.feather.nogrow.alignmiddle
                            use(xlink:href="#{baseClassToIcon[asset.baseClass]}")
                        span.nogrow.alignmiddle {voc.baseClass[asset.baseClass]}
                        .aSpacer
                        svg.feather.nogrow.alignmiddle
                            use(xlink:href="#chevron-down")
                    context-menu.wide(menu="{baseClassMenu}" style="position: absolute; top: 100%" ref="baseClassMenu")
                .aSpacer
            .flexfix-body(if="{localStorage.altTemplateLayout !== 'on'}")
                +eventsList()
            .flexfix-body(if="{localStorage.altTemplateLayout === 'on'}")
                +templateProperties()
            .flexfix-footer
                .aSpacer
                button.wide(onclick="{templateSave}" title="Shift+Control+S" data-hotkey="Shift+Control+S")
                    svg.feather
                        use(xlink:href="#check")
                    span {vocGlob.apply}
    .template-editor-aSlidingEventList(if="{localStorage.altTemplateLayout === 'on'}")
        .aPanel.tall
            .template-editor-aSlidingEventListWrap.tall
                +eventsList()
        svg.feather.template-editor-aSlidingEventListIcon.unclickable
            use(xlink:href="#plus")
    .template-editor-aCodeEditor
        .tabwrap.tall(style="position: relative")
            //ul.tabs.aNav.nogrow.noshrink
            //    li(onclick="{changeTab('javascript')}" class="{active: tab === 'javascript'}" title="JavaScript (Control+Q)" data-hotkey="Control+q")
            //        svg.feather
            //            use(xlink:href="#code")
            //        span {voc.create}
            //    li(onclick="{changeTab('blocks')}" class="{active: tab === 'blocks'}" title="Blurry (Control+W)" data-hotkey="Control+w")
            //        svg.feather
            //            use(xlink:href="#grid")
            //        span {voc.step}
            div
                .tabbed.noborder(show="{tab === 'javascript'}")
                    code-editor-scriptable(
                        event="{currentSheet}"
                        entitytype="template"
                        baseclass="{baseClassToTS[asset.baseClass]}"
                    )
                // .tabbed(show="{tab === 'blocks'}")
                //     .aBlocksEditor(ref="blocks")
    .template-editor-Properties.nmr(if="{localStorage.altTemplateLayout !== 'on' && !minimizeProps}")
        .tall.aPanel.pad.npt
            +templateProperties()
    button.toright.template-editor-aPresentationButton.square.tiny(
        onclick="{toggleProps}"
        if="{localStorage.altTemplateLayout !== 'on'}"
    )
        svg.feather
            use(xlink:href="#{minimizeProps ? 'maximize-2' : 'minimize-2'}")
    script.
        this.namespace = 'templateView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        const resources = require('./data/node_requires/resources');

        this.getTextureRevision = template => resources.getById(template.texture).lastmod;

        this.tab = 'javascript';
        [this.currentSheet] = this.asset.events; // can be undefined, this is ok

        const {schemaToExtensions} = require('./data/node_requires/resources/content');
        this.behaviorExtends = [];
        this.updateBehaviorExtends = () => {
            this.behaviorExtends = [];
            for (const behaviorUid of this.asset.behaviors) {
                const behavior = resources.getById('behavior', behaviorUid);
                if (behavior.specification.length) {
                    this.behaviorExtends.push({
                        name: behavior.name,
                        type: 'group',
                        items: schemaToExtensions(behavior.specification)
                    });
                }
            }
            this.update();
        };
        this.updateBehaviorExtends();

        const {baseClasses, baseClassToIcon, baseClassToTS} = require('./data/node_requires/resources/templates');
        this.baseClassToIcon = baseClassToIcon;
        this.baseClassToTS = baseClassToTS;
        this.baseClassMenu = {
            opened: false,
            items: baseClasses.map(baseClass => ({
                icon: this.baseClassToIcon[baseClass],
                label: this.voc.baseClass[baseClass],
                click: () => {
                    this.asset.baseClass = baseClass;
                    this.update();
                }
            }))
        };
        this.showbaseClassMenu = () => {
            this.refs.baseClassMenu.toggle();
        };

        this.changeTab = tab => () => {
            this.tab = tab;
        };
        this.applyTexture = id => {
            if (id === -1) {
                this.asset.skeleton = -1;
            } else {
                const asset = resources.getById('texture', id);
                // Set template's name to match the texture's one
                // if user haven't specified their own yet.
                if (this.asset.name === 'NewTemplate') {
                    this.asset.name = asset.name;
                }
                this.asset.texture = id;
            }
            this.update();
        };
        this.applyButtonTexture = key => id => {
            this.asset[key] = id;
            this.update();
        };
        this.applyStyle = id => {
            if (id === -1) {
                this.asset.textStyle = -1;
            } else {
                const asset = resources.getById('style', id);
                // Set template's name to match the style's one
                // if user haven't specified their own yet.
                if (this.asset.name === 'NewTemplate') {
                    this.asset.name = asset.name;
                }
                this.asset.textStyle = id;
            }
            this.update();
        };
        this.saveAsset = () => {
            this.writeChanges();
            return true;
        };
        this.templateSave = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };
        this.changeCodeTab = scriptableEvent => {
            this.currentSheet = scriptableEvent;
            this.update();
        };

        const update = () => this.update();
        window.orders.on('forceCodeEditorLayout', update);
        this.on('unmount', () => {
            window.orders.off('forceCodeEditorLayout', update);
        });

        this.minimizeProps = localStorage.minimizeTemplatesProps === 'yes';
        this.toggleProps = () => {
            this.minimizeProps = !this.minimizeProps;
            localStorage.minimizeTemplatesProps = this.minimizeProps ? 'yes' : 'no';
            window.orders.trigger('forceCodeEditorLayout');
        };
