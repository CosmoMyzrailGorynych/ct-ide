//
    @attribute path (IAssetFolder[])
        Currently opened folders, from the root to the current directory.
    @attribute click ((path: IAssetFolder[]) => (event: MouseEvent) => void;)
        A two-fold callback that triggers when any of the folders have been clicked.
        The callback will be passed with the full folder path to the target as its only argument
        in the first function and the DOM event in the second one.
    @attribute drop ((folder: IAssetFolder | null) => (event: DataTransferEvent) => void;)
        A two-fold callback that triggers when a user drops anything on the folders
        via a drag-n-drop interaction.
        The callback will be passed with the selected folder as its only argument
        in the first function and the DOM event in the second one.

asset-folder-tree
    .flexrow
        svg.feather.nogrow.noshrink.anActionableIcon.asset-folder-tree-aToggler(
            onclick="{toggle}"
            if="{opts.path.length > 0}"
            class="{opened: opened}"
        )
            use(xlink:href="#chevron-right")
        .noshrink
            .asset-folder-tree-aFolder(onclick="{onOpenFolder}" ondrop="{onDrop}")
                svg.feather
                    use(xlink:href="#folder")
                span  {(opts.path.length > 0) ? opts.path[opts.path.length - 1].name : voc.root}
            .asset-folder-tree-aSubtree(if="{opened}")
                asset-folder-tree(
                    each="{entry in entries}"
                    if="{entry.type === 'folder'}"
                    path="{parent.opts.path.concat([entry])}"
                    click="{parent.opts.click}"
                    drop="{parent.opts.drop}"
                )
    script.
        this.namespace = 'assetViewer';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.opened = opts.path.length < 1;
        this.entries = this.opts.path.length ?
            this.opts.path[this.opts.path.length - 1].entries :
            window.currentProject.assets;
        this.toggle = () => this.opened = !this.opened;

        this.onOpenFolder = e => {
            this.opts.click(this.opts.path)(e);
        };
        this.onDrop = e => {
            const folder = this.opts.path.length ?
                this.opts.path[this.opts.path.length - 1] :
                null;
            this.opts.drop(folder)(e);
        };
