//-
    @attribute block (IBlock)
        The block from the block script that is rendered
    @atribute [nodrag] (atomic)
        Prohibits dragging this block
    @attribute [readonly] (atomic)
        Prohibits editing this block and all its nested blocks

catnip-block(
    draggable="{!opts.nodrag}"
    class="{error: !declaration} {declaration.type} {declaration.typeHint} {opts.class} {declaration.customClass} {selected: isSelected()}"
    hide="{getHidden}"
    title="{voc.blockDocumentation[declaration.documentationI18nKey] || localizeField(declaration, 'documentation')}"
)
    svg.feather(if="{!declaration}")
        use(xlink:href="#x")
    span(if="{!declaration}") {voc.errorBlock} "{opts.block.lib}" — {opts.block.code}. {voc.errorBlockDeleteHint}

    .flexrow.wide(if="{declaration.isGroup}")
        button.inline.square.nogrow(onclick="{toggleGroupOpened}")
            svg.feather
                use(xlink:href="#{opts.block.groupClosed ? 'chevron-right' : 'chevron-down'}")
        input.catnip-block-aGroupName(
            type="text" readonly="{opts.readonly}"
            value="{opts.block.groupName}" onchange="{setGroupName}"
            placeholder="{voc.unnamedGroup}"
            onclick="{stopPropagation}"
        )

    svg.feather(if="{declaration && declaration.icon && !declaration.hideIcon}")
        use(xlink:href="#{declaration.icon}")
    span.catnip-block-aTextLabel(
        if="{declaration && !declaration.hideLabel}"
        title="{(voc.blockDisplayNames[declaration.displayI18nKey] || voc.blockNames[declaration.i18nKey] || localizeField(declaration, 'displayName') || localizeField(declaration, 'name'))}"
    )
        | {(voc.blockDisplayNames[declaration.displayI18nKey] || voc.blockNames[declaration.i18nKey] || localizeField(declaration, 'displayName') || localizeField(declaration, 'name'))}
    virtual(each="{piece in declaration.pieces}" if="{declaration && !opts.block.groupClosed}")
        span.catnip-block-aTextLabel(if="{piece.type === 'label'}" title="{voc.blockLabels[piece.i18nKey]  || localizeField(piece, 'name')}") {voc.blockLabels[piece.i18nKey]  || localizeField(piece, 'name')}
        span.catnip-block-aTextLabel(if="{piece.type === 'propVar'}" title="{parent.opts.block.values.variableName}") {parent.opts.block.values.variableName}
        span.catnip-block-aTextLabel(if="{piece.type === 'enumValue'}" title="{getName('enum', parent.opts.block.values.enumId)}") {getName('enum', parent.opts.block.values.enumId)}
        select.catnip-block-aDropdown(if="{piece.type === 'enumValue'}" onchange="{writeEnumValue}" disabled="{parent.opts.readonly}")
            option(
                each="{option in getEnumValues(parent.opts.block.values.enumId)}"
                value="{option}" selected="{option === getValue('enumValue')}"
            ) {option}
        svg.feather(if="{piece.type === 'icon'}")
            use(xlink:href="#{piece.icon}")
        span.catnip-block-anAsyncMarker(if="{piece.type === 'asyncMarker'}" title="{voc.asyncHint}")
            svg.feather
                use(xlink:href="#clock")
        .catnip-block-aFiller(if="{piece.type === 'filler'}")
        .catnip-block-aBreak(if="{piece.type === 'break'}")
        catnip-js-editor(
            if="{piece.type === 'code'}"
            readonly="{parent.opts.readonly}"
            values="{parent.opts.block.values}"
            key="{piece.key}"
        )
        textarea(
            readonly="{parent.opts.readonly}"
            if="{piece.type === 'textbox'}"
            value="{getValue(piece.key)}"
            onclick="{parent.stopPropagation}"
            oninput="{parent.updateTextareas}"
            onchange="{parent.writeConstantVal}"
            placeholder="{piece.key}"
            ref="textareas"
        )
        .catnip-block-Blocks(if="{piece.type === 'blocks'}" ref="blocksDrop")
            catnip-block-list(
                blocks="{getValue(piece.key)}"
                showplaceholder="showplaceholder"
                placeholder="{piece.placeholder}"
                readonly="{parent.opts.readonly}"
            )
        // Options
        .catnip-block-Options(if="{piece.type === 'options'}")
            .catnip-block-anOptionsToggle(onclick="{toggleShowOptions}")
                svg.feather
                    use(xlink:href="#chevron-{openOptions ? 'up' : 'down'}")
                span {voc.optionsAdvanced}
                svg.feather
                    use(xlink:href="#chevron-{openOptions ? 'up' : 'down'}")
            // Options defined by the block itself
            dl(if="{openOptions}" each="{option in piece.options}")
                dt
                    | {voc.blockOptions[option.i18nKey] || option.name || option.key}
                    span(if="{option.required}") *
                dd
                    catnip-block(
                        if="{getValue(option.key) && (typeof getValue(option.key)) === 'object'}"
                        class="{option.typeHint}"
                        block="{getValue(option.key)}"
                        readonly="{parent.parent.opts.readonly}"
                        ondragstart="{parent.onDragStart}"
                        ondragend="{parent.onDragEnd}"
                        oncontextmenu="{parent.onContextMenu}"
                        onclick="{parent.tryMutate}"
                    )
                    input.catnip-block-aConstantInput(
                        ondrop="{parent.onDrop}"
                        ondragenter="{parent.handlePreDrop}"
                        ondragstart="{parent.handlePreDrop}"
                        onclick="{parent.tryAddBoolean}"
                        oncontextmenu="{parent.onConstContextMenu}"
                        type="text" value="{parent.getValue(option.key)}"
                        oninput="{parent.writeConstantVal}"
                        placeholder="{option.key}"
                        if="{!option.assets && (!getValue(option.key) || (typeof getValue(option.key)) !== 'object')}"
                        class="{option.typeHint} {invalid: parent.getIsInvalid(option)}"
                        title="{parent.getIsInvalid(option) ? parent.voc.requiredField : ''}"
                        readonly="{parent.parent.opts.readonly}"
                        style="width: {(getValue(option.key) !== (void 0)) ? Math.min((''+getValue(option.key)).length + 0.5, 32) : option.key.length + 0.5}ch"
                    )
                    span.catnip-block-aConstantInput.menu(
                        ondrop="{parent.onDrop}"
                        ondragenter="{parent.handlePreDrop}"
                        ondragstart="{parent.handlePreDrop}"
                        if="{option.assets && (!getValue(option.key) || (typeof getValue(option.key)) !== 'object')}"
                        class="{option.typeHint} {invalid: parent.isInvalid(option)}"
                        title="{parent.getIsInvalid(piece) ? parent.voc.requiredField : ''}"
                        onclick="{!parent.parent.opts.readonly && promptAsset}"
                    )
                        svg.feather(if="{!getValue(option.key)}")
                            use(xlink:href="#search")
                        span(if="{!getValue(option.key)}") {vocGlob.selectDialogue}
                        svg.feather(if="{getValue(option.key) && option.assets === 'action'}")
                            use(xlink:href="#airplay")
                        svg.feather(if="{getValue(option.key) && option.assets !== 'action' && areThumbnailsIcons(option.assets)}")
                            use(xlink:href="#{getThumbnail(option.assets, getValue(option.key))}")
                        thumbnail-loader(
                            if="{getValue(option.key) && option.assets !== 'action' && !areThumbnailsIcons(option.assets)}"
                            asset="{getValue(option.key)}"
                            class="{soundthumbnail: option.assets === 'sound'}"
                        )
                        span(if="{getValue(option.key) && option.assets !== 'action'}") {getName(option.assets, getValue(option.key))}
                        span(if="{getValue(option.key) && option.assets === 'action'}") {getValue(option.key)}
            // User-defined options
            dl(if="{openOptions && piece.allowCustom && parent.opts.block.customOptions}" each="{value, key in parent.opts.block.customOptions}")
                dt
                    input.catnip-block-aConstantInput.string(
                        type="text" value="{key}"
                        onchange="{parent.writeOptionKey}"
                        readonly="{parent.parent.opts.readonly}"
                        style="width: {Math.min(key.length + 0.5, 32)}ch"
                        class="{invalid: !key}"
                    )
                dd
                    .toright.anActionableIcon(onclick="{parent.removeCustomOption}")
                        svg.feather.red
                            use(xlink:href="#delete")
                    catnip-block(
                        if="{getCustomValue(key) && (typeof getCustomValue(key)) === 'object'}"
                        block="{getCustomValue(key)}"
                        readonly="{parent.parent.opts.readonly}"
                        ondragstart="{parent.onOptionDragStart}"
                        ondragend="{parent.onOptionDragEnd}"
                        oncontextmenu="{parent.onContextMenu}"
                        onclick="{parent.tryMutateCustomOption}"
                    )
                    input.catnip-block-aConstantInput.wildcard(
                        ondrop="{parent.onOptionDrop}"
                        ondragenter="{parent.handlePreDrop}"
                        ondragstart="{parent.handlePreDrop}"
                        type="text" value="{value}"
                        onchange="{parent.writeOption}"
                        oncontextmenu="{parent.onConstContextMenu}"
                        placeholder="{key}"
                        if="{!value || typeof value !== 'object'}"
                        readonly="{parent.parent.opts.readonly}"
                        style="width: {Math.min((value !== void 0) ? value.length + 0.5 : 5, 32)}ch"
                    )
            .pad(if="{openOptions && piece.allowCustom}")
                button.inline.small(onclick="{addCustomOption}")
                    svg.feather
                        use(xlink:href="#plus")
                    span {voc.addCustomOption}
        // Arguments
        catnip-block(
            if="{piece.type === 'argument' && getValue(piece.key) && (typeof getValue(piece.key)) === 'object'}"
            class="{piece.typeHint}"
            block="{getValue(piece.key)}"
            readonly="{parent.opts.readonly}"
            ondragstart="{parent.onDragStart}"
            ondragend="{parent.onDragEnd}"
            oncontextmenu="{parent.onContextMenu}"
            onclick="{parent.tryMutate}"
        )
        input.catnip-block-aConstantInput(
            ondrop="{parent.onDrop}"
            ondragenter="{parent.handlePreDrop}"
            ondragstart="{parent.handlePreDrop}"
            type="text" value="{parent.getValue(piece.key)}"
            oninput="{parent.writeConstantVal}"
            onclick="{tryColorPicker}"
            oncontextmenu="{parent.onConstContextMenu}"
            placeholder="{piece.key}"
            if="{piece.type === 'argument' && !piece.assets && (!getValue(piece.key) || (typeof getValue(piece.key)) !== 'object')}"
            class="{piece.typeHint} {invalid: parent.getIsInvalid(piece)}"
            title="{parent.getIsInvalid(piece) ? parent.voc.requiredField : ''}"
            readonly="{parent.opts.readonly}"
            style="\
                width: {(getValue(piece.key) !== (void 0)) ? Math.min((''+getValue(piece.key)).length + 0.5, 32) : piece.key.length + 0.5}ch;\
                {(piece.typeHint === 'color' && getValue(piece.key)) ? 'background-color: ' + getValue(piece.key) + ';' : ''}\
                {(piece.typeHint === 'color' && getValue(piece.key)) ? 'border-color: ' + getValue(piece.key) + ';' : ''}\
                {(piece.typeHint === 'color' && getValue(piece.key)) ? 'color: ' + (brehautColor(getValue(piece.key)).getLightness() > 0.5 ? 'black' : 'white') + ';' : ''}\
            "
        )
        span.catnip-block-aConstantInput.menu(
            ondrop="{parent.onDrop}"
            ondragenter="{parent.handlePreDrop}"
            ondragstart="{parent.handlePreDrop}"
            if="{piece.type === 'argument' && piece.assets && (!getValue(piece.key) || (typeof getValue(piece.key)) !== 'object')}"
            class="{piece.typeHint} {invalid: parent.getIsInvalid(piece)}"
            title="{parent.getIsInvalid(piece) ? parent.voc.requiredField : ''}"
            onclick="{!parent.opts.readonly && promptAsset}"
        )
            svg.feather(if="{!getValue(piece.key)}")
                use(xlink:href="#search")
            span(if="{!getValue(piece.key)}") {vocGlob.selectDialogue}
            svg.feather(if="{getValue(piece.key) && piece.assets === 'action'}")
                use(xlink:href="#airplay")
            svg.feather(if="{getValue(piece.key) && piece.assets !== 'action' && areThumbnailsIcons(piece.assets)}")
                use(xlink:href="#{getThumbnail(piece.assets, getValue(piece.key))}")
            thumbnail-loader(
                if="{getValue(piece.key) && piece.assets !== 'action' && !areThumbnailsIcons(piece.assets)}"
                asset="{getValue(piece.key)}"
                class="{soundthumbnail: piece.assets === 'sound'}"
            )
            span(if="{getValue(piece.key) && piece.assets !== 'action'}") {getName(piece.assets, getValue(piece.key))}
            span(if="{getValue(piece.key) && piece.assets === 'action'}") {getValue(piece.key)}
    context-menu(draggable="true" ondragstart="{preventDrag}" if="{contextPiece || contextOption}" menu="{contextMenu}" ref="menu")
    context-menu(draggable="true" ondragstart="{preventDrag}" if="{selectingAction}" menu="{actionsMenu}" ref="actionsmenu")
    asset-selector(
        draggable="true" ondragstart="{preventDrag}"
        if="{selectingAssetType}"
        assettypes="{selectingAssetType}"
        onselected="{selectAsset}"
        oncancelled="{cancelAssetSelection}"
    )
    .aDimmer(if="{colorValue}" draggable="true" ondragstart="{preventDrag}")
        color-picker(
            hidealpha="hidealpha"
            onapply="{applyColorValue}"
            oncancel="{closeColorPicker}"
            color="{opts.block.values[colorValue]}"
        )
    script.
        this.namespace = 'catnip';
        this.mixin(require('src/lib/riotMixins/voc').default);

        const {getDeclaration, getMenuMutators, mutate, getTransmissionType, getTransmissionReturnVal, startBlocksTransmit, endBlocksTransmit, setSuggestedTarget, emptyTexture, copy, canPaste, paste, isSelected} = require('src/lib/catnip');
        this.isSelected = () => isSelected(this.opts.block);
        const {getById, areThumbnailsIcons, getThumbnail} = require('src/lib/resources');
        this.getName = (assetType, id) => getById(assetType, id).name;
        this.getEnumValues = id => getById('enum', id).values;
        this.areThumbnailsIcons = areThumbnailsIcons;
        this.getThumbnail = (assetType, id) => getThumbnail(getById(assetType, id), false, false);
        this.localizeField = require('src/lib/i18n').localizeField;

        try {
            this.declaration = getDeclaration(this.opts.block.lib, this.opts.block.code);
        } catch (e) {
            console.error(e);
            this.declaration = false;
        }
        let oldBlock = this.opts.block;
        this.on('update', () => {
            if (oldBlock !== this.opts.block) {
                try {
                    this.declaration = getDeclaration(this.opts.block.lib, this.opts.block.code);
                } catch (e) {
                    console.error(e);
                    this.declaration = false;
                }
                oldBlock = this.opts.block;
            }
        });
        this.getValue = key => this.opts.block.values[key];
        this.getCustomValue = key => this.opts.block.customOptions[key];
        // A random ID that is used during block tree traversal
        // to prevent putting a block into itself or its children.
        this.getIsInvalid = piece => {
            if (this.opts.readonly || !piece.required) {
                return false;
            }
            const val = this.getValue(piece.key);
            if (val === void 0) {
                return true;
            }
            if (piece.typeHint === 'number' && !Number.isFinite(Number(val))) {
                return true;
            }
            return false;
        };
        this.id = require('src/lib/generateGUID')();

        this.dragging = false;

        this.getHidden = () => this.dragging;
        this.stopPropagation = e => e.stopPropagation();

        this.setGroupName = e => {
            this.opts.block.groupName = e.target.value.trim();
        };
        this.toggleGroupOpened = e => {
            if (this.opts.readonly) {
                e.preventUpdate();
                return;
            }
            this.opts.block.groupClosed = !this.opts.block.groupClosed;
            e.stopPropagation();
        };

        this.onDragStart = e => {
            this.update();
            const sourcePiece = e.item.option || e.item.piece;
            let block;
            try { // Prevent dragging broken blocks
                block = this.opts.block.values[sourcePiece.key];
                getDeclaration(block.lib, block.code);
            } catch (oO) {
                e.stopPropagation();
                e.preventDefault();
                e.preventUpdate = true;
                return;
            }
            e.dataTransfer.setData('ctjsblocks/computed', 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            const bounds = e.target.getBoundingClientRect();
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
            startBlocksTransmit(
                [this.opts.block.values[sourcePiece.key]],
                this.opts.block.values, sourcePiece.key
            );
            e.stopPropagation();
            this.hoveredOver = null;
        };
        this.onDragEnd = () => {
            setSuggestedTarget();
        };

        this.writeConstantVal = e => {
            const piece = e.item.option || e.item.piece;
            let val = e.target.value;
            if (piece.typeHint === 'number') {
                val = Number(e.target.value) || 0;
            } else if (piece.typeHint === 'boolean') {
                val = val.trim() === 'true';
            } else if (piece.typeHint === 'wildcard' && Number.isFinite(Number(e.target.value))) {
                val = Number(e.target.value);
            }
            this.opts.block.values[piece.key] = val;
        };
        this.writeEnumValue = e => {
            this.opts.block.values.enumValue = e.target.value;
        };
        // Clicking on empty boolean fields automatically puts a constant boolean
        this.tryAddBoolean = e => {
            e.stopPropagation();
            const piece = e.item.option || e.item.piece;
            if (piece.typeHint === 'boolean') {
                this.opts.block.values[piece.key] = {
                    lib: 'core.logic',
                    code: 'true',
                    values: {}
                };
            } else {
                e.preventUpdate = false;
            }
        };
        // Mutating on click
        // If a click mutator is specified in block's declaration, it replaces one block with another
        this.tryMutate = e => {
            e.stopPropagation();
            const piece = e.item.option || e.item.piece;
            const targetBlock = this.opts.block.values[piece.key];
            const blockDeclaration = getDeclaration(targetBlock.lib, targetBlock.code);
            if (blockDeclaration.onClickMutator) {
                const {lib, code} = blockDeclaration.onClickMutator;
                mutate(this.opts.block, piece.key, {
                    lib,
                    code
                });
                this.update();
            } else {
                e.preventUpdate = true;
            }
        };
        this.tryMutateCustomOption = e => {
            e.stopPropagation();
            const {key} = e.item;
            const targetBlock = this.opts.block.customOptions[key];
            const blockDeclaration = getDeclaration(targetBlock.lib, targetBlock.code);
            if (blockDeclaration.onClickMutator) {
                const {lib, code} = blockDeclaration.onClickMutator;
                mutate(this.opts.block, key, {
                    lib,
                    code
                }, true);
                this.update();
            } else {
                e.preventUpdate = true;
            }
        };
        this.removeCustomOption = e => {
            e.stopPropagation();
            const {key} = e.item;
            const opts = this.opts.block.customOptions;
            delete opts[key];
        };

        const isInvalidDrop = e =>
            this.opts.readonly || !e.dataTransfer.types.includes('ctjsblocks/computed');
        this.handlePreDrop = e => {
            if (!isInvalidDrop(e)) {
                e.preventUpdate = true;
                e.preventDefault(); // Tells that we do want to accept the drop
            }
        };
        this.onDrop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            // Disallow commands
            if (getTransmissionType() !== 'computed') {
                e.preventUpdate = true;
                return;
            }
            const piece = e.item.option || e.item.piece;

            // Disallow non-matching types
            if (piece.typeHint !== 'wildcard' &&
                getTransmissionReturnVal() !== 'wildcard' &&
                piece.typeHint !== getTransmissionReturnVal()
            ) {
                e.preventUpdate = true;
                return;
            }
            this.hoveredOver = null;
            e.preventDefault();
            e.stopPropagation();
            endBlocksTransmit(this.opts.block.values, piece.key);
        };


        // Automatic height for textareas
        this.updateTextareas = e => {
            if (e) {
                e.preventUpdate = true;
            }
            const textareas = Array.isArray(this.refs.textareas) ?
                this.refs.textareas :
                [this.refs.textareas];
            for (const textarea of textareas) {
                if (!textarea) {
                    continue;
                }
                textarea.style.height = '1px';
                textarea.style.height = (textarea.scrollHeight) + 'px';
            }
        };
        this.on('mount', () => {
            this.updateTextareas();
        });

        const deleteMenuItem = {
            label: this.vocGlob.delete,
            icon: 'trash',
            click: () => {
                if (this.contextOption) {
                    this.opts.block.customOptions[this.contextOption] = void 0;
                    this.contextOption = false;
                } else {
                    delete this.opts.block.values[this.contextPiece.key];
                    this.contextPiece = false;
                }
                this.update();
            }
        };
        const defaultMenuItems = [{
            label: this.vocGlob.copy,
            icon: 'copy',
            click: () => {
                if (this.contextOption) {
                    copy([this.getCustomValue(this.contextOption)]);
                    this.contextOption = false;
                    return;
                }
                if (this.contextPiece) {
                    copy([this.getValue(this.contextPiece.key)]);
                    this.contextPiece = false;
                }
            }
        }, {
            label: this.vocGlob.paste,
            icon: 'clipboard',
            if: () => {
                if (this.contextOption) {
                    return canPaste('wildcard');
                }
                if (this.contextPiece) {
                    return canPaste(this.contextPiece.typeHint);
                }
                return false;
            },
            click: () => {
                if (this.contextOption) {
                    paste(this.opts.block, this.contextOption, true);
                    this.contextOption = false;
                } else {
                    paste(this.opts.block, this.contextPiece.key);
                    this.contextPiece = false;
                }
                this.update();
            }
        }, {
            type: 'separator'
        }, deleteMenuItem];
        this.contextMenu = {
            opened: true,
            items: defaultMenuItems
        };
        this.contextPiece = this.contextOption = false;
        this.onContextMenu = e => {
            // Room events are displayed in a modal
            // and we need to differ them from other modals
            const roomEvents = Boolean(e.target.closest('room-events-editor'));
            if (roomEvents) {
                // Get the closest .aModal and go two elements higher
                // as room-events-editor has .aModal as its direct child.
                if (e.target.closest('.aModal').parentElement.parentElement.closest('room-events-editor')) {
                    e.preventUpdate = true;
                    return;
                }
            } else if (e.target.closest('.aModal')) {
                e.preventUpdate = true;
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            // Options and arguments
            const piece = e.item.option || e.item.piece;
            let key;
            if (!piece) { // Handle user-defined options
                ({key} = e.item);
                this.contextOption = key;
            } else {
                ({key} = piece);
                this.contextPiece = piece;
            }
            const block = this.opts.block[piece ? 'values' : 'customOptions'][key];
            try {
                getDeclaration(block.lib, block.code);
                const mutators = getMenuMutators(block, affixedData => {
                    mutate(this.opts.block, key, affixedData.mutator, !piece);
                    this.contextOption = this.contextPiece = false;
                    this.update();
                });
                if (mutators) {
                    this.contextMenu.items = [
                        ...mutators,
                        {
                            type: 'separator'
                        },
                        ...defaultMenuItems
                    ];
                } else {
                    this.contextMenu.items = defaultMenuItems;
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('Showing only a "Delete" option in the context menu as an error was faced while getting mutators.', e);
                this.contextMenu.items = [deleteMenuItem];
            }
            this.update();
            this.refs.menu.popup(e.clientX, e.clientY);
        };

        // Separate context menu for constant variables
        const constContextMenuItems = [{
            label: this.vocGlob.paste,
            icon: 'clipboard',
            click: () => {
                if (this.contextOption) {
                    paste(this.opts.block, this.contextOption, true);
                    this.contextOption = false;
                } else {
                    paste(this.opts.block, this.contextPiece.key);
                    this.contextPiece = false;
                }
                this.update();
            }
        }];
        this.onConstContextMenu = e => {
            if (this.opts.readonly || e.target.closest('.aModal') || e.target.closest('.aDimmer')) {
                e.preventUpdate = true;
                return;
            }
            // Options and arguments
            const piece = e.item.option || e.item.piece;
            if (!piece) { // Handle user-defined options
                if (!canPaste('wildcard')) {
                    e.preventUpdate = true;
                    return;
                }
                this.contextOption = e.item.key;
            } else {
                if (!canPaste(piece.typeHint)) {
                    e.preventUpdate = true;
                    return;
                }
                this.contextPiece = piece;
            }
            e.preventDefault();
            e.stopPropagation();
            this.contextMenu.items = constContextMenuItems;
            this.update();
            this.refs.menu.popup(e.clientX, e.clientY);
        };

        // Arguments with `assets` field
        this.selectingAssetType = this.selectingAssetPiece = false;
        this.promptAsset = e => {
            e.stopPropagation();
            const {piece} = e.item;
            if (piece.assets === 'action') {
                this.selectingAction = true;
                this.actionsMenu = {
                    opened: true,
                    items: [
                        ...window.currentProject.actions.map(action => ({
                            label: action.name,
                            icon: 'airplay',
                            click: () => {
                                this.opts.block.values[piece.key] = action.name;
                                this.update();
                                this.selectingAction = false;
                            }
                        })),
                        {
                            icon: 'external-link',
                            label: this.voc.goToActions,
                            click: () => {
                                window.orders.trigger('openActions');
                            }
                        }
                    ]
                };
                this.update();
                this.refs.actionsmenu.popup(e.clientX, e.clientY);
            } else {
                this.selectingAssetType = piece.assets;
                this.selectingAssetPiece = piece;
            }
        };
        this.selectAsset = id => {
            this.opts.block.values[this.selectingAssetPiece.key] = id;
            this.selectingAssetType = this.selectingAssetPiece = false;
            this.update();
        };
        this.cancelAssetSelection = () => {
            this.selectingAssetType = this.selectingAssetPiece = false;
            this.update();
        };

        // Tags with advanced options
        this.openOptions = false;
        this.toggleShowOptions = e => {
            this.openOptions = !this.openOptions;
            e.stopPropagation();
        };

        // User-defined advanced options
        this.addCustomOption = e => {
            if (!this.opts.block.customOptions) {
                this.opts.block.customOptions = {};
            }
            let namePostfix = 0;
            while (`key${namePostfix}` in this.opts.block.customOptions) {
                namePostfix++;
            }
            this.opts.block.customOptions[`key${namePostfix}`] = '';
            e.stopPropagation();
        };
        this.writeOptionKey = e => {
            const oldKey = e.item.key,
                  oldVal = this.opts.block.customOptions[oldKey];
            const newKey = e.target.value.trim();
            delete this.opts.block.customOptions[oldKey];
            this.opts.block.customOptions[newKey] = oldVal;
        };
        this.writeOption = e => {
            const {key} = e.item;
            this.opts.block.customOptions[key] = e.target.value.trim();
        };
        this.onOptionDragStart = e => {
            let block;
            try { // Prevent dragging broken blocks
                block = this.opts.block.customOptions[e.item.key];
                getDeclaration(block.lib, block.code);
            } catch (oO) {
                e.stopPropagation();
                e.preventDefault();
                e.preventUpdate = true;
                return;
            }
            e.dataTransfer.setData('ctjsblocks/computed', 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            const bounds = e.target.getBoundingClientRect();
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
            startBlocksTransmit(
                [this.opts.block.customOptions[e.item.key]],
                this.opts.block.customOptions,
                e.item.key,
                true
            );
            e.stopPropagation();
            this.hoveredOver = null;
        };
        this.onOptionDrop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            // Disallow commands
            if (getTransmissionType() !== 'computed') {
                e.preventUpdate = true;
                return;
            }
            this.hoveredOver = null;
            e.preventDefault();
            e.stopPropagation();
            endBlocksTransmit(this.opts.block.customOptions, e.item.key);
        };
        // Do not delete the property when moving a block out, recreate the property
        this.onOptionDragEnd = e => {
            setSuggestedTarget();
            this.opts.block.customOptions[e.item.key] = '';
        };

        // Color inputs
        this.colorValue = false;
        this.applyColorValue = color => {
            this.opts.block.values[this.colorValue] = color;
            this.closeColorPicker();
        };
        this.closeColorPicker = () => {
            this.colorValue = false;
            this.update();
        };
        this.tryColorPicker = e => {
            const {piece} = e.item;
            if (piece.typeHint === 'color') {
                e.target.blur();
                this.colorValue = piece.key;
                e.stopPropagation();
            } else {
                this.tryAddBoolean(e);
            }
        };

        this.preventDrag = e => {
            e.stopPropagation();
            e.preventDefault();
            e.preventUpdate = true;
        };
