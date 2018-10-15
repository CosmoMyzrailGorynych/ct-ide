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
                    room-type-picker(show="{tab === 'roomcopies'}" current="{currentType}")
                    room-backgrounds-editor(show="{tab === 'roombackgrounds'}" room="{room}")
                    room-tile-editor(show="{tab === 'roomtiles'}" room="{room}")
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
    script.
        this.editingCode = false;
        this.forbidDrawing = false;
        const fs = require('fs-extra'),
              gui = require('nw.gui');
        const win = gui.Window.get();
        this.namespace = 'roomview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.mixin(window.roomCopyTools);
        
        this.room = this.opts.room;

        this.roomx = this.room.width / 2;
        this.roomy = this.room.height / 2;
        this.zoomFactor = 1;
        this.room.gridX = this.room.gridX || this.room.grid || 64;
        this.room.gridY = this.room.gridY || this.room.grid || 64;
        this.currentType = -1;
        this.dragging = false;
        this.tab = 'roomcopies';
        
        
        var updateCanvasSize = e => {
            var canvas = this.refs.canvas,
                sizes = this.refs.canvaswrap.getBoundingClientRect();
            if (canvas.width != sizes.width || canvas.height != sizes.height) {
                canvas.width = sizes.width;
                canvas.height = sizes.height;
            }
            setTimeout(this.refreshRoomCanvas, 10);
        };
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
            }
        };
        this.roomUnpickType = e => {
            this.currentType = -1;
        };

        /** Преобразовать x на канвасе в x на комнате */
        this.xToRoom = x => (x - ~~(this.refs.canvas.width / 2)) / this.zoomFactor + this.roomx;
        /** Преобразовать y на канвасе в y на комнате */
        this.yToRoom = y => (y - ~~(this.refs.canvas.height / 2)) / this.zoomFactor + this.roomy;
        /** Преобразовать x в комнате в x на канвасе */
        this.xToCanvas = x => (x - this.roomx) * this.zoomFactor + ~~(this.refs.canvas.width / 2);
        /** Преобразовать y в комнате в y на канвасе */
        this.yToCanvas = y => (y - this.roomy) * this.zoomFactor + ~~(this.refs.canvas.height / 2);
        
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
            if (e.button === 0 && this.currentTileLayer && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > 16) {
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
                this.refreshRoomCanvas();
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
                }
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
