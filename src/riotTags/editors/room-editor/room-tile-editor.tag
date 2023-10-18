//
    @attribute layer (TileLayer)
        A pixi.js container with all its tiles.
    @attribute layers (Iterable<TileLayer>)
        All exising tile layers in the current room.
    @attribute pixieditor (RoomEditor)
        When other attributes are not enough

    @attribute onchangetile (riot function)
        Called with ITileSelection instance as its only argument
    @attribute onchangelayer (riot function)
        Called with TileLayer as its only argument.

    @attribute addlayer (riot function)
        Called when a user wants to add a layer.
        The only argument is an ITileLayerTemplate instance.

room-tile-editor.room-editor-Tiles.flexfix(class="{opts.class}")
    .flexfix-header
        button.inline.wide(onclick="{openTextureSelector}")
            svg.feather
                use(xlink:href="#search")
            span {voc.findTileset}
    .flexfix-body
        canvas.room-tile-editor-aCanvas(
            ref="tiledImage"
            onpointerdown="{startTileSelection}"
            onpointerup="{stopTileSelection}"
            onpointermove="{moveTileSelection}"
        )
    .flexfix-footer
        ul.aMenu.room-tile-editor-aLayerList
            li.checkbox(each="{layer in opts.layers}" onclick="{changeTileLayer}" class="{active: layer === parent.opts.layer}")
                input(type="checkbox" name="tileLayers" checked="{!layer.isHidden}" onchange="{toggleTileLayer}")
                b {layer.zIndex}
                span.a(title="{parent.voc.moveTileLayer}")
                    svg.feather(onclick="{moveTileLayer}")
                        use(xlink:href="#shuffle")
                span.a(title="{parent.vocGlob.delete}")
                    svg.feather(onclick="{deleteTileLayer}")
                        use(xlink:href="#trash")
        button.inline.wide(onclick="{addTileLayer}")
            svg.feather
                use(xlink:href="#plus")
            span {voc.addTileLayer || vocGlob.add}
        .block
            extensions-editor(
                if="{opts.layer}"
                type="tileLayer"
                entity="{opts.layer.extends}"
                compact="true"
                wide="true"
            )
    asset-selector(
        ref="tilesetPicker"
        if="{pickingTileset}"
        assettypes="texture"
        oncancelled="{onTilesetCancel}"
        onselected="{onTilesetSelected}"
    )
    script.
        this.tileX = 0;
        this.tileY = 0;
        this.tileSpanX = 1;
        this.tileSpanY = 1;

        this.namespace = 'roomTiles';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);

        this.on('update', () => {
            if (!this.opts.layer && this.opts.layers.length) {
                this.opts.onchangelayer(this.opts.layers[0]);
                this.update();
            } else if (this.opts.layer && !this.opts.layers.length) {
                this.opts.onchangelayer(void 0);
                this.update();
            }
        });

        this.deleteTileLayer = e => {
            const {layer} = e.item;
            window.alertify
            .okBtn(this.vocGlob.delete)
            .cancelBtn(this.vocGlob.cancel)
            .confirm(this.vocGlob.confirmDelete.replace('{0}', this.vocGlob.tileLayer))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    layer.detach(true);
                    this.opts.onchangelayer(this.opts.layers[0]);
                    this.update();
                    window.alertify
                    .okBtn(this.vocGlob.ok)
                    .cancelBtn(this.vocGlob.cancel);
                }
            });
        };
        this.moveTileLayer = e => {
            const {layer} = e.item;
            window.alertify
            .defaultValue(layer.zIndex)
            .okBtn(this.vocGlob.ok)
            .cancelBtn(this.vocGlob.cancel)
            .prompt(this.vocFull.roomView.newDepth)
            .then(e => {
                if (e.inputValue && Number(e.inputValue)) {
                    const before = layer.zIndex;
                    layer.zIndex = Number(e.inputValue);
                    this.opts.layers.sort((a, b) => b.zIndex - a.zIndex);
                    this.opts.pixieditor.history.pushChange({
                        type: 'propChange',
                        key: 'zIndex',
                        target: layer,
                        before,
                        after: layer.zIndex
                    });
                    this.update();
                }
            });
        };
        this.addTileLayer = () => {
            window.alertify
            .defaultValue(-10)
            .prompt(this.vocFull.roomView.newDepth)
            .then(e => {
                if (e.inputValue && Number(e.inputValue)) {
                    const layer = {
                        depth: Number(e.inputValue),
                        tiles: [],
                        extends: {}
                    };
                    const pixiTileLayer = this.opts.addlayer(layer, true);
                    this.opts.onchangelayer(pixiTileLayer);
                    this.update();
                }
            });
        };
        this.toggleTileLayer = () => {
            this.opts.layer.showToggle();
        };
        this.changeTileLayer = e => {
            this.opts.onchangelayer(e.item.layer);
        };
        this.openTextureSelector = () => {
            this.pickingTileset = true;
        };
        this.onTilesetCancel = () => {
            this.pickingTileset = false;
            this.update();
        };
        this.onTilesetSelected = async textureId => {
            const {getById} = require('./data/node_requires/resources');
            const {getDOMImageFromTexture} = require('./data/node_requires/resources/textures');
            this.currentTexture = getById('texture', textureId);
            this.pickingTileset = false;
            this.update();
            this.currentTextureImg = await getDOMImageFromTexture(this.currentTexture);
            this.redrawTileset();
            this.tileX = this.tileY = 0;
            this.tileSpanX = this.tileSpanY = 1;
            this.sendTileSelection();
            this.update();
        };

        this.redrawTileset = () => {
            var c = this.refs.tiledImage,
                cx = c.getContext('2d'),
                tex = this.currentTexture,
                img = this.currentTextureImg;
            c.width = img.width;
            c.height = img.height;
            if (global.currentProject.settings.rendering.pixelatedrender) {
                c.style.imageRendering = 'pixelated';
            } else {
                c.style.imageRendering = 'unset';
            }
            cx.globalAlpha = 1;
            cx.drawImage(img, 0, 0);
            cx.strokeStyle = '#0ff';
            cx.lineWidth = 1;
            cx.globalAlpha = 0.5;
            cx.globalCompositeOperation = 'exclusion';
            for (let i = 0, l = Math.min(tex.grid[0] * tex.grid[1], tex.untill || Infinity); i < l; i++) {
                const xx = i % tex.grid[0],
                      yy = Math.floor(i / tex.grid[0]),
                      x = tex.offx + xx * (tex.marginx + tex.width),
                      y = tex.offy + yy * (tex.marginy + tex.height),
                      w = tex.width,
                      h = tex.height;
                cx.strokeRect(x, y, w, h);
            }
            cx.globalCompositeOperation = 'source-over';
            cx.globalAlpha = 1;
            cx.lineJoin = 'round';
            cx.strokeStyle = localStorage.UItheme === 'Night' ? '#44dbb5' : '#446adb';
            cx.lineWidth = 3;
            const selX = tex.offx + this.tileX * (tex.width + tex.marginx),
                  selY = tex.offy + this.tileY * (tex.height + tex.marginy),
                  selW = tex.width * this.tileSpanX + tex.marginx * (this.tileSpanX - 1),
                  selH = tex.height * this.tileSpanY + tex.marginy * (this.tileSpanY - 1);
            cx.strokeRect(-0.5 + selX, -0.5 + selY, selW + 1, selH + 1);
            cx.strokeStyle = localStorage.UItheme === 'Night' ? '#1C2B42' : '#fff';
            cx.lineWidth = 1;
            cx.strokeRect(-0.5 + selX, -0.5 + selY, selW + 1, selH + 1);
        };
        this.startTileSelection = e => {
            if (!this.currentTexture) {
                return;
            }
            // Adjust the pointer coordinates to account for potential scaling
            const bbox = e.target.getBoundingClientRect();
            const px = e.layerX / bbox.width * e.target.width,
                  py = e.layerY / bbox.height * e.target.height;
            const tex = this.currentTexture;
            this.tileSpanX = 1;
            this.tileSpanY = 1;
            this.selectingTile = true;
            this.tileStartX = Math.round((px - tex.offx - tex.width * 0.5) / (tex.width + tex.marginx));
            this.tileStartX = Math.max(0, Math.min(tex.grid[0], this.tileStartX));
            this.tileStartY = Math.round((py - tex.offy - tex.height * 0.5) / (tex.height + tex.marginy));
            this.tileStartY = Math.max(0, Math.min(tex.grid[1], this.tileStartY));
            this.tileX = this.tileStartX;
            this.tileY = this.tileStartY;
            this.redrawTileset();
        };
        this.moveTileSelection = e => {
            if (!this.selectingTile) {
                return;
            }
            // Adjust the pointer coordinates to account for potential scaling
            const bbox = e.target.getBoundingClientRect();
            const px = e.layerX / bbox.width * e.target.width,
                  py = e.layerY / bbox.height * e.target.height;
            const tex = this.currentTexture;
            this.tileEndX = Math.round((px - tex.offx - tex.width * 0.5) / (tex.width + tex.marginx));
            this.tileEndX = Math.max(0, Math.min(tex.grid[0], this.tileEndX));
            this.tileEndY = Math.round((py - tex.offy - tex.height * 0.5) / (tex.height + tex.marginy));
            this.tileEndY = Math.max(0, Math.min(tex.grid[1], this.tileEndY));
            this.tileSpanX = 1 + Math.abs(this.tileStartX - this.tileEndX);
            this.tileSpanY = 1 + Math.abs(this.tileStartY - this.tileEndY);
            this.tileX = Math.min(this.tileStartX, this.tileEndX);
            this.tileY = Math.min(this.tileStartY, this.tileEndY);
            this.redrawTileset();
        };

        this.stopTileSelection = e => {
            if (!this.selectingTile) {
                return;
            }
            this.moveTileSelection(e);
            this.sendTileSelection();
            this.selectingTile = false;
        };
        this.sendTileSelection = () => {
            this.opts.onchangetile({
                startX: this.tileX,
                startY: this.tileY,
                spanX: this.tileSpanX,
                spanY: this.tileSpanY,
                texture: this.currentTexture
            });
        };
