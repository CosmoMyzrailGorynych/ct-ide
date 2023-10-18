//
    A component that uses itself recursively to markup a folder tree
    of the project.
    Asset dropping logic is left in asset-browser for DRY purposes,
    but folder dropping is implemented here.

    TODO: support folder dropping from asset-browser. 

    @attribute path (IAssetFolder[])
        Currently opened folders, from the root to the current directory.
    @attribute click ((path: IAssetFolder[]) => (event: MouseEvent) => void;)
        A two-fold callback that triggers when any of the folders have been clicked.
        The callback will be passed with the full folder path to the target as its only argument
        in the first function and the DOM event in the second one.
    @attribute drop ((folder: IAssetFolder | null) => (event: DragEvent) => void;)
        A two-fold callback that triggers when a user drops anything on the folders
        via a drag-n-drop interaction.
        The callback will be passed with the selected folder as its only argument
        in the first function and the DOM event in the second one.
    @attribute [layoutchanged] (riot function)
        A callback with no arguments that is called whenever folders were moved
        by this tag.

asset-folder-tree
    .flexrow
        svg.feather.nogrow.noshrink.anActionableIcon.asset-folder-tree-aToggler(
            onclick="{toggle}"
            if="{opts.path.length > 0}"
            class="{opened: opened, hidden: !hasFolders()}"
        )
            use(xlink:href="#chevron-right")
        .noshrink
            .asset-folder-tree-aFolder(
                onclick="{onOpenFolder}"
                ondrop="{onDrop}"
                ondragstart="{onFolderDrag}"
                ondragend="{updateParent}"
                draggable="{opts.path.length > 0}"
            )
                svg.feather(class="{opts.path.length && opts.path[opts.path.length - 1].colorClass}")
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

        const resources = require('data/node_requires/resources');

        this.opened = opts.path.length < 1;
        this.entries = this.opts.path.length ?
            this.opts.path[this.opts.path.length - 1].entries :
            window.currentProject.assets;
        this.toggle = () => this.opened = !this.opened;

        this.hasFolders = () => this.opts.path[this.opts.path.length - 1].entries
            .some(i => i.type === 'folder');

        this.updateParent = () => this.parent.update();

        this.onOpenFolder = e => {
            this.opts.click(this.opts.path)(e);
        };
        this.onFolderDrag = e => {
            const folder = this.opts.path[this.opts.path.length - 1];
            const transferData = {
                type: 'assetFolderDrag',
                folder: folder.uid
            };
            e.dataTransfer.setData('text/plain', JSON.stringify(transferData));
            e.dataTransfer.dropEffect = 'move';
        };
        this.onDrop = e => {
            const targetFolder = this.opts.path.length ?
                this.opts.path[this.opts.path.length - 1] :
                null;
            const dt = e.dataTransfer.getData('text/plain');
            let transferData;
            // Ensure that we can receive drag data
            try {
                transferData = JSON.parse(dt);
            } catch (oO) {
                void oO;
            }
            if (transferData && transferData.type === 'assetFolderDrag') {
                const uid = transferData.folder;
                const {moveFolder, getFolderById} = resources;
                try {
                    moveFolder(getFolderById(uid), targetFolder);
                    this.opts.layoutchanged && this.opts.layoutchanged();
                } catch (err) {
                    window.alertify.error(err.message);
                }
                return true;
            } else {
                // Can't process the data transfer itself; pass the event to the parent
                this.opts.drop(targetFolder)(e);
            }
            this.parent.update();
        };
