//
    A tag used to edit an asset group, allowing to change its name, color and icon.
    Mutates the target object, returns nothing in its callbacks.

    @attribute onclose (riot function)
    @attribute onapply (riot function)

    @attribute group (object)
        The group that should be edited.

group-editor.aDimmer.fadein
    .aModal.pad.npb.appear(ref="widget")
        .toright
            svg.feather.anActionableIcon(onclick="{opts.onclose}")
                use(xlink:href="#x")
        h1.nmt.npt {voc.groupEditor}
        label.block
            b {vocGlob.name}
            br
            input(type="text" value="{opts.group.name}" onchange="{wire('this.opts.group.name')}")
        .label.block
            b {voc.icon}
            br
            icon-input(val="{opts.group.icon}" onselected="{onIconSelected}")
        .label.block
            b {voc.color}
            br
            button.inline.square(
                each="{colorClass in ['act', 'accent1', 'error', 'success', 'warning', 'text']}"
                class="{active: parent.opts.group.colorClass === colorClass}"
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
        this.namespace = 'groupEditor';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.setColorClass = colorClass => () => {
            this.opts.group.colorClass = colorClass;
        };
        this.onIconSelected = icon => {
            this.opts.group.icon = icon;
            this.update();
        };
        this.onClose = () => {
            Object.assign(this.opts.group, this.oldGroup);
            if (this.opts.onclose) {
                this.opts.onclose();
            }
        };
        this.oldGroup = JSON.parse(JSON.stringify(this.opts.group));
