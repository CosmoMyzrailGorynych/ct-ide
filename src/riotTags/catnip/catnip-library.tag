// "Properties" category
// Has a custom block display and also appears in two cases, thus moved into a mixin
mixin propsVars
    h3
        | {voc.properties}
        hover-hint(text="{voc.propertiesHint}")
    // Properties of the edited asset
    catnip-block(
        each="{prop in opts.props}"
        if="{!opts.scriptmode}"
        block="{({lib: 'core.hidden', code: 'property', values: {variableName: prop}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        oncontextmenu="{parent.onContextMenu}"
        data-blockcode="property"
        data-blockvalue="{prop}"
    )
    // Properties inherited from behaviors this asset uses
    catnip-block(
        each="{bhprop in opts.behaviorprops}"
        if="{!opts.scriptmode}"
        block="{({lib: 'core.hidden', code: 'behavior property', values: {variableName: bhprop}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        data-blockcode="behavior property"
        data-blockvalue="{bhprop}"
    )
    // Script options (exclusive for script assets)
    catnip-block(
        if="{opts.scriptmode}"
        block="{({lib: 'core.hidden', code: 'script options', values: {}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        data-blockcode="script options"
    )
    br(if="{opts.scriptmode || opts.props.length || opts.behaviorprops.length}")
    button.inline(onclick="{promptNewProperty}" if="{!opts.scriptmode}")
        svg.feather
            use(href="#plus")
        span {voc.createNewProperty}
    h3
        | {voc.variables}
        hover-hint(text="{voc.variablesHint}")
    // Variables
    catnip-block(
        each="{variable in opts.variables}"
        block="{({lib: 'core.hidden', code: 'variable', values: {variableName: variable}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        oncontextmenu="{parent.onContextMenu}"
        data-blockcode="variable"
        data-blockvalue="{variable}"
    )
    br(if="{opts.variables.length}")
    // Event variables (if any)
    catnip-block(
        each="{eventvar in opts.eventvars}"
        block="{({lib: 'core.hidden', code: 'event variable', values: {variableName: eventvar}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        data-blockcode="event variable"
        data-blockvalue="{eventvar}"
    )
    br(if="{opts.eventvars.length}")
    button.inline(onclick="{promptNewVariable}")
        svg.feather
            use(href="#plus")
        span {voc.createNewVariable}

    // Global variables
    h3
        | {voc.globalVariables}
        hover-hint(text="{voc.globalVariablesHint}")
    catnip-block(
        each="{globalvar in (currentProject.globalVars ?? [])}"
        block="{({lib: 'core.hidden', code: 'global variable', values: {variableName: globalvar}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        oncontextmenu="{parent.onContextMenu}"
        data-blockcode="global variable"
        data-blockvalue="{globalvar}"
    )
    br(if="{currentProject.globalVars.length}")
    button.inline(onclick="{promptNewGlobalVariable}")
        svg.feather
            use(href="#plus")
        span {voc.createNewGlobalVariable}
    br
    br
    // Blocks pulled from stdLib
    catnip-block(
        each="{block in categories[0].items}"
        block="{({lib: block.lib, code: block.code, values: {}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
    )
    // Blocks for content types
    h3(if="{currentProject.contentTypes.length}") {vocFull.settings.contentTypes}
    catnip-block(
        each="{contentType in currentProject.contentTypes}"
        if="{!opts.scriptmode}"
        block="{({lib: 'core.hidden', code: 'content type', values: {variableName: contentType.name}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        data-blockcode="content type"
        data-blockvalue="{contentType.name}"
    )
    // Blocks for Enumeration assets
    h3(if="{enums.length}") {capitalize(vocGlob.assetTypes.enum[2])}
    catnip-block(
        each="{enum in enums}"
        block="{({lib: 'core.hidden', code: 'enum value', values: {enumId: enum.uid, enumValue: enum.values[0]}})}"
        dragoutonly="dragoutonly"
        readonly="readonly"
        ondragstart="{parent.onVarDragStart}"
        draggable="draggable"
        ondragend="{parent.resetTarget}"
        data-blockcode="enum value"
        data-blockvalue="{enum.uid}"
    )

//-
    @attribute variables (string[])
        Array of variable names in this asset
    @attribute props (string[])
        Array of property names in this asset
    @attribute behaviorprops (string[])
        Array of property names provided by behaviors
    @attribute eventvars (string[])
        Array of variable names provided by the current event
    @attribute [scriptmode] (atomic)
        Disables some features of the editor that don't make sense for script asset type ("this" keyword and properties).
    @attribute onrename (riot function)
        A function that is called when a user renames a property or a variable.
        The function is provided with an object of this structure:
        {
            type: 'prop' | 'variable',
            from: string, // old name of the property/variable
            to: string // new name of the prop/var
        }
        The called function must apply the following changes to all the relevant blocks in an asset.
catnip-library(class="{opts.class}").flexrow
    .flexfix
        .aSearchWrap.flexfix-header
            input.wide(type="text" oninput="{search}" ref="search" onclick="{selectSearch}" value="{searchVal}")
            svg.feather
                use(href="#search")
        // Scrollable layout
        .flexfix-body(show="{!searchVal.trim()}" ref="mainpanel" if="{localStorage.scrollableCatnipLibrary === 'on'}")
            +propsVars()
            .aSpacer
            .center(if="{!showLibrary}")
                svg.feather.rotate
                    use(href="#more-horizontal")
            virtual(each="{cat in categories}" if="{showLibrary && !cat.hidden}")
                h3(ref="categories")
                    svg.feather
                        use(href="#{cat.icon || 'grid-random'}")
                    span {voc.coreLibs[cat.i18nKey] || cat.name}
                catnip-block(
                    each="{block in cat.items}"
                    block="{({lib: block.lib, code: block.code, values: {}})}"
                    dragoutonly="dragoutonly"
                    readonly="readonly"
                    ondragstart="{parent.parent.onDragStart}"
                    draggable="draggable"
                    ondragend="{parent.resetTarget}"
                )
        // Paged layout (default)
        // Properties category
        .flexfix-body(show="{!searchVal.trim()}" ref="mainpanel" if="{localStorage.scrollableCatnipLibrary !== 'on' && tab === 'propsVars'}")
            +propsVars()
        // Current category
        .flexfix-body(show="{!searchVal.trim()}" ref="mainpanel" if="{localStorage.scrollableCatnipLibrary !== 'on' && tab !== 'propsVars'}")
            h3(ref="categories" if="{!tab.hidden}")
                svg.feather
                    use(href="#{tab.icon || 'grid-random'}")
                span {voc.coreLibs[tab.i18nKey] || tab.name}
            catnip-block(
                each="{block in tab.items}"
                block="{({lib: block.lib, code: block.code, values: {}})}"
                dragoutonly="dragoutonly"
                readonly="readonly"
                ondragstart="{parent.onDragStart}"
                draggable="draggable"
                ondragend="{parent.resetTarget}"
            )
        // Searched blocks
        .flexfix-body(if="{searchVal.trim() && searchResults.length}")
            catnip-block(
                each="{block in searchResults}"
                block="{({lib: block.lib, code: block.code, values: {}})}"
                dragoutonly="dragoutonly"
                readonly="readonly"
                ondragstart="{parent.onDragStart}"
                draggable="draggable"
                ondragend="{resetTarget}"
            )
        .flexfix-body.center(if="{searchVal.trim() && !searchResults.length}")
            svg.anIllustration
                use(xlink:href="data/img/weirdFoldersIllustration.svg#illustration")
            br
            span {vocGlob.nothingToShowFiller}
    // Sidebar buttons to navigate between categories
    .catnip-library-CategoriesShortcuts.aButtonGroup.vertical
        .catnip-library-aShortcut.button(
            title="{voc.properties}"
            onclick="{localStorage.scrollableCatnipLibrary === 'on' ? scrollToTop : selectTab('propsVars')}"
            class="{active: tab === 'propsVars'}"
        )
            svg.feather.a
                use(href="#archive")
            div  {voc.properties}
        .catnip-library-aShortcut.button(
            each="{cat, ind in categories}" if="{!cat.hidden && cat.items.length}"
            title="{cat.name}"
            onclick="{localStorage.scrollableCatnipLibrary === 'on' ? scrollToCat : selectTab(cat)}"
            class="{active: tab === cat}"
        )
            svg.feather.a
                use(href="#{cat.icon || 'grid-random'}")
            div {voc.coreLibs[cat.i18nKey] || cat.name}
    context-menu(if="{contextVarName}" menu="{contextMenu}" ref="menu")
    script.
        this.namespace = 'catnip';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        // Delay the display of the library so the editor loads in quicker
        this.showLibrary = false;
        this.on('mount', () => {
            setTimeout(() => {
                this.showLibrary = true;
                this.update();
            });
        });

        const {getOfType, getById} = require('src/node_requires/resources');
        const {blocksLibrary, startBlocksTransmit, getDeclaration, setSuggestedTarget, searchBlocks, blockFromDeclaration, emptyTexture} = require('src/node_requires/catnip');
        this.categories = blocksLibrary;

        this.enums = getOfType('enum');
        const updateEnums = () => {
            this.enums = getOfType('enum');
            this.update();
        };
        const update = () => this.update();
        window.signals.on('enumCreated', updateEnums);
        window.signals.on('enumRemoved', updateEnums);
        window.signals.on('enumChanged', updateEnums);
        window.signals.on('rerenderCatnipLibrary', update);
        this.on('unmount', () => {
            window.signals.off('enumCreated', updateEnums);
            window.signals.off('enumRemoved', updateEnums);
            window.signals.off('enumChanged', updateEnums);
            window.signals.off('rerenderCatnipLibrary', update);
        });

        this.onDragStart = e => {
            const {block} = e.item;
            const declaration = getDeclaration(block.lib, block.code);
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.setData(`ctjsblocks/${declaration.type}`, 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            startBlocksTransmit([blockFromDeclaration(declaration)], this.opts.blocks, false, true);
            const bounds = e.target.getBoundingClientRect();
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
        };
        this.onVarDragStart = e => {
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.setData('ctjsblocks/computed', 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            const bounds = e.target.getBoundingClientRect();
            const code = e.currentTarget.getAttribute('data-blockcode');
            const value = e.currentTarget.getAttribute('data-blockvalue');
            const values = {};
            if (code !== 'enum value') {
                values.variableName = value;
            } else {
                values.enumId = value;
                [values.enumValue] = getById('enum', value).values;
            }
            startBlocksTransmit([{
                lib: 'core.hidden',
                code,
                values
            }], this.opts.blocks, false, true);
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
        };
        this.resetTarget = () => {
            setSuggestedTarget();
        };

        this.tab = 'propsVars';
        this.selectTab = tab => () => {
            this.tab = tab;
            if (this.searchVal.trim()) {
                this.searchVal = '';
            }
        };

        const ease = x => 1 - ((1 - x) ** 5);
        this.scrollToCat = e => {
            if (this.searchVal.trim()) {
                this.searchVal = '';
                this.update();
            }
            const {ind} = e.item;
            let a = 0;
            const timePrev = Number(new Date()),
                  startScroll = this.refs.mainpanel.scrollTop,
                  targetScroll = this.refs.categories[ind].offsetTop;
            const scrollToCategory = () => {
                a += (Number(new Date()) - timePrev) / 1000;
                if (a > 1) {
                    a = 1;
                } else {
                    window.requestAnimationFrame(scrollToCategory);
                }
                const b = ease(a);
                this.refs.mainpanel.scrollTo(0, startScroll * (1 - b) + targetScroll * b);
            };
            scrollToCategory();
        };
        this.scrollToTop = () => {
            if (this.searchVal.trim()) {
                this.searchVal = '';
                this.update();
            }
            let a = 0;
            const timePrev = Number(new Date()),
                  startScroll = this.refs.mainpanel.scrollTop,
                  targetScroll = 0;
            const scrollToCategory = () => {
                a += (Number(new Date()) - timePrev) / 1000;
                if (a > 1) {
                    a = 1;
                } else {
                    window.requestAnimationFrame(scrollToCategory);
                }
                const b = ease(a);
                this.refs.mainpanel.scrollTo(0, startScroll * (1 - b) + targetScroll * b);
            };
            scrollToCategory();
        };

        this.searchVal = '';
        this.search = e => {
            this.searchVal = e.target.value;
            if (this.searchVal.trim()) {
                this.searchResults = searchBlocks(this.searchVal.trim());
            }
        };
        this.selectSearch = () => {
            this.refs.search.select();
        };

        const variableNamePattern = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
        this.promptNewProperty = () => {
            window.alertify.prompt(this.voc.newPropertyPrompt)
            .then(e => {
                const val = e.inputValue;
                if (!val || !val.trim()) {
                    return;
                }
                this.opts.props.push(val.trim());
                this.update();
            });
        };
        this.promptNewVariable = () => {
            window.alertify.prompt(this.voc.newVariablePrompt)
            .then(e => {
                let val = e.inputValue;
                if (!val || !val.trim()) {
                    return;
                }
                val = val.trim();
                if (!variableNamePattern.exec(val)) {
                    window.alertify.error(this.voc.invalidVarNameError);
                    return;
                }
                this.opts.variables.push(val.trim());
                this.update();
            });
        };
        this.promptNewGlobalVariable = () => {
            window.alertify.prompt(this.voc.newGlobalVariablePrompt)
            .then(e => {
                let val = e.inputValue;
                if (!val || !val.trim()) {
                    return;
                }
                val = val.trim();
                if (!variableNamePattern.exec(val)) {
                    window.alertify.error(this.voc.invalidVarNameError);
                    return;
                }
                window.currentProject.globalVars ??= [];
                window.currentProject.globalVars.push(val);
                this.update();
            });
        };
        this.contextVarName = false;
        this.onContextMenu = e => {
            e.preventDefault();
            e.stopPropagation();
            this.contextVarName = e.currentTarget.getAttribute('data-blockvalue');
            this.contextType = e.currentTarget.getAttribute('data-blockcode');
            this.update();
            this.refs.menu.popup(e.clientX, e.clientY);
        };
        this.contextMenu = {
            opened: true,
            items: [{
                label: this.vocGlob.rename,
                icon: 'edit',
                click: () => {
                    window.alertify.defaultValue(this.contextVarName);
                    window.alertify.prompt(this.contextType === 'property' ? this.voc.renamePropertyPrompt : this.voc.renameVariablePrompt)
                    .then(e => {
                        window.alertify.reset();
                        let val = e.inputValue;
                        if (!val || !val.trim()) {
                            return;
                        }
                        val = val.trim();
                        if (this.contextType !== 'global variable') {
                            const editedArray = this.contextType === 'property' ? this.opts.props : this.opts.variables;
                            const ind = editedArray.indexOf(this.contextVarName);
                            editedArray.splice(ind, 1, val);
                            this.opts.onrename({
                                type: this.contextType,
                                from: this.contextVarName,
                                to: val
                            });
                        } else {
                            // Global variables need to be patched across all the project;
                            // this is done by a listener in src/node_requires/catnip/index
                            window.alertify.log(this.voc.renamingAcrossProject);
                            window.orders.trigger('catnipGlobalVarRename', {
                                type: 'global variable',
                                from: this.contextVarName,
                                to: val
                            });
                            const ind = window.currentProject.globalVars.indexOf(this.contextVarName);
                            window.currentProject.globalVars.splice(ind, 1, val);
                            this.update();
                        }
                    });
                }
            }, {
                type: 'separator'
            }, {
                label: this.vocGlob.delete,
                icon: 'trash',
                click: () => {
                    if (this.contextType === 'property') {
                        this.opts.props.splice(this.opts.props.indexOf(this.contextVarName), 1);
                    } else if (this.contextType === 'variable') {
                        this.opts.variables.splice(this.opts.variables.indexOf(this.contextVarName), 1);
                    } else {
                        const arr = window.currentProject.globalVars;
                        arr.splice(arr.indexOf(this.contextVarName, 1));
                    }
                    this.contextVarName = false;
                    this.update();
                }
            }]
        };

        if (!this.opts.onrename) {
            throw new Error('[catnip-library] `onrename` attribute was not specified.');
        }
