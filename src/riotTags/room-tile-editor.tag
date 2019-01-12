room-tile-editor.room-editor-Tiles.tabbed.tall.flexfix
    .flexfix-body
        canvas(
            ref="tiledImage"
            onmousedown="{startTileSelection}"
            onmouseup="{stopTileSelection}"
            onmousemove="{moveTileSelection}"
        )
    .flexfix-footer
        button.inline.wide(onclick="{switchTiledImage}")
            i.icon-search
            span {voc.findTileset}
        .flexrow
            select.wide(onchange="{changeTileLayer}" value="{parent.currentTileLayerId}")
                option(each="{layer, ind in opts.room.tiles}" selected="{parent.currentTileLayerId === ind}" value="{ind}") {layer.hidden? '❌' : '✅'} {layer.depth}
            
            span.act(title="{vocGlob.delete}" onclick="{deleteTileLayer}")
                i.icon-trash
            span.act(title="{parent.currentTileLayer.hidden? voc.show: voc.hide}" onclick="{toggleTileLayerVisibility}")
                i(class="icon-{parent.currentTileLayer.hidden? 'eye' : 'eye-off'}")
            span.act(title="{voc.moveTileLayer}" onclick="{moveTileLayer}")
                i.icon-shuffle
            span.act(title="{vocGlob.add}" onclick="{addTileLayer}")
                i.icon-plus
    graphic-selector(ref="tilesetPicker" if="{pickingTileset}" oncancelled="{onTilesetCancel}" onselected="{onTilesetSelected}")
    script.
        this.parent.tileX = 0;
        this.parent.tileY = 0;
        this.parent.tileSpanX = 1;
        this.parent.tileSpanY = 1;
        if (!('tiles' in this.opts.room) || !this.opts.room.tiles.length) {
            this.opts.room.tiles = [{
                depth: -10,
                tiles: []
            }];
        }
        this.parent.currentTileLayer = this.opts.room.tiles[0];
        this.parent.currentTileLayerId = 0;

        this.namespace = 'roomtiles';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        
        this.deleteTileLayer = e => {
            alertify
            .okBtn(window.languageJSON.common.delete)
            .cancelBtn(window.languageJSON.common.cancel)
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', window.languageJSON.common.tilelayer))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    var tiles = this.opts.room;
                    var index = tiles.tiles.indexOf(this.parent.currentTileLayer);
                    tiles.tiles.splice(index, 1);
                    if (tiles.tiles.length) {
                        this.parent.currentTileLayer = tiles.tiles[0];
                        this.parent.currentTileLayerId = 0;
                    } else {
                        this.parent.currentTileLayer = false;
                    }
                    this.parent.resortRoom();
                    this.parent.refreshRoomCanvas();
                    this.update();
                    alertify
                    .okBtn(window.languageJSON.common.ok)
                    .cancelBtn(window.languageJSON.common.cancel);
                }
            });
        };
        this.moveTileLayer = e => {
            alertify
            .defaultValue(this.parent.currentTileLayer.depth)
            .prompt(window.languageJSON.roomview.newdepth)
            .then(ee => {
                if (ee.inputValue && Number(ee.inputValue)) {
                    this.parent.currentTileLayer.depth = Number(ee.inputValue);
                    this.parent.resortRoom();
                    this.parent.refreshRoomCanvas();
                    this.update();
                }
            });
        };
        this.addTileLayer = e => {
            alertify
            .defaultValue(-10)
            .prompt(window.languageJSON.roomview.newdepth)
            .then(ee => {
                if (ee.inputValue && Number(ee.inputValue)) {
                    var layer = {
                        depth: Number(ee.inputValue),
                        tiles: []
                    };
                    this.opts.room.tiles.push(layer);
                    this.parent.currentTileLayer = layer;
                    this.parent.currentTileLayerId = this.opts.room.tiles.length - 1;
                    this.parent.resortRoom();
                    console.log(this.parent.currentTileLayerId, this.parent.currentTileLayer, this.opts.room.tiles);
                    this.update();
                }
            });
        };
        this.toggleTileLayerVisibility = e => {
            this.parent.currentTileLayer.hidden = !this.parent.currentTileLayer.hidden;
            this.parent.refreshRoomCanvas();
        };
        this.changeTileLayer = e => {
            this.parent.currentTileLayer = this.opts.room.tiles[Number(e.target.value)];
            this.parent.currentTileLayerId = Number(e.target.value);
        };
        this.switchTiledImage = e => {
            this.pickingTileset = true;
        };
        this.onTilesetCancel = e => {
            this.pickingTileset = false;
            this.update();
        };
        this.onTilesetSelected = graph => e => {
            this.parent.currentTileset = graph;
            this.pickingTileset = false;
            this.redrawTileset();
            this.update();
        };

        this.redrawTileset = e => {
            var c = this.refs.tiledImage,
                cx = c.getContext('2d'),
                g = this.parent.currentTileset,
                i = glob.graphmap[g.uid];
            c.width = i.width;
            c.height = i.height;
            cx.globalAlpha = 1;
            cx.drawImage(i, 0, 0);
            cx.strokeStyle = '#0ff';
            cx.lineWidth = 1;
            cx.globalAlpha = 0.5;
            cx.globalCompositeOperation = 'exclusion';
            for (let i = 0, l = Math.min(g.grid[0] * g.grid[1], g.untill || Infinity); i < l; i++) {
                let xx = i % g.grid[0],
                    yy = Math.floor(i / g.grid[0]),
                    x = g.offx + xx * (g.marginx + g.width),
                    y = g.offy + yy * (g.marginy + g.height),
                    w = g.width,
                    h = g.height;
                cx.strokeRect(x, y, w, h);
            }
            cx.globalCompositeOperation = 'source-over';
            cx.globalAlpha = 1;
            cx.lineJoin = 'round';
            cx.strokeStyle = localStorage.UItheme === 'Night'? '#44dbb5' : '#446adb';
            cx.lineWidth = 3;
            let selX = g.offx + this.parent.tileX*(g.width + g.marginx),
                selY = g.offy + this.parent.tileY*(g.height + g.marginy),
                selW = g.width * this.parent.tileSpanX + g.marginx * (this.parent.tileSpanX - 1),
                selH = g.height * this.parent.tileSpanY + g.marginy * (this.parent.tileSpanY - 1);
            cx.strokeRect(-0.5 + selX, -0.5 + selY, selW + 1, selH + 1);
            cx.strokeStyle = localStorage.UItheme === 'Night'? '#1C2B42' : '#fff';
            cx.lineWidth = 1;
            cx.strokeRect(-0.5 + selX, -0.5 + selY, selW + 1, selH + 1);
        };
        this.startTileSelection = e => {
            if (!this.parent.currentTileset) {return;}
            var g = this.parent.currentTileset;
            this.parent.tileSpanX = 1;
            this.parent.tileSpanY = 1;
            this.selectingTile = true;
            this.tileStartX = Math.round((e.layerX - g.offx - g.width*0.5) / (g.width+g.marginx)); 
            this.tileStartX = Math.max(0, Math.min(g.grid[0], this.tileStartX));
            this.tileStartY = Math.round((e.layerY - g.offy - g.height*0.5) / (g.height+g.marginy)); 
            this.tileStartY = Math.max(0, Math.min(g.grid[1], this.tileStartY));
            this.parent.tileX = this.tileStartX;
            this.parent.tileY = this.tileStartY;
            this.redrawTileset();
        };
        this.moveTileSelection = e => {
            if (!this.selectingTile) {return;}
            var g = this.parent.currentTileset;
            this.tileEndX = Math.round((e.layerX - g.offx - g.width*0.5) / (g.width+g.marginx)); 
            this.tileEndX = Math.max(0, Math.min(g.grid[0], this.tileEndX));
            this.tileEndY = Math.round((e.layerY - g.offy - g.height*0.5) / (g.height+g.marginy)); 
            this.tileEndY = Math.max(0, Math.min(g.grid[1], this.tileEndY));
            this.parent.tileSpanX = 1 + Math.abs(this.tileStartX - this.tileEndX);
            this.parent.tileSpanY = 1 + Math.abs(this.tileStartY - this.tileEndY);
            this.parent.tileX = Math.min(this.tileStartX, this.tileEndX);
            this.parent.tileY = Math.min(this.tileStartY, this.tileEndY);
            this.redrawTileset();
        };
        this.stopTileSelection = e => {
            if (!this.selectingTile) {return;}
            this.moveTileSelection(e);
            this.selectingTile = false;
        };