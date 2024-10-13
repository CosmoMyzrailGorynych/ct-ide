//-
    @attribute asset (IScriptable)
    @attribute [event] (IScriptableEvent)
        Required for assets other than scripts. The currently edited event.
    @attribute [scriptmode] (atomic)
        Disables some features of the editor that make sense for script asset type.
    @attribute onrename (riot function)
        A function that is called when a user renames a property or a variable in Catnip blocks.
        The function is provided with an object of this structure:
        {
            type: 'prop' | 'variable',
            from: string, // old name of the property/variable
            to: string // new name of the prop/var
        }
        The called function must apply the following changes to all the relevant blocks in an asset.
        This function is passed to this tag's catnip-library block as an attribute.
catnip-editor(class="flexrow {opts.class}" onpointermove="{repositionGhost}" ondragover="{repositionGhost}" ondragend="{endGhost}")
    .pad.dim(if="{!opts.event && !opts.scriptmode}") {vocFull.scriptables.createEventHint}
    catnip-block-list.catnip-editor-scriptable-aCanvas(
        ref="canvas"
        class="{dragging: dragInProgress}"
        blocks="{opts.scriptmode ? opts.asset.code : opts.event.code}"
        showplaceholder="showplaceholder"
        if="{opts.event || opts.scriptmode}"
        onclick="{tryDeselect}"
        asset="{opts.asset}"
        scriptableevent="{opts.event}"
    )
    .flexfix(ondragenter="{handlePreDrop}" ondragover="{handlePreDrop}" if="{opts.event || opts.scriptmode}")
        catnip-library.flexfix-body(
            props="{opts.scriptmode ? [] : opts.asset.properties}"
            variables="{opts.scriptmode ? opts.asset.variables : opts.event.variables}"
            asset="{opts.asset}"
            behaviorprops="{opts.scriptmode ? [] : getBehaviorFields(opts.asset)}"
            scriptmode="{opts.scriptmode}"
            eventvars="{opts.scriptmode ? [] : getLocals(opts.event.eventKey, opts.event.lib)}"
            onrename="{opts.onrename}"
        )
        .flexfix-footer.catnip-editor-aTrashZone(
            title="{voc.trashZoneHint}"
            ondragenter="{handlePreDrop}"
            ondragover="{handlePreDrop}"
            ondrop="{nuke}"
        )
            svg.feather
                use(xlink:href="#trash")
    .catnip-editor-aGhost(ref="ghost")
    script.
        this.namespace = 'catnip';
        this.mixin(require('src/node_requires/riotMixins/voc').default);
        const isInvalidDrop = e =>
            !e.dataTransfer.types.includes('ctjsblocks/computed') &&
            !e.dataTransfer.types.includes('ctjsblocks/command');
        this.handlePreDrop = e => {
            if (!isInvalidDrop(e)) {
                e.preventUpdate = true;
                e.preventDefault(); // Tells that we do want to accept the drop
            }
        };

        const {endBlocksTransmit, clearSelection, isAnythingSelected} = require('src/node_requires/catnip');
        const {getLocals, getBehaviorFields} = require('src/node_requires/events');
        this.getBehaviorFields = getBehaviorFields;
        this.getLocals = getLocals;
        this.nuke = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            // Put blocks in a newly-created array, which will then be garbage-collected.
            endBlocksTransmit([], 0);
            e.preventDefault();
            e.stopPropagation();
        };

        this.blockGhost = '';
        this.dx = 0;
        this.dy = 0;
        const startGhost = (e, html, dx, dy) => {
            // check if we are in an opened editor
            if (!this.root.closest('[isactiveeditor]')) {
                e.preventUpdate = true;
                return;
            }
            this.blockGhost = html;
            this.dx = dx;
            this.dy = dy;
            this.refs.ghost.innerHTML = html;
            this.dragInProgress = true;
            this.update();
            this.refs.ghost.style.left = `${e.clientX + this.dx}px`;
            this.refs.ghost.style.top = `${e.clientY + this.dy}px`;
        };
        this.endGhost = () => {
            this.refs.ghost.innerHTML = this.blockGhost = '';
            this.dragInProgress = false;
            this.update();
        };
        const dropSelection = tab => {
            if ((typeof tab === 'object') && tab.uid === this.opts.asset.uid) {
                clearSelection();
            }
        };
        const dropSelectionOutside = e => {
            const closest = e.target.closest('catnip-editor');
            if (!closest || closest !== this.root) {
                clearSelection();
            }
        };
        window.signals.on('blockTransmissionStart', startGhost);
        window.signals.on('blockTransmissionEnd', this.endGhost);
        window.signals.on('globalTabChanged', dropSelection);
        document.body.addEventListener('click', dropSelectionOutside);
        this.on('unmount', () => {
            window.signals.off('blockTransmissionStart', startGhost);
            window.signals.off('blockTransmissionEnd', this.endGhost);
            window.signals.off('globalTabChanged', dropSelection);
            document.body.removeEventListener('click', dropSelectionOutside);
        });
        this.repositionGhost = e => {
            e.preventUpdate = true;
            if (!this.blockGhost || !this.refs.ghost) {
                return;
            }
            this.refs.ghost.style.left = `${e.clientX + this.dx}px`;
            this.refs.ghost.style.top = `${e.clientY + this.dy}px`;
        };

        this.tryDeselect = e => {
            if (e.target === this.refs.canvas.root && isAnythingSelected()) {
                clearSelection();
            } else {
                e.preventUpdate = true;
            }
        };
