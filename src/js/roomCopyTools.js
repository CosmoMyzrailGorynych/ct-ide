(function roomCopyTools() {
    const clickThreshold = 16;
    const glob = require('./data/node_requires/glob');

    const drawInsertPreview = function (e) {
        let img, texture, w, h, grax, gray, ox, oy;
        // превью вставки
        this.refreshRoomCanvas();
        this.refs.canvas.x.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
        this.refs.canvas.x.globalAlpha = 0.5;
        if (this.currentType.texture !== -1) {
            img = glob.texturemap[this.currentType.texture];
            texture = img.g;
            ox = texture.offx;
            oy = texture.offy;
            w = texture.width;
            h = texture.height;
            [grax, gray] = texture.axis;
        } else {
            img = glob.texturemap[-1];
            texture = img.g;
            w = h = 32;
            ox = oy = 0;
            grax = gray = 16;
        }
        if (this.room.gridX === 0 || e.altKey) {
            this.refs.canvas.x.drawImage(
                img,
                ox, oy, w, h,
                e.offsetX / this.zoomFactor - grax, e.offsetY / this.zoomFactor - gray, w, h
            );
        } else {
            // если есть сетка, то координаты предварительной копии нужно отснэпить по сетке
            var dx = this.xToRoom(e.offsetX),
                dy = this.yToRoom(e.offsetY);
            w = texture.width;
            h = texture.height;
            const {room} = this;
            this.refs.canvas.x.drawImage(
                img, ox, oy, w, h,
                this.xToCanvas(Math.round(dx / room.gridX) * room.gridX) / this.zoomFactor - grax,
                this.yToCanvas(Math.round(dy / room.gridY) * room.gridY) / this.zoomFactor - gray,
                w, h
            );
        }
    };
    const selectACopyAt = function (e) {
        var pos = 0,
            length = Infinity,
            l,
            fromx = this.xToRoom(e.offsetX),
            fromy = this.yToRoom(e.offsetY);
        const layerCopies = this.room.copies;
        for (let j = 0, lj = layerCopies.length; j < lj; j++) {
            const xp = layerCopies[j].x - fromx,
                  yp = layerCopies[j].y - fromy;
            l = Math.sqrt(xp * xp + yp * yp);
            if (l < length) {
                length = l;
                pos = j;
            }
        }
        return this.room.copies[pos];
    };

    const onCanvasPressCopies = function (e) {
        if (this.selectedCopies && !e.shiftKey && e.button === 0) {
            for (const copy of this.selectedCopies) {
                var x = this.xToRoom(this.startx),
                    y = this.yToRoom(this.starty);
                const textureId = global.currentProject.types[glob.typemap[copy.uid]].texture;
                const {g} = glob.texturemap[textureId];
                if (x > copy.x - g.axis[0] && y > copy.y - g.axis[1] &&
                    x < copy.x - g.axis[0] + g.width && y < copy.y - g.axis[1] + g.height) {
                    this.movingStuff = true;
                    for (const copy of this.selectedCopies) {
                        copy.lastX = copy.x;
                        copy.lastY = copy.y;
                    }
                    return true;
                }
            }
        }
        return false;
    };

    window.roomCopyTools = {
        // eslint-disable-next-line max-lines-per-function
        init() {
            this.currentType = -1;
            this.onCanvasPressCopies = onCanvasPressCopies;
            const selectCopies = e => {
                var x1 = this.xToRoom(this.startx),
                    y1 = this.yToRoom(this.starty),
                    x2 = this.xToRoom(e.offsetX),
                    y2 = this.yToRoom(e.offsetY),
                    xmin = Math.min(x1, x2),
                    xmax = Math.max(x1, x2),
                    ymin = Math.min(y1, y2),
                    ymax = Math.max(y1, y2);
                for (const copy of this.room.copies) {
                    const textureId = global.currentProject.types[glob.typemap[copy.uid]].texture;
                    const {g} = glob.texturemap[textureId];
                    const x1 = copy.x - g.axis[0] * (copy.tx || 1),
                          x2 = copy.x - (g.axis[0] - g.width) * (copy.tx || 1),
                          y1 = copy.y - g.axis[1] * (copy.ty || 1),
                          y2 = copy.y - (g.axis[1] - g.height) * (copy.ty || 1),
                          xcmin = Math.min(x1, x2),
                          ycmin = Math.min(y1, y2),
                          xcmax = Math.max(x1, x2),
                          ycmax = Math.max(y1, y2);
                    if (xcmin > xmin && xcmax < xmax &&
                        ycmin > ymin && ycmax < ymax) {
                        const ind = this.selectedCopies.indexOf(copy);
                        if (ind === -1) {
                            this.selectedCopies.push(copy);
                        }
                    }
                }
            };
            this.onCanvasMouseUpCopies = e => {
                if (e.button === 0 && this.currentType === -1 && e.shiftKey) {
                    const dragLength = Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty);
                    if (dragLength > clickThreshold) {
                        // Было прямоугольное выделение
                        if (!this.selectedCopies) {
                            this.selectedCopies = [];
                        }
                        selectCopies(e);
                        if (!this.selectedCopies.length) {
                            this.selectedCopies = false;
                        }
                    } else {
                        // Был единичный выбор
                        if (!this.room.copies.length) {
                            return;
                        }
                        const copy = selectACopyAt.apply(this, [e]);
                        if (this.selectedCopies) {
                            const ind = this.selectedCopies.indexOf(copy);
                            if (ind !== -1) {
                                this.selectedCopies.splice(ind, 1);
                            } else {
                                this.selectedCopies.push(copy);
                            }
                        } else {
                            this.selectedCopies = [copy];
                        }
                    }
                } else if (this.movingStuff) {
                    for (const copy of this.selectedCopies) {
                        delete copy.lastX;
                        delete copy.lastY;
                    }
                    this.movingStuff = false;
                }
                this.refreshRoomCanvas();
            };
            // Place a copy on click
            this.onCanvasClickCopies = e => {
                if (Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > clickThreshold &&
                    !e.shiftKey
                ) {
                    return; // this looks neither like a regular click nor like a Shift+drag
                }
                // Cancel copy selection on click
                if (this.selectedCopies &&
                    !this.movingStuff &&
                    !(e.shiftKey && this.currentType === -1)
                ) {
                    this.selectedCopies = false;
                    this.refreshRoomCanvas();
                    return;
                }
                // If no type was picked or we delete stuff, do nothing
                if ((this.currentType === -1 || e.ctrlKey) && e.button === 0) {
                    return;
                }
                if (Number(this.room.gridX) === 0 || e.altKey) {
                    if (this.lastCopyX !== Math.floor(this.xToRoom(e.offsetX)) ||
                        this.lastCopyY !== Math.floor(this.yToRoom(e.offsetY))
                    ) {
                        this.lastCopyX = Math.floor(this.xToRoom(e.offsetX));
                        this.lastCopyY = Math.floor(this.yToRoom(e.offsetY));
                        this.room.copies.push({
                            x: this.lastCopyX,
                            y: this.lastCopyY,
                            uid: this.currentType.uid
                        });
                        this.resortRoom();
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
                        this.room.copies.push({
                            x: this.lastCopyX,
                            y: this.lastCopyY,
                            uid: this.currentType.uid
                        });
                        this.resortRoom();
                        this.refreshRoomCanvas();
                    }
                }
            };
            /* eslint max-depth: 0 */
            this.onCanvasMoveCopies = e => {
                if (e.ctrlKey) {
                    if (this.mouseDown && this.room.copies.length !== 0) {
                        var l,
                            fromx = this.xToRoom(e.offsetX),
                            fromy = this.yToRoom(e.offsetY);
                        var maxdist = Math.max(this.room.gridX, this.room.gridY);
                        for (let j = 0, lj = this.room.copies.length; j < lj; j++) {
                            const xp = this.room.copies[j].x - fromx,
                                  yp = this.room.copies[j].y - fromy;
                            l = Math.sqrt(xp * xp + yp * yp);
                            if (l < maxdist) {
                                this.room.copies.splice(j, 1);
                                this.resortRoom();
                                break;
                            }
                        }
                    }
                    this.drawDeleteCircle(e);
                } else if (this.mouseDown && e.shiftKey) {
                    const dragLength = Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty);
                    if (dragLength > clickThreshold) {
                        this.refreshRoomCanvas(e);
                        // рисовка прямоугольного выделения
                        const x1 = this.xToRoom(this.startx),
                              x2 = this.xToRoom(e.offsetX),
                              y1 = this.yToRoom(this.starty),
                              y2 = this.yToRoom(e.offsetY);
                        this.drawSelection(x1, y1, x2, y2);
                    }
                } else if (this.movingStuff) {
                    let dx = this.xToRoom(e.offsetX) - this.xToRoom(this.startx),
                        dy = this.yToRoom(e.offsetY) - this.yToRoom(this.starty);
                    if (!e.altKey && this.room.gridX && this.room.gridY) {
                        dx = Math.round(dx / this.room.gridX) * this.room.gridX;
                        dy = Math.round(dy / this.room.gridY) * this.room.gridY;
                    }
                    for (const copy of this.selectedCopies) {
                        if (!('lastX' in copy)) {
                            copy.lastX = copy.x;
                            copy.lastY = copy.y;
                        }
                        copy.x = copy.lastX + dx;
                        copy.y = copy.lastY + dy;
                    }
                    this.refreshRoomCanvas(e);
                } else if (this.currentType !== -1) {
                    drawInsertPreview.apply(this, [e]);
                } else if (
                    this.mouseDown &&
                    e.shift &&
                    Math.hypot(e.offsetX - this.startx, e.offsetY - this.starty) > clickThreshold
                ) {
                    this.refreshRoomCanvas(e);
                    // рисовка прямоугольного выделения
                    const x1 = this.xToRoom(this.startx),
                          x2 = this.xToRoom(e.offsetX),
                          y1 = this.yToRoom(this.starty),
                          y2 = this.yToRoom(e.offsetY);
                    this.drawSelection(x1, y1, x2, y2);
                }
            };
            // eslint-disable-next-line id-length
            this.onCanvasContextMenuCopies = e => {
                // Find the closest copy. If there are no copies, abort
                if (!this.room.copies.length) {
                    return;
                }
                var copy = selectACopyAt.apply(this, [e]),
                    type = global.currentProject.types[glob.typemap[copy.uid]];
                this.closestType = type;
                this.closestPos = this.room.copies.indexOf(copy);

                // рисовка выделения копии
                this.refreshRoomCanvas();
                this.drawSelection(copy);

                this.forbidDrawing = true;
                setTimeout(() => {
                    this.forbidDrawing = false;
                }, 500);
                this.roomCanvasMenu.items[0].label = window.languageJSON.roomview.deletecopy.replace('{0}', type.name);
                this.refs.roomCanvasMenu.popup(e.clientX, e.clientY);
            };

            this.roomCanvasCopiesMenu = {
                opened: false,
                item: [{
                    label: window.languageJSON.roomview.deleteCopies,
                    click: () => {
                        for (const copy of this.selectedCopies) {
                            this.room.copies.splice(this.room.copies.indexOf(copy), 1);
                        }
                        this.selectedCopies = false;
                        this.resortRoom();
                        this.refreshRoomCanvas();
                    },
                    key: 'Delete'
                }, {
                    label: window.languageJSON.roomview.shiftCopies,
                    click: () => {
                        window.alertify.confirm(`
                            ${window.languageJSON.roomview.shiftCopies}
                            <label class="block">X:
                                <input id="copiespositionx" type="number" value="${this.room.gridX}" />
                            </label>
                            <label class="block">Y:
                                <input id="copiespositiony" type="number" value="${this.room.gridY}" />
                            </label>
                        `)
                            .then(e => {
                                if (e.buttonClicked === 'ok') {
                                    var x = Number(document.getElementById('copiespositionx').value) || 0,
                                        y = Number(document.getElementById('copiespositiony').value) || 0;
                                    for (const copy of this.selectedCopies) {
                                        copy.x += x;
                                        copy.y += y;
                                    }
                                    this.refreshRoomCanvas();
                                }
                            });
                    }
                }]
            };
            // eslint-disable-next-line id-length
            this.onCanvasContextMenuMultipleCopies = e => {
                this.forbidDrawing = true;
                setTimeout(() => {
                    this.forbidDrawing = false;
                }, 500);
                this.refs.roomCanvasCopiesMenu.popup(e.clientX, e.clientY);
                e.preventDefault();
            };

            // Контекстное меню по нажатию на холст
            this.roomCanvasMenu = {
                opened: false,
                items: [{
                    label: window.languageJSON.roomview.deletecopy.replace('{0}', this.closestType),
                    click: () => {
                        this.room.copies.splice(this.closestPos, 1);
                        this.resortRoom();
                        this.refreshRoomCanvas();
                    },
                    key: 'Delete'
                }, {
                    label: window.languageJSON.roomview.changecopyscale,
                    click: () => {
                        var copy = this.room.copies[this.closestPos];
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
                }, {
                    label: window.languageJSON.roomview.changecopyrotation,
                    click: () => {
                        var copy = this.room.copies[this.closestPos];
                        window.alertify.confirm(`
                            ${window.languageJSON.roomview.changecopyrotation}
                            <label class="block">
                                <input id="copyrotation" type="number" value="${copy.tr || 0}" />
                            </label>
                        `)
                        .then(e => {
                            if (e.buttonClicked === 'ok') {
                                copy.tr = Number(document.getElementById('copyrotation').value) || 0;
                                this.refreshRoomCanvas();
                            }
                        });
                    }
                }, {
                    label: window.languageJSON.roomview.shiftcopy,
                    click: () => {
                        var copy = this.room.copies[this.closestPos];
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
                }]
            };
        }
    };
})();
