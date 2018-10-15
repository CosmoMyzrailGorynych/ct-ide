(function () {
    const gui = require('nw.gui');
    /* global glob */
    window.roomCopyTools = {
        init() {
            var lastTypeLayer;
            var findTypeLayer = a => {
                if (a.depth === this.currentType.depth) {
                    lastTypeLayer = a;
                    return true;
                }
                return false;
            };
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

                if (Number(this.room.gridX) === 0 || e.altKey) {
                    if (this.lastCopyX !== Math.floor(this.xToRoom(e.offsetX)) ||
                        this.lastCopyY !== Math.floor(this.yToRoom(e.offsetY))
                    ) {
                        this.lastCopyX = Math.floor(this.xToRoom(e.offsetX));
                        this.lastCopyY = Math.floor(this.yToRoom(e.offsetY));
                        targetLayer.copies.push({
                            x: this.lastCopyX,
                            y: this.lastCopyY,
                            uid: this.currentType.uid
                        });
                        this.refreshRoomCanvas();
                    }
                } else {
                    var x = Math.floor(this.xToRoom(e.offsetX)),
                        y = Math.floor(this.yToRoom(e.offsetY));
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
            this.onCanvasMoveCopies = e => {
                if (e.ctrlKey) {
                    if (this.mouseDown && this.room.layers.length !== 0) {
                        var pos = 0,
                            layer, l,
                            done = false, 
                            fromx = this.xToRoom(e.offsetX),
                            fromy = this.yToRoom(e.offsetY);
                        var maxdist = Math.max(this.room.gridX, this.room.gridY);
                        for (let i = 0, li = this.room.layers.length; i < li; i++) {
                            const layerCopies = this.room.layers[i].copies;
                            for (let j = 0, lj = layerCopies.length; j < lj; j++) {
                                const xp = layerCopies[j].x - fromx,
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
                            if (this.room.layers[layer].copies.length === 0) {
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
                    if (this.currentType.graph !== -1) {
                        img = window.glob.graphmap[this.currentType.graph];
                        graph = img.g;
                        ox = graph.offx;
                        oy = graph.offy;
                        w = graph.width;
                        h = graph.height;
                        [grax, gray] = graph.axis;
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
            this.onCanvasContextMenuCopies = e => {
                // Сначала ищется ближайшая к курсору копия. Если слоёв в комнате нет, то всё отменяется
                if (!this.room.layers.length) {return false;}
                var pos = 0,
                    length = Infinity,
                    layer, l, 
                    fromx = this.xToRoom(e.offsetX),
                    fromy = this.yToRoom(e.offsetY);
                for (let i = 0, li = this.room.layers.length; i < li; i++) {
                    const layerCopies = this.room.layers[i].copies;
                    for (let j = 0, lj = layerCopies.length; j < lj; j++) {
                        const xp = layerCopies[j].x - fromx,
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
                return true;
            };

            // Контекстное меню по нажатию на холст
            this.roomCanvasMenu = new gui.Menu();
            this.roomCanvasMenu.append(new gui.MenuItem({
                label: window.languageJSON.roomview.deletecopy.replace('{0}', this.closestType),
                click: () => {
                    this.room.layers[this.closestLayer].copies.splice(this.closestPos, 1);
                    if (this.room.layers[this.closestLayer].copies.length === 0) {
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
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            copy.tx = Number(document.getElementById('copyscalex').value) || 1;
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
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            copy.x = Number(document.getElementById('copypositionx').value) || 0;
                            copy.y = Number(document.getElementById('copypositiony').value) || 0;
                            this.refreshRoomCanvas();
                        }
                    });
                }
            }));
        }
    };
})();
