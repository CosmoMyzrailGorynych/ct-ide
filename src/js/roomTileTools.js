(function () {
    const gui = require('nw.gui');
    const clickThreshold = 16;
    /* global glob */
    window.roomTileTools = {
        init() {
            this.onCanvasMouseUpTiles = e => {
                if (e.button === 0 && this.currentTileLayer && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > clickThreshold) {
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
                        const {g} = glob.texturemap[tile.texture];
                        if (tile.x > xmin && tile.x + g.width < xmax &&
                            tile.y > ymin && tile.y + g.height < ymax) {
                            this.selectedTiles.push(tile);
                        }
                    }
                    this.refreshRoomCanvas();
                }
            };
            this.onCanvasMoveTiles = e => {
                // Если ведётся удаление
                if (e.ctrlKey) {
                    // и зажата мышь
                    if (this.mouseDown && this.currentTileLayer) {
                        var pos = 0,
                            l,
                            done = false, 
                            fromx = this.xToRoom(e.offsetX),
                            fromy = this.yToRoom(e.offsetY);
                        var maxdist = Math.max(this.room.gridX, this.room.gridY);
                        for (let j = 0, lj = this.currentTileLayer.tiles.length; j < lj; j++) {
                            const xp = this.currentTileLayer.tiles[j].x - fromx,
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
                } else if (this.mouseDown && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > clickThreshold) {
                    this.refreshRoomCanvas(e);
                    // рисовка прямоугольного выделения
                    const x1 = this.xToRoom(this.startx),
                          x2 = this.xToRoom(e.offsetX),
                          y1 = this.yToRoom(this.starty),
                          y2 = this.yToRoom(e.offsetY);
                    this.drawSelection(x1, y1, x2, y2);
                } else if (this.currentTileset) {
                    // превью вставки тайла
                    this.refreshRoomCanvas(e);
                    this.refs.canvas.x.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
                    this.refs.canvas.x.globalAlpha = 0.5;
                    const img = glob.texturemap[this.currentTileset.uid],
                          texture = this.currentTileset;
                    const sx = texture.offx + (texture.width + texture.marginx) * this.tileX - texture.marginx,
                          sy = texture.offy + (texture.height + texture.marginy) * this.tileY - texture.marginy,
                          w = (texture.width + texture.marginx) * this.tileSpanX - texture.marginx,
                          h = (texture.height + texture.marginy) * this.tileSpanY - texture.marginy;
                    if (this.room.gridX === 0 || e.altKey) {
                        this.refs.canvas.x.drawImage(
                            img,
                            sx, sy, w, h,
                            e.offsetX / this.zoomFactor,
                            e.offsetY / this.zoomFactor,
                            w, h);
                    } else {
                        // если есть сетка, то координаты предварительного тайла нужно отснэпить по сетке
                        const dx = this.xToRoom(e.offsetX),
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
            
            this.onCanvasClickTiles = e => {
                // Отмена выделения тайлов, если таковые были, при клике
                if (this.selectedTiles && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) <= clickThreshold) {
                    this.selectedTiles = false;
                    this.refreshRoomCanvas();
                    return;
                }
                // Было выделение и по клику больше ничего делать не нужно
                if (e.button === 0 && Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > clickThreshold) {
                    return;
                }
                // Выделений не было, но и слой не выбран, или же идёт удаление
                if ((!this.currentTileset || e.ctrlKey) && e.button === 0) {
                    return;
                }
                // Вставка тайлов
                if (Number(this.room.gridX) === 0 || e.altKey) {
                    if (this.lastTileX !== Math.floor(this.xToRoom(e.offsetX)) ||
                        this.lastTileY !== Math.floor(this.yToRoom(e.offsetY))
                    ) {
                        this.lastTileX = Math.floor(this.xToRoom(e.offsetX));
                        this.lastTileY = Math.floor(this.yToRoom(e.offsetY));
                        this.currentTileLayer.tiles.push({
                            x: this.lastTileX,
                            y: this.lastTileY,
                            texture: this.currentTileset.uid,
                            grid: [this.tileX, this.tileY, this.tileSpanX, this.tileSpanY]
                        });
                    }
                } else {
                    var x = Math.floor(this.xToRoom(e.offsetX)),
                        y = Math.floor(this.yToRoom(e.offsetY));
                    if (this.lastTileX !== Math.round(x / this.room.gridX) * this.room.gridX ||
                        this.lastTileY !== Math.round(y / this.room.gridY) * this.room.gridY
                    ) {
                        this.lastTileX = Math.round(x / this.room.gridX) * this.room.gridX;
                        this.lastTileY = Math.round(y / this.room.gridY) * this.room.gridY;
                        this.currentTileLayer.tiles.push({
                            x: this.lastTileX,
                            y: this.lastTileY,
                            texture: this.currentTileset.uid,
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
                    const xp = this.currentTileLayer.tiles[i].x - fromx,
                         yp = this.currentTileLayer.tiles[i].y - fromy;
                    l = Math.sqrt(xp * xp + yp * yp);
                    if (l < length) {
                        length = l;
                        pos = i;
                    }
                }
                var tile = this.currentTileLayer.tiles[pos],
                    texture = glob.texturemap[tile.texture].g;
                this.closestPos = pos;
                // рисовка выделения тайла
                this.refreshRoomCanvas();
                var left = tile.x - 1.5,
                    top = tile.y - 1.5,
                    width = ((texture.width + texture.marginx) * tile.grid[2]) - texture.marginx + 3,
                    height = ((texture.height + texture.marginy) * tile.grid[3]) - texture.marginy + 3;
                this.drawSelection(left, top, left+width, top+height);
        
                this.forbidDrawing = true;
                setTimeout(() => {
                    this.forbidDrawing = false;
                }, 500);
                this.roomCanvasTileMenu.items[0].label = window.languageJSON.roomview.deletetile;
                this.roomCanvasTileMenu.popup(e.clientX, e.clientY);
                e.preventDefault();
                return true;
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
                    .then(e => {
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
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            var x = Number(document.getElementById('tilespositionx').value) || 0,
                                y = Number(document.getElementById('tilespositiony').value) || 0;
                            for (const tile of this.selectedTiles) {
                                tile.x += x;
                                tile.y += y;
                            }
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
        }
    };
})();
