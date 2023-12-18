//
    A tag used to edit an asset folder, allowing to change its name, color and icon.
    Mutates the target object, returns nothing in its callbacks.

    @attribute onclose (riot function)
    @attribute onapply (riot function)

    @attribute folder (object)
        The folder that should be edited.

folder-editor.aDimmer.fadein
    .aModal.pad.npb.appear(ref="widget")
        .toright
            svg.feather.anActionableIcon(onclick="{opts.onclose}")
                use(xlink:href="#x")
        h1.nmt.npt {voc.title}
        label.block
            b {vocGlob.name}
            br
            input(type="text" value="{opts.folder.name}" onchange="{wire('opts.folder.name')}")
        .label.block
            b {voc.icon}
            br
            icon-input(val="{opts.folder.icon}" onselected="{onIconSelected}")
        .label.block
            b {voc.color}
            br
            button.inline.square(
                each="{colorClass in ['act', 'accent1', 'error', 'success', 'warning', 'text']}"
                class="{active: parent.opts.folder.colorClass === colorClass}"
                onclick="{setColorClass(colorClass)}"
            )
                svg.feather(class="{colorClass}")
                    use(xlink:href="#droplet")
        .aSpacer
        .inset
            button.nmr(onclick="{opts.onapply}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    script.
        this.namespace = 'folderEditor';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.setColorClass = colorClass => () => {
            this.opts.folder.colorClass = colorClass;
        };
        this.onIconSelected = icon => {
            this.opts.folder.icon = icon;
            this.update();
        };
        this.onClose = () => {
            Object.assign(this.opts.folder, this.oldFolder);
            if (this.opts.onclose) {
                this.opts.onclose();
            }
        };
        this.oldFolder = JSON.parse(JSON.stringify(this.opts.folder));
