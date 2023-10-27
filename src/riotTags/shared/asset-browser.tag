//
    A generic asset browser with a search form, sorting, grouping, and switchable layout.

    @slot
        Can use nested tags. Yields the passed markup as a header of an asset viewer.

    @attribute class (string)
        This tag has its own CSS classes, but allows arbitrary ones added as an attribute.

    @attribute [namespace] (string)
        A unique namespace used to store settings. Fallbacks to 'default'.
    @attribute [defaultlayout] (string)
        The default listing layout used if the user has not selected one yet.
        Can be "cards", "list", "largeCards".
    @attribute [forcelayout] (string)
        Similar to [defaultlayout] but can't be switched.
    @attribute [compact] (atomic)
        If set, the viewer hides several elements to fit in a more tight layout.

    @attribute assettypes (string)
        The types of assets shown, separated by commas. For example: assettypes="texture,template"
        Defaults to "all" (all the assets are shown.)
    @attribute [shownone] (atomic)
        If set, shows a "none" asset that returns -1 in opts.click event.
    @attribute [selectedasset] (IAsset | -1)
        Currently selected asset. If set, it will be highlighted in UI.

    @attribute click (riot function)
        A two-fold callback (item => e => {…}) fired when a user clicks on an item,
        passing the associated collection object as its only argument in the first function,
        and a MouseEvent in a second function
    @attribute [customfilter] ((asset: IAsset) => boolean)
        A custom filter function applied to hide separate assets if the function
        returns `false`.

    @method updateList()
        Update the asset viewer, needed when new items were added.

    @property currentFolder (IAssetFolder | null)
        Current folder's object. If it is project's root, null is returned.

asset-browser.flexfix(class="{opts.namespace} {opts.class} {compact: opts.compact}")
    .flexfix-header(class="{flexrow: !opts.compact, flexcolrev: opts.compact}")
        div(class="{wide: opts.compact}")
            <yield/>
            .asset-browser-Breadcrumbs
                button.square.tiny(if="{!opts.compact}" title="{voc.toggleFolderTree}" onclick="{toggleFolderTree}")
                    svg.feather
                        use(xlink:href="#folder")
                h2.np.nm.pointer.inline(
                    if="{!opts.compact}"
                    onclick="{moveUpTo(folderStack[0])}"
                    ondrop="{onFolderDrop}"
                ) {voc.root}
                h3.np.nm.pointer.inline(
                    if="{opts.compact}"
                    onclick="{moveUpTo(folderStack[0])}"
                    ondrop="{onFolderDrop}"
                ) {voc.root}
                virtual(each="{item, i in folderStack.slice(1)}")
                    svg.feather
                        use(xlink:href="#chevron-right")
                    // -2 is because we slice the array first by one
                    h2.np.nm.inline(
                        if="{!parent.opts.compact}"
                        class="{pointer: i < folderStack.length - 2}"
                        onclick="{(i < folderStack.length - 1) && parent.moveUpTo(item)}"
                        ondrop="{onFolderDrop}"
                    ) {item.name}
                    h3.np.nm.inline(
                        if="{parent.opts.compact}"
                        class="{pointer: i < folderStack.length - 2}"
                        onclick="{(i < folderStack.length - 1) && parent.moveUpTo(item)}"
                        ondrop="{onFolderDrop}"
                    ) {item.name}
                svg.feather.anActionableIcon(if="{folderStack.length > 1}" onclick="{goUp}")
                    use(xlink:href="#chevron-up")
        .nogrow(class="{flexrow: opts.compact}")
            b(if="{!opts.compact}") {vocGlob.sort}
            .aButtonGroup.nml
                button.inline.square(
                    onclick="{switchSort('date')}"
                    class="{selected: sort === 'date' && !searchResults}"
                    title="{vocGlob.sortByDate}"
                )
                    svg.feather
                        use(xlink:href="#clock")
                button.inline.square(
                    onclick="{switchSort('name')}"
                    class="{selected: sort === 'name' && !searchResults}"
                    title="{vocGlob.sortByName}"
                )
                    svg.feather
                        use(xlink:href="#sort-alphabetically")
                button.inline.square(
                    onclick="{switchSort('type')}"
                    class="{selected: sort === 'type' && !searchResults}"
                    title="{vocGlob.sortByType}"
                )
                    svg.feather
                        use(xlink:href="#grid-random")
            .aSearchWrap(style="{opts.compact ? 'width: auto;' : ''}")
                input.inline(type="text" onkeyup="{fuseSearch}")
                svg.feather
                    use(xlink:href="#search")
            button.inline.square(if="{!opts.forcelayout}" onclick="{switchLayout}")
                svg.feather
                    use(xlink:href="#{layoutToIconMap[currentLayout]}")
            button.inline.square.nogrow.nmr(onclick="{addNewFolder}")
                svg.feather
                    use(xlink:href="#folder-plus")
                span(if="{!opts.compact}") {voc.addNewFolder}
            <yield from="filterArea"/>
    .flexfix-body.flexrow(onclick="{deselectAll}")
        aside.asset-browser-aFolderTree.nogrow(if="{showingFolderTree && !opts.compact}")
            asset-folder-tree(
                path="{[]}" /* this is intentional (top-most folder level) */
                click="{onAsideFolderClick}"
                drop="{onAsideFolderDrop}"
                layoutchanged="{onFolderTreeChange}"
            )
        div
            .center(if="{!opts.shownone && !(searchResults || entries).length}")
                svg.anIllustration
                    use(xlink:href="data/img/weirdFoldersIllustration.svg#illustration")
                br
                span {vocGlob.nothingToShowFiller}
                .aSpacer(if="{assetTypes[0] === 'all'}")
            .flexrow(if="{!opts.shownone && !(searchResults || entries).length}")
                .aSpacer
                create-asset-menu.nogrow(
                    if="{assetTypes[0] === 'all'}"
                    collection="{currentCollection}"
                    folder="{currentFolder}"
                    onimported="{onAssetImported}"
                )
                .aSpacer
            ul.Cards(class="{layoutToClassListMap[opts.forcelayout || currentLayout]}")
                li.aCard(if="{opts.shownone}" onclick="{opts.click && opts.click(-1)}" class="{active: opts.selectedasset === -1}")
                    .aCard-aThumbnail
                        img(src="data/img/notexture.png")
                    .aCard-Properties
                        span {vocGlob.none}
                li.aCard(
                    each="{asset in (searchResults || entries)}"
                    oncontextmenu="{parent.openContextMenu(asset)}"
                    onlong-press="{parent.openContextMenu(asset)}"
                    onclick="{parent.assetClick(asset)}"
                    ondragstart="{parent.onItemDrag}"
                    ondrop="{parent.onFolderDrop}"
                    draggable="{asset.type !== 'folder'}"
                    class="{active: selectedItems.has(asset)} {asset.type}"
                    no-reorder
                )
                    .aCard-aThumbnail
                        img(
                            if="{asset.type !== 'folder' && !parent.usesIcons(asset)}"
                            src="{parent.getThumbnail(asset, currentLayout === 'largeCards', false)}"
                        )
                        svg.feather.group-icon.act(if="{asset.type !== 'folder' && parent.usesIcons(asset)}")
                            use(xlink:href="#{parent.getThumbnail(asset)}")
                        .aCard-aFolderIcon(if="{asset.type === 'folder'}")
                            svg.feather(class="{asset.colorClass || 'act'}")
                                use(xlink:href="#folder")
                            svg.feather(class="{asset.colorClass || 'act'}")
                                use(xlink:href="#{asset.icon}")
                    .aCard-Properties
                        span {parent.getName(asset)}
                        span.secondary(if="{asset.type !== 'folder' && (parent.assetTypes.length > 1 || parent.assetTypes[0] === 'all')}")
                            svg.feather
                                use(xlink:href="#{iconMap[asset.type]}")
                            span(if="{!parent.opts.compact}")   {vocGlob.assetTypes[asset.type][0].slice(0, 1).toUpperCase()}{vocGlob.assetTypes[asset.type][0].slice(1)}
                        .asset-browser-Icons(if="{asset.type !== 'folder'}")
                            svg.feather(each="{icon in parent.getIcons(asset)}" class="feather-{icon}")
                                use(xlink:href="#{icon}")
                        span.date(if="{asset.lastmod && !parent.opts.compact}") {niceTime(asset.lastmod)}
    folder-editor(
        if="{showingFolderEditor}"
        onapply="{closeFolderEditor}"
        onclose="{closeFolderEditor}"
        folder="{editedFolder}"
    )
    context-menu(menu="{folderContextMenu}" ref="folderMenu")
    context-menu(menu="{assetContextMenu}" ref="assetMenu")
    context-menu(menu="{assetsContextMenu}" ref="assetsMenu")
    script.
        this.namespace = 'assetViewer';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/niceTime').default);
        this.sort = 'type';
        this.sortReverse = false;

        const resources = require('data/node_requires/resources');
        this.assetTypes = this.opts.assettypes ? this.opts.assettypes.split(',') : ['all'];
        this.getThumbnail = resources.getThumbnail;
        this.usesIcons = resources.areThumbnailsIcons;
        this.iconMap = resources.resourceToIconMap;
        this.getName = resources.getName;
        this.getIcons = resources.getIcons;

        /**
         * A list of opened folders, from the project's root (as its asset collection)
         * to the deepest folder.
         */
        this.folderStack = [window.currentProject.assets];
        /** The array of assets that is currently shown */
        this.currentCollection = window.currentProject.assets;
        /** The current IAssetFolder object. Set to null if the project's root is shown */
        this.currentFolder = null;
        this.getFolder = () => {
            const last = this.folderStack[this.folderStack.length - 1];
            if (last === window.currentProject.assets) {
                return null;
            }
            return last;
        };
        this.updateFolders = () => {
            this.currentFolder = this.getFolder();
            if (!this.currentFolder) {
                this.currentCollection = window.currentProject.assets;
            } else {
                this.currentCollection = this.currentFolder.entries;
            }
            this.selectedItems.clear();
            this.prevShifSelectItem = null;
            this.updateList();
        };
        this.goUp = () => {
            if (this.folderStack.length < 2) {
                throw new Error('[asset-browser] Cannot move beyond project root.');
            }
            this.folderStack.pop();
            this.updateFolders();
        };
        this.moveUpTo = folder => e => {
            const folderIndex = this.folderStack.indexOf(folder);
            if (folderIndex === -1) {
                throw new Error('[asset-browser] Cannot move outside of the current folder path.');
            }
            this.folderStack = this.folderStack.slice(0, folderIndex + 1);
            this.updateFolders();
        };
        this.goDown = folder => {
            this.folderStack.push(folder);
            this.updateFolders();
        };
        this.goTo = folderPath => {
            this.folderStack = folderPath;
            this.updateFolders();
        };
        this.onFolderTreeChange = () => {
            if (this.currentFolder === null) {
                this.update();
                return;
            }
            const recursiveFolderWalker = (
                target, /* IAssetFolder */
                path, /* IAssetFolder[] */
                collection /* folderEntries */
            ) => {
                for (const entry of collection) {
                    if (entry.type === 'folder') {
                        const subpath = [...path, target];
                        if (entry === target) {
                            return subpath;
                        }
                        const result = recursiveFolderWalker(target, subpath, entry.entries);
                        if (result) {
                            return result;
                        }
                    }
                }
            };
            this.goTo(recursiveFolderWalker(
                this.currentFolder,
                [window.currentProject.assets],
                window.currentProject.assets
            ));
            this.update();
        };

        const layouts = ['cards', 'largeCards', 'list'];
        this.layoutToIconMap = {
            cards: 'layout-cards',
            list: 'menu',
            largeCards: 'grid'
        };
        this.layoutToClassListMap = {
            cards: 'cards',
            list: 'list',
            largeCards: 'largeicons'
        };
        this.currentLayout = localStorage.defaultAssetLayout || 'cards';
        const n = this.opts.namespace;
        if (n && localStorage[n + 'Layout']) {
            this.currentLayout = localStorage[n + 'Layout'];
        } else if (this.opts.defaultlayout) {
            this.currentLayout = this.opts.defaultlayout;
        }
        this.switchLayout = () => {
            const idx = (layouts.indexOf(this.currentLayout) + 1) % layouts.length;
            this.currentLayout = layouts[idx];
            const key = this.opts.namespace ? (this.opts.namespace + 'Layout') : 'defaultAssetLayout';
            localStorage[key] = this.currentLayout;
        };

        this.showingFolderTree = localStorage.preferFolderTree === 'yes';
        this.toggleFolderTree = () => {
            this.showingFolderTree = !this.showingFolderTree;
            localStorage.preferFolderTree = this.showingFolderTree ? 'yes' : 'no';
        };

        /* Asset sorting & name search operations */
        const fuseOptions = {
            shouldSort: true,
            tokenize: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['name']
        };
        this.sortFolderwise = (a, b) => {
            if (a.type === 'folder' && b.type === 'folder') {
                return 0;
            }
            if (a.type !== 'folder' && b.type !== 'folder') {
                return 0;
            }
            if (a.type === 'folder' && b.type !== 'folder') {
                return -1;
            }
            return 1;
        };
        this.sortTypewise = (a, b) => a.type < b.type ? -1 : (a.type > b.type ? 1 : 0);
        this.updateList = () => {
            if (this.assetTypes[0] !== 'all') {
                this.entries = this.currentCollection
                    .filter(a => this.assetTypes.includes(a.type) || a.type === 'folder');
            } else {
                this.entries = [...this.currentCollection];
            }
            if (this.opts.customfilter) {
                this.entries = this.entries
                    .filter(entry => entry.type === 'folder' || this.opts.customfilter(entry));
            }
            if (this.sort === 'name') {
                if (this.opts.names) {
                    const accessor = this.opts.names;
                    this.entries.sort((a, b) => this.sortFolderwise(a, b) || accessor(a).localeCompare(accessor(b)) || this.sortTypewise(a, b));
                } else {
                    this.entries.sort((a, b) => this.sortFolderwise(a, b) || a.name.localeCompare(b.name) || this.sortTypewise(a, b));
                }
            } else if (this.sort === 'type') {
                if (this.opts.names) {
                    const accessor = this.opts.names;
                    this.entries.sort((a, b) => this.sortFolderwise(a, b) || this.sortTypewise(a, b) || accessor(a).localeCompare(accessor(b)));
                } else {
                    this.entries.sort((a, b) => this.sortFolderwise(a, b) || this.sortTypewise(a, b) || a.name.localeCompare(b.name));
                }
            } else {
                this.entries.sort((a, b) => this.sortFolderwise(a, b) || (b.lastmod - a.lastmod));
            }
            if (this.sortReverse) {
                this.entries.reverse();
            }
        };
        this.switchSort = sort => () => {
            if (this.sort === sort) {
                this.sortReverse = !this.sortReverse;
            } else {
                this.sort = sort;
                this.sortReverse = false;
            }
            this.updateList();
        };
        this.fuseSearch = e => {
            if (e.target.value.trim()) {
                const Fuse = require('fuse.js');
                var fuse = new Fuse(this.entries, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        this.updateList();
        const updateListAndUpdate = () => {
            this.updateList();
            this.update();
        };

        // Listen to assets' changes and refresh the list when appropriate
        this.on('mount', () => {
            if (this.assetTypes[0] === 'all') {
                window.signals.on('assetCreated', updateListAndUpdate);
                window.signals.on('assetChanged', updateListAndUpdate);
            } else {
                for (const assetType of this.assetTypes) {
                    window.signals.on(`${assetType}Created`, updateListAndUpdate);
                    window.signals.on(`${assetType}Changed`, updateListAndUpdate);
                }
            }
        });
        this.on('unmount', () => {
            if (this.assetTypes === 'all') {
                window.signals.off('assetCreated', updateListAndUpdate);
                window.signals.off('assetChanged', updateListAndUpdate);
            } else {
                for (const assetType of this.assetTypes) {
                    window.signals.off(`${assetType}Created`, updateListAndUpdate);
                    window.signals.off(`${assetType}Changed`, updateListAndUpdate);
                }
            }
        });

        this.selectedItems = new Set();
        this.prevShifSelectItem = null;
        this.assetClick = item => e => {
            e.stopPropagation();
            if (item.type === 'folder') {
                // TODO: folder selection on shift and ctrl clicks
                this.goDown(item);
            } else {
                // Shift + click range selection
                if (e.shiftKey) {
                    if (this.prevShifSelectItem) {
                        if (!e.ctrlKey) {
                            this.selectedItems.clear();
                        }
                        const collection = this.searchResults || this.entries;
                        const a = collection.indexOf(item),
                              b = collection.indexOf(this.prevShifSelectItem);
                        if (a === -1 || b === -1) {
                            this.selectedItems.clear();
                            return false;
                        }
                        const subset = collection.slice(Math.min(a, b), Math.max(a, b) + 1);
                        for (const selectedItem of subset) {
                            this.selectedItems.add(selectedItem);
                        }
                    } else {
                        // If nothing was selected before, select the clicked item
                        this.prevShifSelectItem = item;
                        this.selectedItems.add(item);
                    }
                } else if (e.ctrlKey) {
                    // Singular selection / deselection for Ctrl key
                    if (this.selectedItems.has(item)) {
                        this.selectedItems.delete(item);
                    } else {
                        this.prevShifSelectItem = item;
                        this.selectedItems.add(item);
                    }
                } else if (!this.opts.click) {
                    throw new Error("[asset-browser] The [click] attribute was not set.");
                } else {
                    this.prevShifSelectItem = null;
                    this.selectedItems.clear();
                    this.opts.click(item)(e);
                }
            }
        };
        this.deselectAll = () => {
            this.prevShifSelectItem = null;
            this.selectedItems.clear();
        };

        this.addNewFolder = () => {
            const newFolder = resources.createFolder(this.currentFolder);
            this.updateList();
            this.editedFolder = newFolder;
            this.showingFolderEditor = true;
        };
        this.closeFolderEditor = () => {
            this.showingFolderEditor = false;
            this.editedFolder = void 0;
            this.update();
        };

        this.onAssetImported = asset => {
            window.orders.trigger('openAsset', asset);
        };

        this.assetContextMenu = {
            opened: false,
            items: []
        };
        const assetContextMenuTemplate = [{
            icon: 'external-link',
            label: this.vocGlob.open,
            click: () => {
                window.orders.trigger('openAsset', this.contextMenuAsset.uid);
            }
        }, {
            icon: 'copy',
            label: this.vocGlob.copyName,
            click: () => {
                nw.Clipboard.get().set(this.contextMenuAsset.name, 'text');
            }
        }, {
            icon: 'edit',
            if: () => this.contextMenuAsset.name,
            label: this.vocGlob.rename,
            click: async () => {
                const reply = await alertify
                    .defaultValue(this.contextMenuAsset.name)
                    .prompt(this.vocGlob.newName)
                if (reply.inputValue && reply.inputValue.trim() !== '' && reply.buttonClicked !== 'cancel') {
                    this.contextMenuAsset.name = reply.inputValue.trim();
                    this.update();
                }
            }
        }, {
            type: 'separator'
        }, {
            icon: 'trash',
            label: this.vocGlob.delete,
            click: async () => {
                const reply = await alertify
                    .okBtn(this.vocGlob.delete)
                    .cancelBtn(this.vocGlob.cancel)
                    .confirm(this.vocGlob.confirmDelete.replace('{0}', this.contextMenuAsset.name))
                if (reply.buttonClicked === 'ok') {
                    alertify
                        .okBtn(this.vocGlob.ok)
                        .cancelBtn(this.vocGlob.cancel);
                    await resources.deleteAsset(this.contextMenuAsset);
                    this.updateList();
                    this.update();
                }
            }
        }];
        this.openContextMenu = item => e => {
            if (item.type === 'folder') {
                this.contextMenuFolder = item;
                this.refs.folderMenu.popup(e.clientX, e.clientY);
                e.preventDefault();
                return;
            }
            // Multiple selection
            if (this.selectedItems.size > 0) {
                this.refs.assetsMenu.popup(e.clientX, e.clientY);
                e.preventDefault();
                return;
            }
            this.contextMenuAsset = item;
            const contextActions = resources.getContextActions(item, () => {
                this.updateList();
                this.update();
            });
            if (contextActions.length > 0) {
                contextActions.push({
                    type: 'separator'
                });
            }
            this.assetContextMenu.items = [
                ...contextActions,
                ...assetContextMenuTemplate
            ];
            this.refs.assetMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

        // This one is for multiple selection
        this.assetsContextMenu = {
            items: [{
                icon: 'external-link',
                label: this.vocGlob.open,
                click: () => {
                    window.orders.trigger(
                        'openAssets',
                        [...this.selectedItems].map(asset => asset.uid)
                    );
                }
            }, {
                icon: 'copy',
                label: this.vocGlob.copyNamesList,
                click: () => {
                    const names = [...this.selectedItems]
                        .map(asset => asset.name).join('\n');
                    nw.Clipboard.get().set(names, 'text');
                }
            }, {
                icon: 'copy',
                label: this.vocGlob.copyNamesArray,
                click: () => {
                    const names = [...this.selectedItems]
                        .map(asset => `'${asset.name}'`).join(', ');
                    nw.Clipboard.get().set(names, 'text');
                }
            }, {
                type: 'separator'
            }, {
                icon: 'trash',
                label: this.vocGlob.delete,
                click: async () => {
                    const names = [...this.selectedItems]
                        .map(asset => asset.name).join(', ');
                    const reply = await alertify
                        .okBtn(this.vocGlob.delete)
                        .cancelBtn(this.vocGlob.cancel)
                        .confirm(this.vocGlob.confirmDelete.replace('{0}', names))
                    if (reply.buttonClicked === 'ok') {
                        alertify
                            .okBtn(this.vocGlob.ok)
                            .cancelBtn(this.vocGlob.cancel);
                        // Do it synchronously to avoid race conditions
                        for (const asset of this.selectedItems) {
                            await resources.deleteAsset(asset);
                        }
                        this.updateList();
                        this.update();
                    }
                }
            }]
        };

        this.folderContextMenu = {
            items: [{
                label: this.vocGlob.edit,
                icon: 'edit',
                click: () => {
                    this.showingFolderEditor = true;
                    this.editedFolder = this.contextMenuFolder;
                    this.update();
                }
            }, {
                type: 'separator'
            }, {
                label: this.voc.unwrapFolder,
                icon: 'unpackage',
                click: async () => {
                    const folder = this.contextMenuFolder;
                    const reply = await window.alertify.confirm(this.voc.confirmUnwrapFolder);
                    if (reply.buttonClicked !== 'ok') {
                        return;
                    }
                    await resources.deleteFolder(folder, this.currentFolder);
                    this.updateList();
                    this.update();
                }
            }, {
                label: this.vocGlob.delete,
                icon: 'trash',
                click: async () => {
                    const folder = this.contextMenuFolder;
                    const reply = window.alertify.confirm(this.voc.confirmDeleteFolder);
                    if (reply.buttonClicked !== 'ok') {
                        return;
                    }
                    await resources.deleteFolder(folder);
                    this.updateList();
                    this.update();
                }
            }]
        };
        this.openFolderContextMenu = folder => e => {
            e.preventDefault();
            this.editedFolder = folder;
            this.refs.folderMenu.popup(e.clientX, e.clientY);
        };

        // Drag & Drop handling to allow moving the assets into folders en masse
        this.onItemDrag = e => {
            const {asset} = e.item;
            if (asset.type === 'folder') {
                return;
            }
            // If no assets were not selected or a user drags another item,
            // make a selection with this item
            if (!this.selectedItems.has(asset)) {
                this.selectedItems.clear();
                this.selectedItems.add(asset);
            }
            const transferData = {
                type: 'assetBrowserDrag',
                items: [...this.selectedItems].map(item => item.uid)
            };
            e.dataTransfer.setData('text/plain', JSON.stringify(transferData));
            e.dataTransfer.dropEffect = 'move';
        };
        this.moveByTransfer = (folder, e) => {
            const dt = e.dataTransfer.getData('text/plain');
            let transferData;
            // Ensure that we can receive drag data
            try {
                transferData = JSON.parse(dt);
            } catch (oO) {
                return false;
            }
            if (transferData.type === 'assetBrowserDrag') {
                const ids = transferData.items;
                const {moveAsset, getById} = resources;
                for (const id of ids) {
                    moveAsset(getById(null, id), folder);
                }
                this.updateList();
            }
            return true;
        };
        this.onFolderDrop = e => {
            const folder = e.item ? (e.item.asset || e.item.item || null) : null;
            if (folder !== null && folder.type !== 'folder') {
                return false;
            }
            return this.moveByTransfer(folder, e);
        };

        this.onAsideFolderClick = folderPath => e => {
            this.goTo([window.currentProject.assets, ...folderPath]);
        };
        this.onAsideFolderDrop = folder => e => {
            return this.moveByTransfer(folder, e);
        };
