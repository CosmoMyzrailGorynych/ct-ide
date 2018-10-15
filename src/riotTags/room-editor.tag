room-editor.panel.view
    .toolbar.borderright.tall
        .settings.nogrow.noshrink
            b {voc.name}
            br
            input.wide(type="text" value="{room.name}" onchange="{wire('this.room.name')}")
            .anErrorNotice(if="{nameTaken}") {vocGlob.nametaken}
            .fifty.npt.npb.npl
                b {voc.width}
                br
                input.wide(type="number" value="{room.width}" onchange="{wire('this.room.width')}")
            .fifty.npt.npb.npr
                b {voc.height}
                br
                input.wide(type="number" value="{room.height}" onchange="{wire('this.room.height')}")
            br
            button.wide(onclick="{openRoomEvents}")
                i.icon-confirm(if="{room.oncreate || room.onstep || room.ondestroy || room.ondraw}")
                span {voc.events}
        .palette
            .tabwrap
                ul.tabs.nav.noshrink.nogrow
                    li(onclick="{changeTab('roomcopies')}" class="{active: tab === 'roomcopies'}") {voc.copies}
                    li(onclick="{changeTab('roombackgrounds')}" class="{active: tab === 'roombackgrounds'}") {voc.backgrounds}
                    li(onclick="{changeTab('roomtiles')}" class="{active: tab === 'roomtiles'}") {voc.tiles}
                .relative
                    .room-editor-TypeSwatches.tabbed.tall(show="{tab === 'roomcopies'}")
                        .aSearchWrap
                            input.inline(type="text" onkeyup="{fuseSearch}")
                        .room-editor-aTypeSwatch(if="{!searchResults}" onclick="{roomUnpickType}" class="{active: currentType === -1}")
                            span {window.languageJSON.common.none}
                            img(src="/img/nograph.png")
                        .room-editor-aTypeSwatch(each="{type in (searchResults? searchResults : types)}" title="{type.name}" onclick="{selectType(type)}" class="{active: type === currentType}")
                            span {type.name}
                            img(src="{type.graph === -1? '/img/nograph.png' : (glob.graphmap[type.graph].src.split('?')[0] + '_prev.png?' + getTypeGraphRevision(type))}")
                        .room-editor-aTypeSwatch.filler
                        .room-editor-aTypeSwatch.filler
                        .room-editor-aTypeSwatch.filler
                        .room-editor-aTypeSwatch.filler
                        .room-editor-aTypeSwatch.filler
                        .room-editor-aTypeSwatch.filler
                        .room-editor-aTypeSwatch.filler
                    .room-editor-Backgrounds.tabbed.tall(show="{tab === 'roombackgrounds'}")
                        ul
                            li.bg(each="{background, ind in room.backgrounds}" oncontextmenu="{onBgContextMenu}")
                                img(src="{background.graph === -1? '/img/nograph.png' : (glob.graphmap[background.graph].src.split('?')[0] + '_prev.png?' + Math.random())}" onclick="{onChangeBgGraphic}")
                                span(onclick="{onChangeBgDepth}") {background.depth}

                        button.inline.wide(onclick="{roomAddBg}")
                            i.icon-plus
                            span {voc.add}
                    .room-editor-Tiles.tabbed.tall.flexfix(show="{tab === 'roomtiles'}")
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
                                select.wide(onchange="{changeTileLayer}" value="{currentTileLayerId}")
                                    option(each="{layer, ind in room.tiles}" selected="{currentTileLayerId === ind}" value="{ind}") {layer.hidden? '❌' : '✅'} {layer.depth}
                                
                                span.act(title="{vocGlob.delete}" onclick="{deleteTileLayer}")
                                    i.icon-trash
                                span.act(title="{currentTileLayer.hidden? voc.show: voc.hide}" onclick="{toggleTileLayerVisibility}")
                                    i(class="icon-{currentTileLayer.hidden? 'eye' : 'eye-off'}")
                                span.act(title="{voc.moveTileLayer}" onclick="{moveTileLayer}")
                                    i.icon-shuffle
                                span.act(title="{vocGlob.add}" onclick="{addTileLayer}")
                                    i.icon-plus
        .done.nogrow
            button.wide#roomviewdone(onclick="{roomSave}")
                i.icon-confirm
                span {voc.done}
    .editor(ref="canvaswrap")
        canvas(
            ref="canvas"
            onclick="{onCanvasClick}"
            onmousedown="{onCanvasPress}"
            onmousemove="{onCanvasMove}"
            onmouseup="{onCanvasMouseUp}"
            onmouseout="{refreshRoomCanvas}"
            onmousewheel="{onCanvasWheel}"
            oncontextmenu="{onCanvasContextMenu}"
        )
        .shift
            button.inline.square(title="{voc.shift}" onclick="{roomShift}")
                i.icon-move
            span {voc.hotkeysNotice}
        .zoom
            b {voc.zoom}
            div.button-stack
                button#roomzoom12.inline(onclick="{roomToggleZoom(0.125)}" class="{active: zoomFactor === 0.125}") 12%
                button#roomzoom25.inline(onclick="{roomToggleZoom(0.25)}" class="{active: zoomFactor === 0.25}") 25%
                button#roomzoom50.inline(onclick="{roomToggleZoom(0.5)}" class="{active: zoomFactor === 0.5}") 50%
                button#roomzoom100.inline(onclick="{roomToggleZoom(1)}" class="{active: zoomFactor === 1}") 100%
                button#roomzoom200.inline(onclick="{roomToggleZoom(2)}" class="{active: zoomFactor === 2}") 200%
                button#roomzoom400.inline(onclick="{roomToggleZoom(4)}" class="{active: zoomFactor === 4}") 400%
        .grid
            button#roomgrid(onclick="{roomToggleGrid}" class="{active: room.gridX > 0}") 
                span {voc[room.gridX > 0? 'gridoff' : 'grid']}
        .center
            button#roomcenter(onclick="{roomToCenter}") {voc.tocenter}
    room-events-editor(if="{editingCode}" room="{room}")
    graphic-selector(ref="graphPicker" if="{pickingBackground}" onselected="{onBackgroundGraphSelected}")
    graphic-selector(ref="tilesetPicker" if="{pickingTileset}" onselected="{onTilesetSelected}")
    script.
        this.editingCode = false;
        this.pickingBackground = false;
        this.forbidDrawing = false;
        const fs = require('fs-extra'),
              gui = require('nw.gui');
        const win = gui.Window.get();
        this.namespace = 'roomview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.updateTypeList = () => {
            this.types = [...window.currentProject.types];
            this.types.sort((a, b) => a.name.localeCompare(b.name));
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
        const Fuse = require('fuse.js');
        this.fuseSearch = e => {
            if (e.target.value.trim()) {
                var fuse = new Fuse(this.types, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        
        this.room = this.opts.room;
        if (!('tiles' in this.room) || !this.room.tiles.length) {
            this.room.tiles = [{
                depth: -10,
                tiles: []
            }];
        }
        this.currentTileLayer = this.room.tiles[0];
        this.currentTileLayerId = 0;

        this.roomx = this.room.width / 2;
        this.roomy = this.room.height / 2;
        this.zoomFactor = 1;
        this.room.gridX = this.room.gridX || this.room.grid || 64;
        this.room.gridY = this.room.gridY || this.room.grid || 64;
        this.currentType = -1;
        this.dragging = false;
        this.tab = 'roomcopies';
        
        this.getTypeGraphRevision = type => window.glob.graphmap[type.graph].g.lastmod;
        
        var updateCanvasSize = e => {
            var canvas = this.refs.canvas,
                sizes = this.refs.canvaswrap.getBoundingClientRect();
            if (canvas.width != sizes.width || canvas.height != sizes.height) {
                canvas.width = sizes.width;
                canvas.height = sizes.height;
            }
            setTimeout(this.refreshRoomCanvas, 10);
        };
        this.updateTypeList();
        this.on('update', () => {
            if (window.currentProject.rooms.find(room => 
                this.room.name === room.name && this.room !== room
            )) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        });
        this.on('mount', () => {
            this.room = this.opts.room;
            this.refs.canvas.x = this.refs.canvas.getContext('2d');
            this.gridCanvas = document.createElement('canvas');
            this.gridCanvas.x = this.gridCanvas.getContext('2d');
            this.redrawGrid();
            win.on('resize', updateCanvasSize);
            updateCanvasSize();
        });
        this.on('unmount', () => {
            win.removeAllListeners('resize');
        });
        
        this.openRoomEvents = e => {
            this.editingCode = true;
        };
        
        // Навигация по комнате, настройки вида
        this.roomToggleZoom = zoomFactor => e => {
            this.zoomFactor = zoomFactor;
            this.redrawGrid();
            this.refreshRoomCanvas();
        };
        this.roomToCenter = e => {
            this.roomx = this.room.width / 2;
            this.roomy = this.room.height / 2;
            this.refreshRoomCanvas();
        };
        this.redrawGrid = () => {
            this.gridCanvas.width = this.room.gridX;
            this.gridCanvas.height = this.room.gridY;
            this.gridCanvas.x.clearRect(0, 0, this.room.gridX, this.room.gridY);
            this.gridCanvas.x.globalAlpha = 0.3;
            this.gridCanvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#44dbb5' : '#446adb';
            this.gridCanvas.x.lineWidth = 1 / this.zoomFactor;
            this.gridCanvas.x.strokeRect(0.5 / this.zoomFactor, 0.5 / this.zoomFactor, this.room.gridX, this.room.gridY);
        };
        this.roomToggleGrid = () => {
            if (this.room.gridX === 0) {
                alertify
                .confirm(this.voc.gridsize + `<br/><input type="number" value="64" style="width: 6rem;" min=2 id="theGridSizeX"> x <input type="number" value="64" style="width: 6rem;" min=2 id="theGridSizeY">`)
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        this.room.gridX = Number(document.getElementById('theGridSizeX').value);
                        this.room.gridY = Number(document.getElementById('theGridSizeY').value);
                    }
                    this.redrawGrid();
                    this.refreshRoomCanvas();
                    this.update();
                });
            } else {
                this.refreshRoomCanvas();
                this.room.gridX = 0;
                this.room.gridY = 0;
            }
        };
        
        // Работа с копиями
        this.tab = 'roomcopies';
        this.changeTab = tab => e => {
            this.tab = tab;
            if (tab === 'roombackgrounds') {
                this.roomUnpickType();
            } else {
                this.updateTypeList();
            }
        };
        this.roomUnpickType = e => {
            this.currentType = -1;
        };
        this.selectType = type => e => {
            this.currentType = type;
        };
        var lastTypeLayer;
        var findTypeLayer = a => {
            if (a.depth === this.currentType.depth) {
                lastTypeLayer = a;
                return true;
            }
            return false;
        };

        /** Преобразовать x на канвасе в x на комнате */
        this.xToRoom = x => (x - ~~(this.refs.canvas.width / 2)) / this.zoomFactor + this.roomx;
        /** Преобразовать y на канвасе в y на комнате */
        this.yToRoom = y => (y - ~~(this.refs.canvas.height / 2)) / this.zoomFactor + this.roomy;
        /** Преобразовать x в комнате в x на канвасе */
        this.xToCanvas = x => (x - this.roomx) * this.zoomFactor + ~~(this.refs.canvas.width / 2);
        /** Преобразовать y в комнате в y на канвасе */
        this.yToCanvas = y => (y - this.roomy) * this.zoomFactor + ~~(this.refs.canvas.height / 2);
        
        // При клике на канвас помещает копию на соответствующий слой
        this.onCanvasClickCopies = e => {
            // Если не выбран тип создаваемой копии, или идёт удаление копий, то ничего не делаем
            if ((this.currentType === -1 || e.ctrlKey) && e.button === 0) {
                return;
            }
            var targetLayer;
            if (!this.room.layers.some(findTypeLayer)) {
                // если нет нашего слоя, создадим его...
                targetLayer = {
                    depth: this.currentType.depth,
                    copies: []
                };
                this.room.layers.push(targetLayer);
                // отсортируем слои по глубине...
                this.room.layers.sort(function (a, b) {
                    return a.depth - b.depth;
                });
            } else {
                targetLayer = lastTypeLayer;
            }

            if (this.room.gridX == 0 || e.altKey) {
                if (this.lastCopyX !== ~~(this.xToRoom(e.offsetX)) ||
                    this.lastCopyY !== ~~(this.yToRoom(e.offsetY))
                ) {
                    this.lastCopyX = ~~(this.xToRoom(e.offsetX));
                    this.lastCopyY = ~~(this.yToRoom(e.offsetY));
                    targetLayer.copies.push({
                        x: this.lastCopyX,
                        y: this.lastCopyY,
                        uid: this.currentType.uid
                    });
                    this.refreshRoomCanvas();
                }
            } else {
                var x = ~~(this.xToRoom(e.offsetX)),
                    y = ~~(this.yToRoom(e.offsetY));
                if (this.lastCopyX !== Math.round(x / this.room.gridX) * this.room.gridX ||
                    this.lastCopyY !== Math.round(y / this.room.gridY) * this.room.gridY
                ) {
                    this.lastCopyX = Math.round(x / this.room.gridX) * this.room.gridX;
                    this.lastCopyY = Math.round(y / this.room.gridY) * this.room.gridY;
                    targetLayer.copies.push({
                        x: this.lastCopyX,
                        y: this.lastCopyY,
                        uid: this.currentType.uid
                    });
                    this.refreshRoomCanvas();
                }
            }
        };
        this.onCanvasClick = e => {
            if (this.tab === 'roomcopies') {
                this.onCanvasClickCopies(e);
            } else if (this.tab === 'roomtiles') {
                this.onCanvasClickTiles(e);
            }
        };
        /** При нажатии на канвас, если не выбрана копия, то начинаем перемещение */
        this.onCanvasPress = e => {
            this.mouseDown = true;
            if ((this.currentType === -1 && this.tab !== 'roomtiles' && e.button === 0 && !e.ctrlKey) || e.button === 1) {
                this.dragging = true;
            }
            this.startx = e.offsetX;
            this.starty = e.offsetY;
        };
        this.onCanvasMouseUpTiles = e => {
            if (this.currentTileLayer && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > 16) {
                // Было прямоугольное выделение
                this.selectedTiles = [];
                var x1 = this.xToRoom(this.startx),
                    y1 = this.yToRoom(this.starty),
                    x2 = this.xToRoom(e.offsetX),
                    y2 = this.yToRoom(e.offsetY),
                    xmin = Math.min(x1, x2),
                    xmax = Math.max(x1, x2),
                    ymin = Math.min(y1, y2),
                    ymax = Math.max(y1, y2);
                for (const tile of this.currentTileLayer.tiles) {
                    let g = glob.graphmap[tile.graph].g;
                    if (tile.x > xmin && tile.x + g.width < xmax &&
                        tile.y > ymin && tile.y + g.height < ymax) {
                        this.selectedTiles.push(tile);
                    }
                }
                this.refreshRoomCanvas();
            } else if (this.currentTileLayer) {
                this.selectedTiles = [];
            }
        };
        /** и безусловно прекращаем перемещение при отпускании мыши */
        this.onCanvasMouseUp = e => {
            this.mouseDown = false;
            this.lastCopyX = null;
            this.lastCopyY = null;
            this.lastTileX = null;
            this.lastTileY = null;
            if (this.dragging) {
                this.dragging = false;
            } else {
                if (this.tab === 'roomtiles') {
                    this.onCanvasMouseUpTiles(e);
                }
            }
        };
        this.drawDeleteCircle = e => {
            // Рисовка кружка для удаления копий
            var maxdist = Math.max(this.room.gridX, this.room.gridY);
            this.refreshRoomCanvas(e);
            var x = this.refs.canvas.x;
            x.fillStyle = '#F00';
            x.strokeStyle = '#000';
            x.globalAlpha = 0.5;
            x.beginPath();
            x.arc(this.xToRoom(e.offsetX), this.yToRoom(e.offsetY), maxdist, 0, 2 * Math.PI);
            x.fill();
            x.stroke();
        };
        this.onCanvasMoveCopies = e => {
            if (e.ctrlKey) {
                if (this.mouseDown && this.room.layers.length !== 0) {
                    var type = this.room.layers[0].copies[0],
                        pos = 0,
                        layer, l,
                        done = false, 
                        fromx = this.xToRoom(e.offsetX),
                        fromy = this.yToRoom(e.offsetY);
                    var maxdist = Math.max(this.room.gridX, this.room.gridY);
                    for (let i = 0, li = this.room.layers.length; i < li; i++) {
                        let layerCopies = this.room.layers[i].copies;
                        for (let j = 0, lj = layerCopies.length; j < lj; j++) {
                            let xp = layerCopies[j].x - fromx,
                                yp = layerCopies[j].y - fromy;
                            l = Math.sqrt(xp * xp + yp * yp);
                            if (l < maxdist) {
                                layer = i;
                                pos = j;
                                done = true;
                                break;
                            }
                        }
                        if (done) {
                            break;
                        }
                    }
                    if (done) {
                        this.room.layers[layer].copies.splice(pos, 1);
                        if (this.room.layers[layer].copies.length == 0) {
                            this.room.layers.splice(layer,1);
                        }
                    }
                }
                this.drawDeleteCircle(e);
            } else if (this.currentType !== -1) {
                let img, graph, w, h, grax, gray, ox, oy;
                // превью вставки
                this.refreshRoomCanvas(e);
                this.refs.canvas.x.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
                this.refs.canvas.x.globalAlpha = 0.5;
                if (this.currentType.graph != -1) {
                    img = window.glob.graphmap[this.currentType.graph];
                    graph = img.g;
                    ox = graph.offx;
                    oy = graph.offy;
                    w = graph.width;
                    h = graph.height;
                    grax = graph.axis[0];
                    gray = graph.axis[1];
                } else {
                    img = window.glob.graphmap[-1];
                    w = h = 32;
                    ox = oy = 0;
                    grax = gray = 16;
                }
                if (this.room.gridX === 0 || e.altKey) {
                    this.refs.canvas.x.drawImage(
                        img,
                        ox, oy, w, h,
                        e.offsetX / this.zoomFactor - grax, e.offsetY / this.zoomFactor - gray, w, h);
                } else {
                    // если есть сетка, то координаты предварительной копии нужно отснэпить по сетке
                    var dx = this.xToRoom(e.offsetX),
                        dy = this.yToRoom(e.offsetY);
                    w = graph.width;
                    h = graph.height;
                    this.refs.canvas.x.drawImage(
                        img, ox, oy, w, h,
                        this.xToCanvas(Math.round(dx / this.room.gridX) * this.room.gridX) / this.zoomFactor - grax, 
                        this.yToCanvas(Math.round(dy / this.room.gridY) * this.room.gridY) / this.zoomFactor - gray, 
                        w, h);
                }
            }
        };

        this.onCanvasMoveTiles = e => {
            if (e.ctrlKey) {
                if (this.mouseDown && this.currentTileLayer) {
                    var pos = 0,
                        l,
                        done = false, 
                        fromx = this.xToRoom(e.offsetX),
                        fromy = this.yToRoom(e.offsetY);
                    var maxdist = Math.max(this.room.gridX, this.room.gridY);
                    for (let j = 0, lj = this.currentTileLayer.tiles.length; j < lj; j++) {
                        let xp = this.currentTileLayer.tiles[j].x - fromx,
                            yp = this.currentTileLayer.tiles[j].y - fromy;
                        l = Math.sqrt(xp * xp + yp * yp);
                        if (l < maxdist) {
                            pos = j;
                            done = true;
                            break;
                        }
                    }
                    if (done) {
                        this.currentTileLayer.tiles.splice(pos, 1);
                    }
                }
                this.drawDeleteCircle(e);
            } else if (this.mouseDown && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > 16) {
                this.refreshRoomCanvas(e);
                // рисовка прямоугольного выделения
                let x1 = this.xToRoom(this.startx),
                    x2 = this.xToRoom(e.offsetX),
                    y1 = this.yToRoom(this.starty),
                    y2 = this.yToRoom(e.offsetY);
                this.drawSelection(x1, y1, x2, y2);
                return;
            } else if (this.currentTileset) {
                // превью вставки тайла
                this.refreshRoomCanvas(e);
                this.refs.canvas.x.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
                this.refs.canvas.x.globalAlpha = 0.5;
                let w, h, sx, sy,
                    img = glob.graphmap[this.currentTileset.uid],
                    graph = this.currentTileset;
                sx = graph.offx + (graph.width + graph.marginx) * this.tileX - graph.marginx;
                sy = graph.offy + (graph.height + graph.marginy) * this.tileY - graph.marginy;
                w = (graph.width + graph.marginx) * this.tileSpanX - graph.marginx;
                h = (graph.height + graph.marginy) * this.tileSpanY - graph.marginy;
                if (this.room.gridX === 0 || e.altKey) {
                    this.refs.canvas.x.drawImage(
                        img,
                        sx, sy, w, h,
                        e.offsetX / this.zoomFactor,
                        e.offsetY / this.zoomFactor,
                        w, h);
                } else {
                    // если есть сетка, то координаты предварительного тайла нужно отснэпить по сетке
                    dx = this.xToRoom(e.offsetX);
                    dy = this.yToRoom(e.offsetY);
                    this.refs.canvas.x.drawImage(
                        img,
                        sx, sy, w, h,
                        this.xToCanvas(Math.round(dx / this.room.gridX) * this.room.gridX) / this.zoomFactor, 
                        this.yToCanvas(Math.round(dy / this.room.gridY) * this.room.gridY) / this.zoomFactor, 
                        w, h);
                }
            }
        };
        /** Начинаем перемещение, или же показываем предварительное расположение новой копии */
        this.onCanvasMove = e => {
            if (this.dragging) {
                // перетаскивание
                this.roomx -= ~~(e.movementX / this.zoomFactor);
                this.roomy -= ~~(e.movementY / this.zoomFactor);
                this.refreshRoomCanvas(e);
            } else if (e.shiftKey && this.mouseDown) { // если зажата мышь и клавиша Shift, то создавать больше копий/тайлов
                this.onCanvasClick(e);
            } else if (this.tab === 'roomcopies') {
                this.onCanvasMoveCopies(e);
            } else if (this.tab === 'roomtiles') {
                this.onCanvasMoveTiles(e);
            }
        };
        
        /** При прокрутке колёсиком меняем фактор зума */
        this.onCanvasWheel = e => {
            if (e.wheelDelta > 0) {
                // in
                if (this.zoomFactor === 2) {
                    this.zoomFactor = 4;
                } else if (this.zoomFactor === 1) {
                    this.zoomFactor = 2;
                } else if (this.zoomFactor === 0.5) {
                    this.zoomFactor = 1;
                } else if (this.zoomFactor === 0.25) {
                    this.zoomFactor = 0.5;
                } else if (this.zoomFactor === 0.125) {
                    this.zoomFactor = 0.25;
                }
            } else {
                // out
                if (this.zoomFactor === 4) {
                    this.zoomFactor = 2;
                } else if (this.zoomFactor === 2) {
                    this.zoomFactor = 1;
                } else if (this.zoomFactor === 1) {
                    this.zoomFactor = 0.5;
                } else if (this.zoomFactor === 0.5) {
                    this.zoomFactor = 0.25;
                } else if (this.zoomFactor === 0.25) {
                    this.zoomFactor = 0.125;
                }
            }
            this.redrawGrid();
            this.refreshRoomCanvas(e);
            this.update();
        };
        this.onCanvasContextMenuCopies = e => {
            // Сначала ищется ближайшая к курсору копия. Если слоёв в комнате нет, то всё отменяется
            if (!this.room.layers.length) {return false;}
            var closest = this.room.layers[0].copies[0],
                pos = 0,
                length = Infinity,
                layer, l, 
                fromx = this.xToRoom(e.offsetX),
                fromy = this.yToRoom(e.offsetY);
            for (let i = 0, li = this.room.layers.length; i < li; i++) {
                let layerCopies = this.room.layers[i].copies;
                for (let j = 0, lj = layerCopies.length; j < lj; j++) {
                    let xp = layerCopies[j].x - fromx,
                        yp = layerCopies[j].y - fromy;
                    l = Math.sqrt(xp * xp + yp * yp);
                    if (l < length) {
                        length = l;
                        layer = i;
                        pos = j;
                    }
                }
            }
            
            var copy = this.room.layers[layer].copies[pos],
                type = window.currentProject.types[glob.typemap[copy.uid]],
                graph = glob.graphmap[type.graph].g;
            this.closestType = type;
            this.closestLayer = layer;
            this.closestPos = pos;

            // рисовка выделения копии
            this.refreshRoomCanvas();
            var left, top, height, width;
            if (type.graph !== -1) {
                left = copy.x - graph.axis[0] - 1.5;
                top = copy.y - graph.axis[1] - 1.5;
                width = graph.width * (copy.tx || 1) + 3;
                height = graph.height * (copy.ty || 1) + 3;
            } else {
                left = copy.x - 16 - 1.5;
                top = copy.y - 16 - 1.5;
                height = 32 + 3;
                width = 32 + 3;
            }
            this.drawSelection(left, top, left+width, top+height);
    
            this.forbidDrawing = true;
            setTimeout(() => {
                this.forbidDrawing = false;
            }, 500);
            this.roomCanvasMenu.items[0].label = window.languageJSON.roomview.deletecopy.replace('{0}', type.name);
            this.roomCanvasMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        this.onCanvasContextMenu = e => {
            this.dragging = false;
            this.mouseDown = false;
            if (this.tab === 'roomcopies') {
                this.onCanvasContextMenuCopies(e);
            } else if (this.tab === 'roomtiles') {
                if (this.selectedTiles && this.selectedTiles.length) {
                    this.onCanvasContextMenuMultipleTiles(e);
                } else {
                    this.onCanvasContextMenuTiles(e);
                }
            }
        };
        
        // Контекстное меню по нажатию на холст
        this.roomCanvasMenu = new gui.Menu();
        this.roomCanvasMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.deletecopy.replace('{0}', this.closestType),
            click: () => {
                this.room.layers[this.closestLayer].copies.splice(this.closestPos, 1);
                if (this.room.layers[this.closestLayer].copies.length == 0) {
                    this.room.layers.splice(this.closestLayer,1);
                }
                this.refreshRoomCanvas();
            },
            key: 'Delete'
        }));
        this.roomCanvasMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.changecopyscale,
            click: () => {
                var copy = this.room.layers[this.closestLayer].copies[this.closestPos];
                window.alertify.confirm(`
                    ${window.languageJSON.roomview.changecopyscale}
                    <label class="block">X: 
                        <input id="copyscalex" type="number" value="${copy.tx || 1}" />
                    </label>
                    <label class="block">Y: 
                        <input id="copyscaley" type="number" value="${copy.ty || 1}" />
                    </label>
                `)
                .then((e, a) => {
                    if (e.buttonClicked === 'ok') {
                        copy.tx = Number(document.getElementById('copyscalex').value) || 1,
                        copy.ty = Number(document.getElementById('copyscaley').value) || 1;
                        this.refreshRoomCanvas();
                    }
                });
            }
        }));
        this.roomCanvasMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.shiftcopy,
            click: () => {
                var copy = this.room.layers[this.closestLayer].copies[this.closestPos];
                window.alertify.confirm(`
                    ${window.languageJSON.roomview.shiftcopy}
                    <label class="block">X: 
                        <input id="copypositionx" type="number" value="${copy.x}" />
                    </label>
                    <label class="block">Y: 
                        <input id="copypositiony" type="number" value="${copy.y}" />
                    </label>
                `)
                .then((e, a) => {
                    if (e.buttonClicked === 'ok') {
                        copy.x = Number(document.getElementById('copypositionx').value) || 0,
                        copy.y = Number(document.getElementById('copypositiony').value) || 0;
                        this.refreshRoomCanvas();
                    }
                });
            }
        }));
        
        // Позволяет переместить сразу все копии в комнате
        this.roomShift = e => {
            window.alertify.confirm(`
                ${window.languageJSON.roomview.shifttext}
                <label class="block">X: 
                    <input id="roomshiftx" type="number" value="${this.room.gridX}" />
                </label>
                <label class="block">Y: 
                    <input id="roomshifty" type="number" value="${this.room.gridY}" />
                </label>
            `)
            .then((e, a) => {
                if (e.buttonClicked === 'ok') {
                    var dx = Number(document.getElementById('roomshiftx').value) || 0,
                        dy = Number(document.getElementById('roomshifty').value) || 0;
                    for (let i = 0, l = this.room.layers.length; i < l; i++) {
                        let layer = this.room.layers[i];
                        for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                            layer.copies[j].x += dx;
                            layer.copies[j].y += dy;
                        }
                    }
                    this.refreshRoomCanvas();
                }
            });
        };
        
        // Работа с фонами
        this.onBackgroundGraphSelected = graph => e => {
            this.editingBackground.graph = graph.uid;
            this.pickingBackground = false;
            this.update();
            this.refreshRoomCanvas();
        };
        this.roomAddBg = function () {
            var newBg = {
                depth: 0,
                graph: -1
            };
            this.room.backgrounds.push(newBg);
            this.editingBackground = newBg;
            this.pickingBackground = true;
            this.room.backgrounds.sort(function (a, b) {
                return a.depth - b.depth;
            });
            this.update();
        };
        this.onBgContextMenu = e => {
            this.editedBg = Number(e.item.ind);
            roomBgMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        var roomBgMenu = new gui.Menu();
        roomBgMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            click: () => {
                this.room.backgrounds.splice(this.editedBg, 1);
                this.refreshRoomCanvas();
                this.update();
            }
        }));
        this.onChangeBgGraphic = e => {
            this.pickingBackground = true;
            this.editingBackground = e.item.background;
            this.update();
        };
        this.onChangeBgDepth = e => {
            alertify
            .defaultValue(e.item.background.depth)
            .prompt(window.languageJSON.roomview.newdepth)
            .then(ee => {
                if (ee.inputValue && Number(ee.inputValue)) {
                    e.item.background.depth = ee.inputValue;
                    this.room.backgrounds.sort(function (a, b) {
                        return a.depth - b.depth;
                    });
                    this.refreshRoomCanvas();
                    this.update();
                }
            });
        };

        // Работа с тайлами

        this.tileX = 0;
        this.tileY = 0;
        this.tileSpanX = 1;
        this.tileSpanY = 1;
        this.deleteTileLayer = e => {
            alertify
            .okBtn(window.languageJSON.common.delete)
            .cancelBtn(window.languageJSON.common.cancel)
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', window.languageJSON.common.tilelayer))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    var index = this.room.tiles.indexOf(this.currentTileLayer);
                    this.room.tiles.splice(index, 1);
                    if (this.room.tiles.length) {
                        this.currentTileLayer = this.room.tiles[0];
                        this.currentTileLayerId = 0;
                    } else {
                        this.currentTileLayer = false;
                    }
                    this.refreshRoomCanvas();
                    this.update();
                    alertify
                    .okBtn(window.languageJSON.common.ok)
                    .cancelBtn(window.languageJSON.common.cancel);
                }
            });
        };
        this.moveTileLayer = e => {
            alertify
            .defaultValue(this.currentTileLayer.depth)
            .prompt(window.languageJSON.roomview.newdepth)
            .then(ee => {
                if (ee.inputValue && Number(ee.inputValue)) {
                    this.currentTileLayer.depth = Number(ee.inputValue);
                    this.refreshRoomCanvas();
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
                    this.room.tiles.push(layer);
                    this.currentTileLayer = layer;
                    this.currentTileLayerId = this.room.tiles.length - 1;
                    console.log(this.currentTileLayerId, this.currentTileLayer, this.room.tiles);
                    this.update();
                }
            });
        };
        this.toggleTileLayerVisibility = e => {
            this.currentTileLayer.hidden = !this.currentTileLayer.hidden;
            this.refreshRoomCanvas();
        };
        this.changeTileLayer = e => {
            this.currentTileLayer = this.room.tiles[Number(e.target.value)];
            this.currentTileLayerId = Number(e.target.value);
        };
        this.switchTiledImage = e => {
            this.pickingTileset = true;
        };
        this.onTilesetSelected = graph => e => {
            this.currentTileset = graph;
            this.pickingTileset = false;
            this.redrawTileset();
            this.update();
        };

        this.redrawTileset = e => {
            var c = this.refs.tiledImage,
                cx = c.getContext('2d'),
                g = this.currentTileset,
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
            let selX = g.offx + this.tileX*(g.width + g.marginx),
                selY = g.offy + this.tileY*(g.height + g.marginy),
                selW = g.width * this.tileSpanX + g.marginx * (this.tileSpanX - 1),
                selH = g.height * this.tileSpanY + g.marginy * (this.tileSpanY - 1);
            cx.strokeRect(-0.5 + selX, -0.5 + selY, selW + 1, selH + 1);
            cx.strokeStyle = localStorage.UItheme === 'Night'? '#1C2B42' : '#fff';
            cx.lineWidth = 1;
            cx.strokeRect(-0.5 + selX, -0.5 + selY, selW + 1, selH + 1);
        };
        
        this.startTileSelection = e => {
            if (!this.currentTileset) {return;}
            var g = this.currentTileset;
            this.tileSpanX = 1;
            this.tileSpanY = 1;
            this.selectingTile = true;
            this.tileStartX = Math.round((e.layerX - g.offx - g.width*0.5) / (g.width+g.marginx)); 
            this.tileStartX = Math.max(0, Math.min(g.grid[0], this.tileStartX));
            this.tileStartY = Math.round((e.layerY - g.offy - g.height*0.5) / (g.height+g.marginy)); 
            this.tileStartY = Math.max(0, Math.min(g.grid[1], this.tileStartY));
            this.tileX = this.tileStartX;
            this.tileY = this.tileStartY;
            this.redrawTileset();
        };
        this.moveTileSelection = e => {
            if (!this.selectingTile) {return;}
            var g = this.currentTileset;
            this.tileEndX = Math.round((e.layerX - g.offx - g.width*0.5) / (g.width+g.marginx)); 
            this.tileEndX = Math.max(0, Math.min(g.grid[0], this.tileEndX));
            this.tileEndY = Math.round((e.layerY - g.offy - g.height*0.5) / (g.height+g.marginy)); 
            this.tileEndY = Math.max(0, Math.min(g.grid[1], this.tileEndY));
            this.tileSpanX = 1 + Math.abs(this.tileStartX - this.tileEndX);
            this.tileSpanY = 1 + Math.abs(this.tileStartY - this.tileEndY);
            this.tileX = Math.min(this.tileStartX, this.tileEndX);
            this.tileY = Math.min(this.tileStartY, this.tileEndY);
            this.redrawTileset();
        };
        this.stopTileSelection = e => {
            if (!this.selectingTile) {return;}
            this.moveTileSelection(e);
            this.selectingTile = false;
        };
        this.onCanvasClickTiles = e => {
            if ((!this.currentTileset || e.ctrlKey) && e.button === 0) {
                return;
            }
            // Отмена выделения тайлов, если таковые были
            if (this.selectedTiles) {
                this.selectedTiles = false;
            }
            // Вставка тайлов
            if (this.room.gridX == 0 || e.altKey) {
                if (this.lastTileX !== ~~(this.xToRoom(e.offsetX)) ||
                    this.lastTileY !== ~~(this.yToRoom(e.offsetY))
                ) {
                    this.lastTileX = ~~(this.xToRoom(e.offsetX));
                    this.lastTileY = ~~(this.yToRoom(e.offsetY));
                    this.currentTileLayer.tiles.push({
                        x: this.lastTileX,
                        y: this.lastTileY,
                        graph: this.currentTileset.uid,
                        grid: [this.tileX, this.tileY, this.tileSpanX, this.tileSpanY]
                    });
                    this.refreshRoomCanvas();
                }
            } else {
                var x = ~~(this.xToRoom(e.offsetX)),
                    y = ~~(this.yToRoom(e.offsetY));
                if (this.lastTileX !== Math.round(x / this.room.gridX) * this.room.gridX ||
                    this.lastTileY !== Math.round(y / this.room.gridY) * this.room.gridY
                ) {
                    this.lastTileX = Math.round(x / this.room.gridX) * this.room.gridX;
                    this.lastTileY = Math.round(y / this.room.gridY) * this.room.gridY;
                    this.currentTileLayer.tiles.push({
                        x: this.lastTileX,
                        y: this.lastTileY,
                        graph: this.currentTileset.uid,
                        grid: [this.tileX, this.tileY, this.tileSpanX, this.tileSpanY]
                    });
                    this.refreshRoomCanvas();
                }
            }
        };
        
        // Контекстное меню по нажатию на холст
        this.roomCanvasTileMenu = new gui.Menu();
        this.roomCanvasTileMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.deletetile,
            click: () => {
                this.currentTileLayer.tiles.splice(this.closestPos, 1);
                this.refreshRoomCanvas();
            },
            key: 'Delete'
        }));
        this.onCanvasContextMenuTiles = e => {
            // Сначала ищется ближайшая к курсору копия. Если слоёв в комнате нет, то всё отменяется
            if (!this.room.tiles.length || !this.currentTileLayer.tiles.length) {return false;}
            var pos = 0,
                length = Infinity,
                l,
                fromx = this.xToRoom(e.offsetX),
                fromy = this.yToRoom(e.offsetY);
            for (let i = 0, li = this.currentTileLayer.tiles.length; i < li; i++) {
                let xp = this.currentTileLayer.tiles[i].x - fromx,
                    yp = this.currentTileLayer.tiles[i].y - fromy;
                l = Math.sqrt(xp * xp + yp * yp);
                if (l < length) {
                    length = l;
                    pos = i;
                }
            }
            var tile = this.currentTileLayer.tiles[pos],
                graph = glob.graphmap[tile.graph].g;
            this.closestPos = pos;
            // рисовка выделения тайла
            this.refreshRoomCanvas();
            var left = tile.x - 1.5,
                top = tile.y - 1.5,
                width = ((graph.width + graph.marginx) * tile.grid[2]) - graph.marginx + 3,
                height = ((graph.height + graph.marginy) * tile.grid[3]) - graph.marginy + 3;
            this.drawSelection(left, top, left+width, top+height);
    
            this.forbidDrawing = true;
            setTimeout(() => {
                this.forbidDrawing = false;
            }, 500);
            this.roomCanvasTileMenu.items[0].label = window.languageJSON.roomview.deletetile;
            this.roomCanvasTileMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        // Контекстное меню при нескольких выделенных тайлах
        this.roomCanvasTilesMenu = new gui.Menu();
        this.roomCanvasTilesMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.deletetiles,
            click: () => {
                for (const tile of this.selectedTiles) {
                    this.currentTileLayer.tiles.splice(this.currentTileLayer.tiles.indexOf(tile), 1);
                }
                this.selectedTiles = false;
                this.refreshRoomCanvas();
            },
            key: 'Delete'
        }));
        this.roomCanvasTilesMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.movetilestolayer,
            click: () => {
                window.alertify.confirm(`
                    ${window.languageJSON.roomview.movetilestolayer}
                    <label class="block">
                        <input id="tilesnewdepth" type="number" value="${this.currentTileLayer.depth}" />
                    </label>
                `)
                .then((e, a) => {
                    if (e.buttonClicked === 'ok') {
                        var depth = Number(document.getElementById('tilesnewdepth').value) || 0,
                            layer = this.room.tiles.find(layer => layer.depth === depth);
                        if (!layer) {
                            layer = {
                                depth,
                                tiles: [],
                                hidden: false
                            };
                            this.room.tiles.push(layer);
                        }
                        for (const tile of this.selectedTiles) {
                            this.currentTileLayer.tiles.splice(this.currentTileLayer.tiles.indexOf(tile), 1);
                            layer.tiles.push(tile);
                        }
                        this.selectedTiles = false;
                        this.refreshRoomCanvas();
                    }
                });
            }
        }));
        this.roomCanvasTilesMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.shifttiles,
            click: () => {
                window.alertify.confirm(`
                    ${window.languageJSON.roomview.shifttiles}
                    <label class="block">X: 
                        <input id="tilespositionx" type="number" value="${this.room.gridX}" />
                    </label>
                    <label class="block">Y: 
                        <input id="tilespositiony" type="number" value="${this.room.gridY}" />
                    </label>
                `)
                .then((e, a) => {
                    if (e.buttonClicked === 'ok') {
                        var x = Number(document.getElementById('tilespositionx').value) || 0,
                            y = Number(document.getElementById('tilespositiony').value) || 0;
                        for (const tile of this.selectedTiles) {
                            tile.x += x;
                            tile.y += y;
                        }
                        this.selectedTiles = false;
                        this.refreshRoomCanvas();
                    }
                });
            }
        }));
        this.onCanvasContextMenuMultipleTiles = e => {
            this.forbidDrawing = true;
            setTimeout(() => {
                this.forbidDrawing = false;
            }, 500);
            this.roomCanvasTilesMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        
        /** Сохранение комнаты (по факту, лишь помечает проект как несохранённый и закрывает редактор) */
        this.roomSave = e => {
            this.room.lastmod = +(new Date());
            this.roomGenSplash()
            .then(() => {
                window.glob.modified = true;
                this.parent.editing = false;
                this.parent.update();
            })
            .catch(err => {
                console.error(err);
                window.glob.modified = true;
                this.parent.editing = false;
                this.parent.update();
            });
        };
        
        /** Прорисовка холста */
        this.refreshRoomCanvas = () => {
            if (this.forbidDrawing) {return;}
            var canvas = this.refs.canvas,
                sizes = this.refs.canvaswrap.getBoundingClientRect();
            // Перед рисовкой проверим, нормального ли размера наш холст
            if (canvas.width != sizes.width || canvas.height != sizes.height) {
                canvas.width = sizes.width;
                canvas.height = sizes.height;
            }
            
            // Сбросим базовые настройки рисования
            canvas.x.setTransform(1,0,0,1,0,0);
            canvas.x.globalAlpha = 1;
            // Очистим холст
            canvas.x.clearRect(0,0,canvas.width,canvas.height);
            
            // Выполним перемещение с учётом зума
            canvas.x.translate(~~(canvas.width / 2), ~~(canvas.height / 2));
            canvas.x.scale(this.zoomFactor,this.zoomFactor);
            canvas.x.translate(-this.roomx, -this.roomy);
            canvas.x.imageSmoothingEnabled = !currentProject.settings.pixelatedrender;
            
            // Сделаем массив слоёв фонов, тайлов и копий. У копий приоритет
            var hybrid = [];
            hybrid = this.room.layers.concat(this.room.backgrounds).concat(this.room.tiles);
            hybrid.sort((a, b) => {
                if (a.depth - b.depth != 0) {
                    return a.depth - b.depth;
                } 
                if (a.copies) {
                    return 1;
                }
                if (a.tiles) {
                    return -0.5;
                }
                return -1;
            });
            if (hybrid.length > 0) { // есть слои вообще?
                // копии
                for (let i = 0, li = hybrid.length; i < li; i++) {
                    if (hybrid[i].copies) { // Если есть поле с копиями, то это не слой-фон и не тайлы
                        let layer = hybrid[i];
                        for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                            let copy = layer.copies[j],
                                type = window.currentProject.types[glob.typemap[copy.uid]];
                            let graph, gra, w, h, ox, oy,
                                grax, gray; // Центр рисовки графики
                            if (type.graph != -1) {
                                graph = glob.graphmap[type.graph];
                                gra = glob.graphmap[type.graph].g;
                                w = gra.width;
                                h = gra.height;
                                ox = gra.offx;
                                oy = gra.offy;
                                grax = gra.axis[0];
                                gray = gra.axis[1];
                            } else {
                                graph = glob.graphmap[-1];
                                w = h = 32;
                                grax = gray = 16;
                                ox = oy = 0;
                            }
                            if (copy.tx || copy.ty) {
                                canvas.x.save();
                                canvas.x.translate(copy.x - grax * (copy.tx || 1), copy.y - gray * (copy.ty || 1));
                                canvas.x.scale(copy.tx || 1, copy.ty || 1);
                                canvas.x.drawImage(
                                    graph,
                                    ox, oy, w, h,
                                    0, 0, w, h
                                );
                                canvas.x.restore();
                            } else {
                                canvas.x.drawImage(
                                    graph,
                                    glob.graphmap[type.graph].g.offx, glob.graphmap[type.graph].g.offy, w, h,
                                    copy.x - grax, copy.y - gray, w, h
                                );
                            }
                        }
                    } else if (hybrid[i].tiles) { // это слой с тайлами
                        let layer = hybrid[i];
                        if (!layer.hidden) {
                            for (let tile of layer.tiles) {
                                let w, h, x, y,
                                    img = glob.graphmap[tile.graph],
                                    graph = img.g;
                                x = graph.offx + (graph.width + graph.marginx) * tile.grid[0] - graph.marginx;
                                y = graph.offy + (graph.height + graph.marginy) * tile.grid[1] - graph.marginy;
                                w = (graph.width + graph.marginx) * tile.grid[2] - graph.marginx;
                                h = (graph.height + graph.marginy) * tile.grid[3] - graph.marginy;
                                canvas.x.drawImage(
                                    img,
                                    x, y, w, h,
                                    tile.x, tile.y, w, h
                                );
                            }
                        }
                    } else if (hybrid[i].graph !== -1) { // это слой-фон
                        canvas.x.fillStyle = canvas.x.createPattern(glob.graphmap[hybrid[i].graph], 'repeat');
                        canvas.x.fillRect(
                            this.xToRoom(0), this.yToRoom(0),
                            canvas.width / this.zoomFactor, canvas.height / this.zoomFactor
                        );
                    }
                }
            }

            // Это рисовка сетки
            if (this.room.gridX > 1) {
                canvas.x.globalCompositeOperation = 'exclusion';
                canvas.x.fillStyle = canvas.x.createPattern(this.gridCanvas, 'repeat');
                canvas.x.fillRect(
                    this.xToRoom(0), this.yToRoom(0),
                    canvas.width / this.zoomFactor, canvas.height / this.zoomFactor);
                canvas.x.globalCompositeOperation = 'source-over';
            }

            // Обводка выделенных тайлов
            if (this.tab === 'roomtiles' && this.selectedTiles && this.selectedTiles.length) {
                for (const tile of this.selectedTiles) {
                    let g = glob.graphmap[tile.graph].g;
                    this.drawSelection(tile.x, tile.y, tile.x + g.width*tile.grid[2], tile.y + g.height*tile.grid[3]);
                }
            }

            
            // Обводка границ комнаты
            this.drawSelection(-1.5, -1.5, this.room.width+1.5, this.room.height+1.5);
        };
        this.drawSelection = (x1, y1, x2, y2) => {
            this.refs.canvas.x.lineJoin = 'round';
            this.refs.canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#44dbb5' : '#446adb';
            this.refs.canvas.x.lineWidth = 3;
            this.refs.canvas.x.strokeRect(x1, y1, x2-x1, y2-y1);
            this.refs.canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#1C2B42' : '#fff';
            this.refs.canvas.x.lineWidth = 1;
            this.refs.canvas.x.strokeRect(x1, y1, x2-x1, y2-y1);
        };

        /**
         * Генерирует миниатюру комнаты
         */
        this.roomGenSplash = function() {
            return new Promise((accept, decline) => {
                var c = document.createElement('canvas'), 
                    w, h, k;
                c.x = c.getContext('2d');
                c.width = 340;
                c.height = 256;
                c.x.clearRect(0, 0, c.width, c.height);
                w = this.refs.canvas.width;
                h = this.refs.canvas.height;
                if (w / c.width > h / c.height) {
                    k = c.width / w;
                } else {
                    k = c.height / h;
                }
                if (k > 1) k = 1;
                c.x.drawImage(
                    this.refs.canvas,
                    0, 0, this.refs.canvas.width, this.refs.canvas.height,
                    (c.width - this.refs.canvas.width*k)/2, (c.height - this.refs.canvas.height*k)/2,
                    this.refs.canvas.width*k,
                    this.refs.canvas.height*k
                );
                var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, '');
                var buf = new Buffer(data, 'base64');
                var nam = sessionStorage.projdir + '/img/r' + this.room.thumbnail + '.png';
                fs.writeFile(nam, buf, function(err) {
                    if (err) {
                        decline(err);
                    } else {
                        accept(nam);
                    }
                });
                var nam2 = sessionStorage.projdir + '/img/splash.png';
                fs.writeFile(nam2, buf, function(err) {
                    if (err) {
                        decline(err);
                    }
                });
            });
        };
