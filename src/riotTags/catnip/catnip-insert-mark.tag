//-
    Marks up an empty zone and shows a visual "insert (+)" prompt when hovered.
    Used as a dropzone for commands.

    @attribute list (BlockScript)
        The parent block list this mark is in. Used to insert blocks from search.
    @attribute pos (number)
        The position at which this mark is put in the list
catnip-insert-mark(onclick="{toggleMenu}" class="{dragover: shouldDragover(), menuopen: opened}")
    .catnip-insert-mark-aLine(if="{!opened}")
    .catnip-insert-mark-anIcon(if="{!opened}")
        svg.feather
            use(xlink:href="#plus")
    .aSearchWrap(if="{opened}")
        input.wide(
            ref="search"
            type="text" value="{searchVal}"
            oninput="{search}"
            onclick="{selectSearch}"
            onkeyup="{tryHotkeys}"
            onblur="{close}"
        )
        svg.feather
            use(href="#search")
    ul.aMenu.aPanel(class="{up: menuUp}" if="{opened && searchVal.trim() && searchResults.length}")
       li(each="{block in searchResults}" onpointerdown="{insertBlock}")
            code.toright.inline.small.dim {block.lib}
            svg.feather
                use(href="#{block.icon}")
            span {block.bakedName}
    script.
        const {searchBlocks, insertBlock, getSuggestedTarget} = require('./data/node_requires/catnip');
        this.getSuggestedTarget = getSuggestedTarget;

        this.opened = false;
        this.toggleMenu = e => {
            e.stopPropagation();
            window.signals.trigger('closeCatnipSearch');
            if (this.opened) {
                this.opened = false;
                return;
            }
            this.opened = true;
            this.menuUp = e.clientY > window.innerHeight / 2;
            this.update();
            setTimeout(() => {
                this.refs.search.select();
            }, 0);
        };
        const close = () => {
            this.opened = false;
            this.update();
        };
        this.close = () => {
            setTimeout(() => {
                this.opened = false;
                this.update();
            }, 50);
        };
        window.signals.on('closeCatnipSearch', close);
        this.on('unmount', () => {
            window.signals.off('closeCatnipSearch', close);
        });

        this.shouldDragover = () =>
            getSuggestedTarget() && (
                getSuggestedTarget() === this.opts.list ||
                getSuggestedTarget() === this.opts.list[this.opts.pos]);

        this.searchVal = '';
        this.search = e => {
            this.searchVal = e.target.value;
            if (this.searchVal.trim()) {
                this.searchResults = searchBlocks(this.searchVal.trim()).filter(b => b.type === 'command');
            }
        };
        this.selectSearch = e => {
            this.refs.search.select();
            e.stopPropagation();
        };
        this.tryHotkeys = e => {
            if (e.key === 'Escape') {
                this.opened = false;
            } else if (e.key === 'Enter') {
                if (this.searchVal.trim() && this.searchResults.length) {
                    this.insertBlock({
                        item: {
                            block: this.searchResults[0]
                        }
                    });
                }
            }
        };

        this.insertBlock = e => {
            const {block} = e.item;
            insertBlock(this.opts.list, this.opts.pos, block);
            this.refs.search.blur();
            this.opened = false;
            this.parent.update();

            setTimeout(() => {
                // Dispatch a click event to the new insert-mark so user can input several blocks at once
                const marks = [...this.parent.root.childNodes]
                    .filter(node => node.tagName === 'CATNIP-INSERT-MARK');
                marks[this.opts.pos + 2].click();
            }, 0);
        };
