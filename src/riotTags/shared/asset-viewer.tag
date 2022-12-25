//
    A generic asset viewer with a search form, sorting, grouping, and switchable layout.

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
        Similar to [defaultlayout]
    @attribute [compact] (atomic)
        If set, the viewer hides several elements to fit in a more tight layout.

    @attribute assettype (string)
        The type of assets shown. The attribute is needed for groups to function.
    @attribute collection (riot function)
        A collection of items to iterate over while generating markup, sorting and firing events.
    @attribute [shownone] (atomic)
        If set, shows a "none" asset that returns -1 in opts.click event.
    @attribute [selectedasset] (IAsset | -1)
        Currently selected asset. If set, it will be highlighted in UI.

    @attribute [names] (riot function)
        A mapping funtion that takes a collection object and returns its human-readable name.
        Fallbacks to `item.name` if not defined.
    @attribute [thumbnails] (riot function)
        A mapping funtion that takes a collection object and returns a url for its thumbnail.
        The function is passed with the collection object, `true` or `false` depending on whether
        the large-card view is active, and `false`, which match the arguments used to get
        a URL for the thumbnail of the proper size in many get{X}Preview methods.
    @attribute [useicons] (atomic)
        Tells the asset viewer to use SVG icons instead of img tag.
        The `thumbnails` function should then return the name of the SVG icon.
    @attribute [icons] (riot function)
        A mapping funtion that takes a collection object and returns an array of icon names.
        The icons are shown near the asset's name and are used to convey some metadata.

    @attribute click (riot function)
        A two-fold callback (item => e => {…}) fired when a user clicks on an item,
        passing the associated collection object as its only argument in the first function,
        and a MouseEvent in a second function
    @attribute [contextmenu] (riot function)
        A two-fold callback (item => e => {…}) that is given a collection object
        as its only argument in the first function, and a MouseEvent in a second function,
        when a user tries to call a context menu on an item.

    @method updateList()
        Update the asset viewer, needed e.g. when new items were added.

    @property currentGroup (object)
        The current selected group. Will have `isUngroupedGroup` property when the "ungrouped"
        category is selected. Otherwise, groups are meant to be distinguished by their
        `uid` property.

asset-viewer.flexfix(class="{opts.namespace} {opts.class} {compact: opts.compact}")
    .flexfix-header
        .toright(class="{flexrow: opts.compact}")
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
            button.inline.square.nogrow.nmr(onclick="{addNewGroup}")
                svg.feather
                    use(xlink:href="#folder-plus")
                span(if="{!opts.compact}") {voc.addNewGroup}
        .toleft
            <yield/>
        .clear
    .flexfix-body
        .aSpacer
        ul.Cards.nmt(
            if="{opts.assettype}"
            class="{list: opts.compact}"
        )
            li.aCard(
                onclick="{openGroup({isUngroupedGroup: true})}"
                class="{active: currentGroup.isUngroupedGroup}"
                ondrop="{onGroupDrop}"
            )
                .aCard-aThumbnail
                    svg.feather.group-icon.act
                        use(xlink:href="#folder")
                .aCard-Properties
                    span {voc.ungrouped}
            li.aCard(
                each="{group in currentProject.groups[opts.assettype]}"
                oncontextmenu="{openGroupContextMenu(group)}"
                onlong-press="{openGroupContextMenu(group)}"
                onclick="{openGroup(group)}"
                ondrop="{onGroupDrop}"
                class="{active: currentGroup === group}"
                no-reorder
            )
                .aCard-aThumbnail
                    svg.feather.group-icon(class="{group.colorClass}")
                        use(xlink:href="#{group.icon}")
                .aCard-Properties
                    span {group.name}
        .center(if="{!opts.shownone && !(searchResults? searchResults : getGrouped(collection)).length}")
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
                each="{asset in (searchResults? searchResults : getGrouped(collection))}"
                class="{active: parent.opts.selectedasset === asset}"
                oncontextmenu="{parent.opts.contextmenu && parent.opts.contextmenu(asset)}"
                onlong-press="{parent.opts.contextmenu && parent.opts.contextmenu(asset)}"
                onclick="{parent.opts.click && parent.opts.click(asset)}"
                draggable="{!!parent.opts.assettype}"
                ondragstart="{parent.onItemDrag}"
                no-reorder
            )
                .aCard-aThumbnail
                    img(
                        if="{parent.opts.thumbnails && !parent.opts.useicons}"
                        src="{parent.opts.thumbnails(asset, currentLayout === 'largeCards', false)}"
                    )
                    svg.feather.group-icon.act(if="{parent.opts.thumbnails && parent.opts.useicons}")
                        use(xlink:href="#{parent.opts.thumbnails(asset)}")
                .aCard-Properties
                    span {parent.opts.names? parent.opts.names(asset) : asset.name}
                    .asset-viewer-Icons(if="{parent.opts.icons}")
                        svg.feather(each="{icon in parent.opts.icons(asset)}" class="feather-{icon}")
                            use(xlink:href="#{icon}")
                    span.date(if="{asset.lastmod && !parent.opts.compact}") {niceTime(asset.lastmod)}
    group-editor(
        if="{showingGroupEditor}"
        onapply="{closeGroupEditor}"
        onclose="{closeGroupEditor}"
        group="{editedGroup}"
    )
    context-menu(menu="{groupContextMenu}" ref="groupMenu")
    script.
        this.namespace = 'assetViewer';
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        this.sort = 'name';
        this.sortReverse = false;

        this.currentGroup = {
            isUngroupedGroup: true
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

        this.updateList = () => {
            this.collection = [...(this.opts.collection || [])];
            if (this.sort === 'name') {
                if (this.opts.names) {
                    const accessor = this.opts.names;
                    this.collection.sort((a, b) => accessor(a).localeCompare(accessor(b)));
                } else {
                    this.collection.sort((a, b) => a.name.localeCompare(b.name));
                }
            } else {
                this.collection.sort((a, b) => b.lastmod - a.lastmod);
            }
            if (this.sortReverse) {
                this.collection.reverse();
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
                var fuse = new Fuse(this.collection, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        this.updateList();
        {
            let rememberedAssetType;
            this.on('mount', () => {
                if (this.opts.assettype) {
                    rememberedAssetType = this.opts.assettype;
                    window.signals.on(`${rememberedAssetType.slice(0, -1)}Created`, this.updateList);
                    window.signals.on(`${rememberedAssetType}Changed`, this.updateList);
                }
            });
            this.on('unmount', () => {
                if (rememberedAssetType) {
                    window.signals.off(`${rememberedAssetType.slice(0, -1)}Created`, this.updateList);
                    window.signals.off(`${rememberedAssetType}Changed`, this.updateList);
                }
            });
        }

        this.getGrouped = collection => {
            if (!this.opts.assettype) {
                return collection;
            }
            return collection.filter(i =>
                this.opts.assettype &&
                    ((!i.group && this.currentGroup.isUngroupedGroup) ||
                    (i.group === this.currentGroup.uid)));
        };
        this.openGroup = group => () => {
            this.currentGroup = group;
        };
        this.addNewGroup = () => {
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
            const newGroup = {
                name: this.voc.newGroupName,
                icon: 'folder',
                colorClass: 'act',
                uid: require('./data/node_requires/generateGUID')()
            };
            window.currentProject.groups[at].push(newGroup);
            this.editedGroup = newGroup;
            this.showingGroupEditor = true;
            return true;
        };
        this.closeGroupEditor = () => {
            this.showingGroupEditor = false;
            this.editedGroup = void 0;
            this.update();
        };

        this.groupContextMenu = {
            items: [{
                label: this.vocGlob.edit,
                icon: 'edit',
                click: () => {
                    this.showingGroupEditor = true;
                    this.update();
                }
            }, {
                type: 'separator'
            }, {
                label: this.vocGlob.delete,
                icon: 'trash',
                click: () => {
                    const group = this.editedGroup,
                          oldId = this.editedGroup.uid;
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
        this.openGroupContextMenu = group => e => {
            e.preventDefault();
            this.editedGroup = group;
            this.refs.groupMenu.popup(e.clientX, e.clientY);
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
