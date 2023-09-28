mixin templateProperties
    collapsible-section.aPanel(
        heading="{voc.appearance}"
        storestatekey="templateEditorAppearance"
        hlevel="4"
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
            label.block
                b {parent.voc.blendMode}
                select.wide(onchange="{parent.wire('asset.blendMode')}")
                    option(value="normal" selected="{parent.asset.blendMode === 'normal' || !parent.asset.blendMode}") {parent.voc.blendModes.normal}
                    option(value="add" selected="{parent.asset.blendMode === 'add'}") {parent.voc.blendModes.add}
                    option(value="multiply" selected="{parent.asset.blendMode === 'multiply'}") {parent.voc.blendModes.multiply}
                    option(value="screen" selected="{parent.asset.blendMode === 'screen'}") {parent.voc.blendModes.screen}
        fieldset
            label.flexrow
                b.nogrow.alignmiddle {parent.voc.animationFPS}
                .aSpacer.nogrow
                input.alignmiddle(type="number" max="60" min="1" step="1" value="{parent.asset.animationFPS ?? 60}" onchange="{parent.wire('asset.animationFPS')}")
            label.block.checkbox
                input(type="checkbox" checked="{parent.asset.playAnimationOnStart}" onchange="{parent.wire('asset.playAnimationOnStart')}")
                span {parent.voc.playAnimationOnStart}
            label.block.checkbox
                input(type="checkbox" checked="{parent.asset.loopAnimation}" onchange="{parent.wire('asset.loopAnimation')}")
                span {parent.voc.loopAnimation}
            label.block.checkbox
                input(type="checkbox" checked="{parent.asset.visible ?? true}" onchange="{parent.wire('asset.visible')}")
                span {parent.voc.visible}
    .aSpacer
    extensions-editor(type="template" entity="{asset.extends}" wide="yep" compact="probably")

mixin eventsList
    event-list-scriptable(
        events="{asset.events}"
        entitytype="template"
        onchanged="{changeCodeTab}"
        currentevent="{currentSheet}"
    ).tall

template-editor.aPanel.aView.flexrow
    .template-editor-Properties.nml(class="{alt: localStorage.altTemplateLayout === 'on'}")
        .tall.flexfix.aPanel.pad
            .flexfix-header
                asset-input.wide(
                    assettypes="texture,skeleton"
                    assetid="{asset.texture || -1}"
                    large="large"
                    allowclear="allowclear"
                    onchanged="{applyTexture}"
                )
                .aSpacer
                .center
                    svg.feather
                        use(xlink:href="#template")
                    b
                        code  {asset.name}
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
                    code-editor-scriptable(event="{currentSheet}" entitytype="template")
                // .tabbed(show="{tab === 'blocks'}")
                //     .aBlocksEditor(ref="blocks")
    .template-editor-Properties.nmr(if="{localStorage.altTemplateLayout !== 'on' && !minimizeProps}")
        .tall.flexfix.aPanel.pad
            .flexfix-body
                +templateProperties()
    button.toright.template-editor-aPresentationButton.square.tiny(
        onclick="{toggleProps}"
        if="{localStorage.altTemplateLayout !== 'on'}"
    )
        svg.feather
            use(xlink:href="#{minimizeProps ? 'maximize-2' : 'minimize-2'}")
    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.namespace = 'templateView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        const resources = require('./data/node_requires/resources');

        this.getTextureRevision = template => resources.getById(template.texture).lastmod;

        this.tab = 'javascript';
        [this.currentSheet] = this.asset.events; // can be undefined, this is ok

        this.changeTab = tab => () => {
            this.tab = tab;
        };
        this.changeSprite = () => {
            this.selectingTexture = true;
        };
        this.applyTexture = id => {
            if (id === -1) {
                this.asset.texture = -1;
            } else {
                const asset = resources.getById('texture,skeleton', id);
                // Set template's name to match the texture's one
                // if user haven't specified their own yet.
                if (this.asset.name === 'NewTemplate') {
                    this.asset.name = asset.name;
                }
                if (asset.type === 'texture') {
                    this.asset.texture = id;
                    this.asset.skeleton = -1;
                } else {
                    this.asset.skeleton = id;
                    this.asset.texture = -1;
                }
            }
            this.selectingTexture = false;
            this.update();
        };
        this.cancelTexture = () => {
            this.selectingTexture = false;
            this.update();
        };
        this.saveAsset = () => {
            this.writeChanges();
            window.signals.trigger('templatesChanged');
            window.signals.trigger('templateChanged', this.asset.uid);
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
