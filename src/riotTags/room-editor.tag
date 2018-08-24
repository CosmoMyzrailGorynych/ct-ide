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
                    //-li( ) {voc.tiles}
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
                                    option(each="{layer, ind in room.tiles}" value="{ind}") {layer.depth}
                                
                                span.act(title="{vocGlob.delete}" onclick="{deleteTileLayer}")
                                    i.icon-trash
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
                button#roomzoom25.inline(onclick="{roomToggleZoom(0.25)}" class="{active: zoomFactor === 0.25}") 25%
                button#roomzoom50.inline(onclick="{roomToggleZoom(0.5)}" class="{active: zoomFactor === 0.5}") 50%
                button#roomzoom100.inline(onclick="{roomToggleZoom(1)}" class="{active: zoomFactor === 1}") 100%
                button#roomzoom200.inline(onclick="{roomToggleZoom(2)}" class="{active: zoomFactor === 2}") 200%
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
        
        var updateCanvasSize = (newWidth, newHeight) => {
            var canvas = this.refs.canvas,
                sizes = this.refs.canvaswrap.getBoundingClientRect();
            if (canvas.width != sizes.width || canvas.height != sizes.height) {
                canvas.width = sizes.width;
                canvas.height = sizes.height;
            }
            this.refreshRoomCanvas();
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
                targetLayer.copies.push({
                    x: ~~(this.xToRoom(e.offsetX)),
                    y: ~~(this.yToRoom(e.offsetY)),
                    uid: this.currentType.uid
                });
            } else {
                var x = ~~(this.xToRoom(e.offsetX)),
                    y = ~~(this.yToRoom(e.offsetY));
                targetLayer.copies.push({
                    x: x - (x % this.room.gridX),
                    y: y - (y % this.room.gridY),
                    uid: this.currentType.uid
                });
            }
            this.refreshRoomCanvas();
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
        };
        /** и безусловно прекращаем перемещение при отпускании мыши */
        this.onCanvasMouseUp = e => {
            this.mouseDown = false;
            this.dragging = false;
        };
        /** Начинаем перемещение, или же показываем предварительное расположение новой копии */
        this.onCanvasMove = e => {
            if (this.dragging) {
                // перетаскивание
                this.roomx -= ~~(e.movementX / this.zoomFactor);
                this.roomy -= ~~(e.movementY / this.zoomFactor);
                this.refreshRoomCanvas(e);
            } else if (e.ctrlKey) {
                // При нажатии кнопки Ctrl удаляем копии под курсором
                var maxdist = this.room.gridX || 64;
                if (this.mouseDown) {
                    if (this.tab === 'roomcopies' && this.room.layers.length !== 0) {
                        var type = this.room.layers[0].copies[0],
                            pos = 0,
                            layer, l,
                            done = false, 
                            fromx = this.xToRoom(e.offsetX),
                            fromy = this.yToRoom(e.offsetY);
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
                    } else if (this.tab === 'roomtiles' && this.currentTileLayer) {
                        var pos = 0,
                            l,
                            done = false, 
                            fromx = this.xToRoom(e.offsetX),
                            fromy = this.yToRoom(e.offsetY);
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
                }
                // Рисовка кружка для удаления копий
                this.refreshRoomCanvas(e);
                var x = this.refs.canvas.x;
                x.fillStyle = '#F00';
                x.strokeStyle = '#000';
                x.globalAlpha = 0.5;
                x.beginPath();
                x.arc(this.xToRoom(e.offsetX), this.yToRoom(e.offsetY), maxdist, 0, 2 * Math.PI);
                x.fill();
                x.stroke();
            } else if (this.currentType !== -1 && this.tab === 'roomcopies') {
                let img, graph, w, h, grax, gray;
                // превью вставки
                this.refreshRoomCanvas(e);
                this.refs.canvas.x.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
                this.refs.canvas.x.globalAlpha = 0.5;
                if (this.currentType.graph != -1) {
                    img = window.glob.graphmap[this.currentType.graph];
                    graph = img.g;
                    w = graph.width;
                    h = graph.height;
                    grax = graph.axis[0] - graph.offx;
                    gray = graph.axis[1] - graph.offy;
                } else {
                    img = window.glob.graphmap[-1];
                    w = h = 32;
                    grax = gray = 16;
                }
                if (this.room.gridX === 0 || e.altKey) {
                    this.refs.canvas.x.drawImage(
                        img,
                        0, 0, w, h,
                        e.offsetX / this.zoomFactor - grax, e.offsetY / this.zoomFactor - gray, w, h);
                } else {
                    // если есть сетка, то координаты предварительной копии нужно отснэпить по сетке
                    var dx = this.xToRoom(e.offsetX),
                        dy = this.yToRoom(e.offsetY);
                    w = graph.width;
                    h = graph.height;
                    this.refs.canvas.x.drawImage(
                        img, 0, 0, w, h,
                        this.xToCanvas(dx - dx % this.room.gridX) / this.zoomFactor - grax, 
                        this.yToCanvas(dy - dy % this.room.gridY) / this.zoomFactor - gray, 
                        w, h);
                }
            } else if (this.currentTileset && this.tab === 'roomtiles') {
                // превью вставки
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
                        this.xToCanvas(dx - dx % this.room.gridX) / this.zoomFactor, 
                        this.yToCanvas(dy - dy % this.room.gridY) / this.zoomFactor, 
                        w, h);
                }
            }
        };
        
        /** При прокрутке колёсиком меняем фактор зума */
        this.onCanvasWheel = e => {
            if (e.wheelDelta > 0) {
                // in
                if (this.zoomFactor === 1) {
                    this.zoomFactor = 2;
                } else if (this.zoomFactor === 0.5) {
                    this.zoomFactor = 1;
                } else if (this.zoomFactor === 0.25) {
                    this.zoomFactor = 0.5;
                }
            } else {
                // out
                if (this.zoomFactor === 2) {
                    this.zoomFactor = 1;
                } else if (this.zoomFactor === 1) {
                    this.zoomFactor = 0.5;
                } else if (this.zoomFactor === 0.5) {
                    this.zoomFactor = 0.25;
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
            this.refs.canvas.x.lineJoin = 'round';
            this.refs.canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#44dbb5' : '#446adb';
            this.refs.canvas.x.lineWidth = 3;
            var left, top, height, width;
            if (type.graph !== -1) {
                left = copy.x - graph.axis[0] - 1.5;
                top = copy.y - graph.axis[1] - 1.5;
                height = graph.width + 3;
                width = graph.height + 3;
            } else {
                left = copy.x - 16 - 1.5;
                top = copy.y - 16 - 1.5;
                height = 32 + 3;
                width = 32 + 3;
            }
            this.refs.canvas.x.strokeRect(left, top, height, width);
            this.refs.canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#1C2B42' : '#fff';
            this.refs.canvas.x.lineWidth = 1;
            this.refs.canvas.x.strokeRect(left, top, height, width);
    
            this.forbidDrawing = true;
            setTimeout(() => {
                this.forbidDrawing = false;
            }, 500);
            this.roomCanvasMenu.items[0].label = window.languageJSON.roomview.deletecopy.replace('{0}', type.name);
            this.roomCanvasMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        this.onCanvasContextMenu = e => {
            if (this.tab === 'roomcopies') {
                this.onCanvasContextMenuCopies(e);
            } else if (this.tab === 'roomtiles') {
                this.onCanvasContextMenuTiles(e);
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
                    this.update();
                }
            });
        };
        this.changeTileLayer = e => {
            this.currentTileLayer = e.item.layer;
            this.currentTileLayerId = e.item.ind;
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
            if (this.room.gridX == 0 || e.altKey) {
                this.currentTileLayer.tiles.push({
                    x: ~~(this.xToRoom(e.offsetX)),
                    y: ~~(this.yToRoom(e.offsetY)),
                    graph: this.currentTileset.uid,
                    grid: [this.tileX, this.tileY, this.tileSpanX, this.tileSpanY]
                });
            } else {
                var x = ~~(this.xToRoom(e.offsetX)),
                    y = ~~(this.yToRoom(e.offsetY));
                this.currentTileLayer.tiles.push({
                    x: x - (x % this.room.gridX),
                    y: y - (y % this.room.gridY),
                    graph: this.currentTileset.uid,
                    grid: [this.tileX, this.tileY, this.tileSpanX, this.tileSpanY]
                });
            }
            this.refreshRoomCanvas();
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
            this.refs.canvas.x.lineJoin = 'round';
            this.refs.canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#44dbb5' : '#446adb';
            this.refs.canvas.x.lineWidth = 3;
            var left = tile.x - 1.5,
                top = tile.y - 1.5,
                height = ((graph.width + graph.marginx) * tile.grid[2]) - graph.marginx + 3,
                width = ((graph.height + graph.marginy) * tile.grid[3]) - graph.marginy + 3;
            this.refs.canvas.x.strokeRect(left, top, height, width);
            this.refs.canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#1C2B42' : '#fff';
            this.refs.canvas.x.lineWidth = 1;
            this.refs.canvas.x.strokeRect(left, top, height, width);
    
            this.forbidDrawing = true;
            setTimeout(() => {
                this.forbidDrawing = false;
            }, 500);
            this.roomCanvasTileMenu.items[0].label = window.languageJSON.roomview.deletetile;
            this.roomCanvasTileMenu.popup(e.clientX, e.clientY);
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
                            let graph, w, h,
                                grax, gray; // Центр рисовки графики
                            if (type.graph != -1) {
                                graph = glob.graphmap[type.graph];
                                w = glob.graphmap[type.graph].width / glob.graphmap[type.graph].g.grid[0];
                                h = glob.graphmap[type.graph].height / glob.graphmap[type.graph].g.grid[1];
                                grax = glob.graphmap[type.graph].g.axis[0];
                                gray = glob.graphmap[type.graph].g.axis[1];
                            } else {
                                graph = glob.graphmap[-1];
                                w = h = 32;
                                grax = gray = 16;
                            }
                            canvas.x.drawImage(
                                graph,
                                0, 0, w, h,
                                copy.x - grax, copy.y - gray, w, h
                            );
                        }
                    } else if (hybrid[i].tiles) { // это слой с тайлами
                        let layer = hybrid[i];
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
            
            // Обводка границ комнаты
            canvas.x.lineJoin = 'round';
            canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#44dbb5' : '#446adb';
            canvas.x.lineWidth = 3;
            canvas.x.strokeRect(-1.5,-1.5,this.room.width+3,this.room.height+3);
            canvas.x.strokeStyle = localStorage.UItheme === 'Night'? '#1C2B42' : '#fff';
            canvas.x.lineWidth = 1;
            canvas.x.strokeRect(-1.5,-1.5,this.room.width+3,this.room.height+3);
            
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
