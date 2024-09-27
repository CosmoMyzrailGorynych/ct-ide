//-
    @attribute entitytype (resourceType)
    @attribute room (IRoom)
    @attribute editor (RoomEditor)
room-entities-list(onpointerout="{clearHover}")
    ul.aMenu(if="{opts.entitytype === 'copies'}")
        li(
            each="{copy, ind in opts.editor.copies}"
            class="{active: parent.opts.editor.currentSelection.has(copy)}"
            onclick="{select}"
            onpointerenter="{drawHover}"
        )
            img.room-entities-list-aThumbnail(src="{getThumbnail(copy.cachedTemplate)}")
            span {copy.cachedTemplate.name}
            |
            |
            span.small.dim \#{ind}
    ul.aMenu(if="{opts.entitytype === 'tiles'}")
        li(
            each="{tile, ind in tilesEntries}"
            class="{active: parent.opts.editor.currentSelection.has(tile)}"
            onclick="{select}"
            onpointerenter="{drawHover}"
        )
            span {getById(tile.tileTexture).name}
            |
            |
            span {tile.tileFrame}
            |
            |
            span.small.dim \#{ind}
    script.
        const {getThumbnail, getById} = require('src/node_requires/resources');
        this.getThumbnail = getThumbnail;
        this.getById = getById;

        let lastSelected;
        this.select = e => {
            const {copy, tile, ind} = e.item;
            const object = copy ?? tile;
            const set = this.opts.editor.currentSelection;
            if (e.ctrlKey) {
                // Toggle selection
                if (set.has(object)) {
                    set.delete(object);
                } else {
                    set.add(object);
                }
            } else if (e.shiftKey) {
                // Add a range of objects to selection
                if (lastSelected) {
                    let ind2, from, to, array;
                    if (copy) {
                        array = this.opts.editor.copies;
                    } else if (tile) {
                        array = this.tilesEntries;
                    }
                    ind2 = array.indexOf(lastSelected);
                    from = Math.min(ind, ind2);
                    to = Math.max(ind, ind2);
                    for (const rangeObj of array.slice(from, to)) {
                        set.add(rangeObj);
                    }
                }
                set.add(object);
            } else {
                // Override selection
                set.clear();
                set.add(object);
            }
            lastSelected = object;
            this.opts.editor.prepareSelection();
        };
        this.drawHover = e => {
            const {copy, tile} = e.item;
            this.opts.editor.setHoverSelection(copy ?? tile);
            e.preventUpdate = true;
        };
        this.clearHover = e => {
            e.preventUpdate = true;
            if (e.target !== this.root) {
                return;
            }
            this.opts.editor.clearSelectionOverlay(true);
            this.resetLastSelected();
        };

        // Cache the result of RoomEditor.tiles.entries()
        let lastMode = this.opts.entitytype;
        this.updateTileEntries = () => {
            this.tilesEntries = this.opts.editor.tiles.entries();
        };
        this.on('beforeupdate', () => {
            if (lastMode !== this.opts.entitytype) {
                lastSelected = void 0;
                if (this.opts.entitytype === 'tiles') {
                    this.updateTileEntries();
                }
            }
        });

        this.resetLastSelected = () => {
            lastSelected = void 0;
        };
