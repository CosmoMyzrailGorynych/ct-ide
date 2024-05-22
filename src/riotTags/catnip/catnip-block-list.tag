//-
    @attribute blocks (BlockScript)
    @attribute [placeholder] (Array<IBlockPieceLabel | IBlockPieceIcon>)
    @attribute [showplaceholder] (atomic)
    @attribute [readonly] (atomic)
catnip-block-list(
    ondragenter="{handlePreDrop}"
    ondragover="{handlePreDrop}"
    ondrop="{onDrop}"
)
    catnip-insert-mark(
        if="{opts.blocks}"
        list="{opts.blocks}" pos="-1"
        ondrop="{onDropTop}"
        oncontextmenu="{onContextMenuInstertMark}"
    )
    .catnip-block-aBlockPlaceholder(if="{opts.showplaceholder && (!opts.blocks || !opts.blocks.length)}")
        svg.feather(if="{opts.placeholder === 'doNothing'}")
            use(xlink:href="#thumbs-up")
        span.catnip-block-aTextLabel(if="{opts.placeholder === 'doNothing'}") {voc.placeholders.doNothing}
        svg.feather(if="{!opts.placeholder || opts.placeholder === 'putBlocksHere'}")
            use(xlink:href="#button")
        span.catnip-block-aTextLabel(if="{!opts.placeholder || opts.placeholder === 'putBlocksHere'}") {voc.placeholders.putBlocksHere}
    virtual(each="{block, ind in opts.blocks}")
        catnip-block(
            block="{block}"
            ondragstart="{parent.onDragStart}"
            ondragend="{parent.onDragEnd}"
            readonly="{parent.opts.readonly}"
            oncontextmenu="{parent.onContextMenu}"
            ref="blocks"
            onclick="{parent.manageSelection}"
        )
        catnip-insert-mark(
            if="{!opts.readonly}"
            ondragenter="{parent.handlePreDropInsertMark}"
            ondragover="{parent.handlePreDropInsertMark}"
            ondrop="{parent.onDropAfter}"
            oncontextmenu="{parent.onContextMenuInstertMark}"
            list="{parent.opts.blocks}"
            pos="{ind}"
        )
    context-menu(if="{contextBlock}" menu="{contextMenu}" ref="menu")
    context-menu(if="{showPasteMenu}" menu="{pasteContextMenu}" ref="pastemenu")
    script.
        this.namespace = 'catnip';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        const {getDeclaration, getMenuMutators, mutate, startBlocksTransmit, endBlocksTransmit, getTransmissionType, getSuggestedTarget, setSuggestedTarget, emptyTexture, copy, canPaste, paste, setSelection, toggleSelection, getSelectionHTML, isSelected, removeSelectedBlocks} = require('src/node_requires/catnip');
        const {isDev} = require('src/node_requires/platformUtils');

        this.getSuggestedTarget = getSuggestedTarget;

        this.onDragStart = e => {
            this.update();
            try { // Prevent dragging broken blocks
                getDeclaration(e.item.block.lib, e.item.block.code);
            } catch (oO) {
                e.preventUpdate = true;
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData('ctjsblocks/command', 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            const bounds = e.target.getBoundingClientRect();
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
            startBlocksTransmit([e.item.block], this.opts.blocks);
            e.stopPropagation();
            this.hoveredOver = null;
        };
        this.onDragEnd = () => {
            setSuggestedTarget();
        };

        const isInvalidDrop = e =>
            this.opts.readonly || !e.dataTransfer.types.includes('ctjsblocks/command');
        this.handlePreDrop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
            } else {
                e.preventDefault(); // Tells that we do want to accept the drop
            }
        };
        this.handlePreDropInsertMark = e => {
            this.handlePreDrop(e);
            if (!isInvalidDrop(e)) {
                setSuggestedTarget(e.item.block ?? this.opts.blocks);
            }
        };
        this.onDrop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            if (getTransmissionType() !== 'command') {
                e.preventUpdate = true;
                return;
            }
            this.hoveredOver = null;
            e.preventDefault();
            e.stopPropagation();
            // Drop at the start of the script if the cursor was there
            const bounds = this.root.getBoundingClientRect();
            if (e.clientY < bounds.top + 20) {
                endBlocksTransmit(this.opts.blocks, 0);
            } else {
                endBlocksTransmit(this.opts.blocks, this.opts.blocks.length);
            }
        };
        this.onDropAfter = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            if (getTransmissionType() !== 'command') {
                e.preventUpdate = true;
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const {ind} = e.item;
            endBlocksTransmit(this.opts.blocks, ind + 1);
        };
        this.onDropTop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            if (getTransmissionType() !== 'command') {
                e.preventUpdate = true;
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            endBlocksTransmit(this.opts.blocks, 0);
        };

        this.contextBlock = false;
        const defaultItems = [{
            label: this.voc.copySelection,
            icon: 'copy',
            click: () => {
                copy([this.contextBlock]);
                this.contextBlock = false;
                this.update();
            }
        }, {
            label: this.voc.duplicateBlock,
            icon: 'copy',
            click: () => {
                this.opts.blocks.splice(
                    this.opts.blocks.indexOf(this.contextBlock),
                    0,
                    structuredClone(this.contextBlock)
                );
                this.contextBlock = false;
                this.update();
            }
        }, {
            icon: 'code',
            if: () => isDev,
            label: this.voc.copyDocHtml,
            click: () => {
                getSelectionHTML();
                this.contextBlock = false;
            }
        }, {
            type: 'separator'
        }, {
            label: this.vocGlob.delete,
            icon: 'trash',
            click: () => {
                removeSelectedBlocks();
                this.contextBlock = false;
                this.update();
            }
        }];
        this.contextMenu = {
            opened: true,
            items: defaultItems
        };
        this.onContextMenu = e => {
            if (this.opts.readonly) {
                e.preventUpdate = true;
                return;
            }
            // Prevent context modals popping up when right-clicking inside modal windows
            // like asset or color inputs.

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
            const {block, ind} = e.item;
            this.contextBlock = block;
            this.contextBlockInd = ind;
            if (!isSelected(block)) {
                const blocks = Array.isArray(this.refs.blocks) ? this.refs.blocks : [this.refs.blocks];
                setSelection(block, blocks[ind]);
            }
            try {
                getDeclaration(block.lib, block.code)
                const mutators = getMenuMutators(block, affixedData => {
                    mutate(
                        this.opts.blocks,
                        this.opts.blocks.indexOf(this.contextBlock),
                        affixedData.mutator
                    );
                    this.contextBlock = false;
                    this.update();
                });
                if (mutators) {
                    this.contextMenu.items = [
                        ...mutators,
                        {
                            type: 'separator'
                        },
                        ...defaultItems
                    ];
                } else {
                    this.contextMenu.items = defaultItems;
                }
            } catch (e) {
                this.contextMenu.items = defaultItems;
                console.warn(e);
            }
            this.update();
            this.refs.menu.popup(e.clientX, e.clientY);
        };

        // Handling right-clicking on insert marks
        let pastePosition = 0;
        this.showPasteMenu = false;
        this.pasteContextMenu = {
            opened: true,
            items: [{
                label: this.vocGlob.paste,
                icon: 'clipboard',
                click: () => {
                    paste(this.opts.blocks, pastePosition);
                    this.update();
                }
            }]
        };
        this.onContextMenuInstertMark = e => {
            if (!canPaste('script')) {
                e.preventUpdate = true;
                return;
            }
            if ('ind' in e.item) {
                pastePosition = e.item.ind + 1;
            } else {
                pastePosition = 0;
            }
            this.showPasteMenu = true;
            e.stopPropagation();
            e.preventDefault();
            this.update();
            this.refs.pastemenu.popup(e.clientX, e.clientY);
        };

        this.manageSelection = e => {
            e.preventUpdate = false; // Already gets updated in redrawSelectedBlocks
            // Skip anything that is not a left click (or another main button of the pointer)
            if (e.button !== 0) {
                return;
            }
            const {block, ind} = e.item;
            const blocks = Array.isArray(this.refs.blocks) ? this.refs.blocks : [this.refs.blocks];
            if (e.ctrlKey) {
                toggleSelection(block, blocks[ind]);
            } else {
                setSelection(block, blocks[ind]);
            }
            e.stopPropagation();
        };
