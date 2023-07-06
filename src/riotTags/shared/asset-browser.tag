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

    @method updateList()
        Update the asset viewer, needed when new items were added.

    @property currentFolder (IAssetFolder | null)
        Current folder's object. If it is project's root, null is returned.

asset-browser.flexfix(class="{opts.namespace} {opts.class} {compact: opts.compact}")
    .flexfix-header.flexrow
        div
            <yield/>
            .asset-browser-Breadcrumbs
                h2.np.nm.pointer.inline(onclick="{moveUpTo(folderStack[0])}") {voc.root}
                virtual(each="{item in folderStack.slice(1)}")
                    svg.feather
                        use(xlink:href="#chevron-right")
                    h2.np.nm.pointer.inline(onclick="{parent.moveUpTo(item)}") {item.name}
                svg.feather.anActionableIcon(if="{folderStack.length > 1}" onclick="{goUp}")
                    use(xlink:href="#chevron-up")
        .nogrow(class="{flexrow: opts.compact}")
            b(if="{!opts.compact}") {vocGlob.sort}
            .aButtonGroup.nml
                button.inline.square(
                    onclick="{switchSort('date')}"
                    class="{selected: sort === 'date' && !searchResults}"
                )
                    svg.feather
                        use(xlink:href="#clock")
                button.inline.square(
                    onclick="{switchSort('name')}"
                    class="{selected: sort === 'name' && !searchResults}"
                )
                    svg.feather
                        use(xlink:href="#sort-alphabetically")
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
    .flexfix-body
        .center(if="{!opts.shownone && !(searchResults || entries).length}")
            svg.anIllustration
                use(xlink:href="data/img/weirdFoldersIllustration.svg#illustration")
            br
            span {vocGlob.nothingToShowFiller}
        ul.Cards(class="{layoutToClassListMap[opts.forcelayout || currentLayout]}")
            li.aCard(if="{opts.shownone}" onclick="{opts.click && opts.click(-1)}" class="{active: opts.selectedasset === -1}")
                .aCard-aThumbnail
                    img(src="data/img/notexture.png")
                .aCard-Properties
                    span {vocGlob.none}
            li.aCard(
                each="{asset in (searchResults || entries)}"
                class="{active: parent.opts.selectedasset === asset}"
                oncontextmenu="{parent.openContextMenu(asset)}"
                onlong-press="{parent.openContextMenu(asset)}"
                onclick="{parent.assetClick(asset)}"
                draggable="{!!parent.opts.assettype}"
                ondragstart="{parent.onItemDrag}"
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
                    .asset-browser-Icons(if="{parent.opts.icons}") // TODO: add support to resources API
                        svg.feather(each="{icon in parent.opts.icons(asset)}" class="feather-{icon}")
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
    script.
        this.namespace = 'assetViewer';
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        this.sort = 'name';
        this.sortReverse = false;

        const resources = require('data/node_requires/resources');
        this.assetTypes = this.opts.assettypes ? this.opts.assettypes.split(',') : ['all'];
        this.getThumbnail = resources.getThumbnail;
        this.usesIcons = resources.areThumbnailsIcons;
        this.iconMap = resources.resourceToIconMap;
        this.getName = resources.getName;

        /** A list of opened folders, from the project's root to the most deep folder */
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
            this.updateList();
        };
        this.goUp = () => {
            if (this.currentCollection.length < 2) {
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
            this.folderStack = this.folderStack.slice(0, folderIndex);
            this.updateFolders();
        };
        this.goDown = folder => {
            this.folderStack.push(folder);
            this.updateFolders();
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
                this.entries = this.currentCollection.filter(a => this.assetTypes.includes(a.type));
            } else {
                this.entries = [...this.currentCollection];
            }
            if (this.sort === 'name') {
                if (this.opts.names) {
                    const accessor = this.opts.names;
                    this.entries.sort((a, b) => this.sortFolderwise(a, b) || accessor(a).localeCompare(accessor(b)) || this.sortTypewise(a, b));
                } else {
                    this.entries.sort((a, b) => this.sortFolderwise(a, b) || a.name.localeCompare(b.name) || this.sortTypewise(a, b));
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

        // Listen to assets' changes and refresh the list when appropriate
        this.on('mount', () => {
            if (this.assetTypes[0] === 'all') {
                window.signals.on(`assetCreated`, this.updateList);
                window.signals.on(`assetChanged`, this.updateList);
            } else {
                for (const assetType of this.assetTypes) {
                    window.signals.on(`${assetType}Created`, this.updateList);
                    window.signals.on(`${assetType}sChanged`, this.updateList);
                }
            }
        });
        this.on('unmount', () => {
            if (this.assetTypes === 'all') {
                window.signals.off(`assetCreated`, this.updateList);
                window.signals.off(`assetChanged`, this.updateList);
            } else {
                for (const assetType of this.assetTypes) {
                    window.signals.off(`${assetType}Created`, this.updateList);
                    window.signals.off(`${assetType}sChanged`, this.updateList);
                }
            }
        });

        this.assetClick = item => e => {
            if (item.type === 'folder') {
                this.goDown(item);
            } else {
                if (!this.opts.click) {
                    throw new Error("[asset-browser] The [click] attribute was not set.");
                }
                this.opts.click(item)(e);
            }
        };

        this.addNewFolder = () => { // TODO:
            if (!window.currentProject.groups) {
                window.alertify('No groups initialized in this project. Please run `applyMigrationCode(\'1.8.0\')` for this project.');
                return false;
            }
            const at = this.opts.assettype;
            if (!at) {
                const errMessage = `Asset type not set for ${at} asset type.`;
                window.alertify(errMessage);
                throw new Error(errMessage);
            }
            const newFolder = {
                name: this.voc.newFolderName,
                icon: 'folder',
                colorClass: 'act',
                uid: require('./data/node_requires/generateGUID')()
            };
            window.currentProject.groups[at].push(newFolder);
            this.editedFolder = newFolder;
            this.showingFolderEditor = true;
            return true;
        };
        this.closeFolderEditor = () => {
            this.showingFolderEditor = false;
            this.editedFolder = void 0;
            this.update();
        };

        this.assetContextMenu = {
            opened: false,
            items: []
        };
        const assetContextMenuTemplate = [{
            label: window.languageJSON.common.open,
            click: () => {
                // TODO:
            }
        }, {
            label: window.languageJSON.common.reimport,
            icon: 'refresh-ccw',
            if: () => this.currentTexture?.source,
            click: async () => {
                await // TODO:
                this.update();
            }
        }, {
            label: window.languageJSON.common.copyName,
            click: () => {
                nw.Clipboard.get().set(this.currentTexture.name, 'text');
            }
        }, {
            if: () => this.contextMenuAsset.name,
            label: window.languageJSON.common.rename,
            click: async () => {
                const reply = await alertify
                    .defaultValue(this.contextMenuAsset.name)
                    .prompt(window.languageJSON.common.newName)
                if (reply.inputValue && reply.inputValue.trim() !== '' && reply.buttonClicked !== 'cancel') {
                    this.contextMenuAsset.name = e.inputValue.trim();
                    this.update();
                }
            }
        }, {
            type: 'separator'
        }, {
            label: window.languageJSON.common.delete,
            click: async () => {
                const reply = await alertify
                    .okBtn(window.languageJSON.common.delete)
                    .cancelBtn(window.languageJSON.common.cancel)
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentTexture.name))
                if (reply.buttonClicked === 'ok') {
                    alertify
                        .okBtn(window.languageJSON.common.ok)
                        .cancelBtn(window.languageJSON.common.cancel);
                    await resources.deleteAsset(this.contextMenuAsset);
                    this.update();
                }
            }
        }];
        this.openContextMenu = item => e => {
            this.contextMenuAsset = item;
            const contextActions = resources.getContextActions(item);
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

        this.folderContextMenu = {
            items: [{
                label: this.vocGlob.edit,
                icon: 'edit',
                click: () => {
                    this.showingFolderEditor = true;
                    this.update();
                }
            }, {
                type: 'separator'
            }, {
                label: this.vocGlob.delete,
                icon: 'trash',
                click: () => {
                    // TODO:
                    const group = this.editedFolder,
                          oldId = this.editedFolder.uid;
                    window.alertify.confirm(this.voc.groupDeletionConfirmation)
                    .then(e => {
                        if (e.buttonClicked !== 'ok') {
                            return;
                        }
                        for (const asset of this.opts.collection) {
                            if (asset.group === oldId) {
                                delete asset.group;
                            }
                        }
                        const groups = window.currentProject.groups[this.opts.assettype];
                        groups.splice(groups.indexOf(group), 1);
                        this.update();
                    });
                }
            }]
        };
        this.openFolderContextMenu = folder => e => {
            e.preventDefault();
            this.editedFolder = folder;
            this.refs.folderMenu.popup(e.clientX, e.clientY);
        };

        this.onItemDrag = e => {
            if (!this.opts.assettype) {
                return;
            }
            e.dataTransfer.setData('text/plain', `moveToGroup;${e.item.asset.uid}`);
            e.dataTransfer.dropEffect = 'move';
        };
        this.onGroupDrop = e => {
            const dt = e.dataTransfer.getData('text/plain');
            if (dt.split(';')[0] !== 'moveToGroup') {
                return false;
            }
            const [, assetId] = dt.split(';');
            const asset = this.opts.collection.find(a => a.uid === assetId);
            if (!e.item) { // this is "Ungrouped" tag which is not in a loop
                delete asset.group;
            } else {
                const groupId = e.item.group.uid;
                asset.group = groupId;
            }
            return true;
        };
