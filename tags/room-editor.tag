room-editor.panel.view
    .toolbar.borderright.tall
        .settings.nogrow.noshrink
            b {voc.name}
            br
            input#roomname.wide(type="text" value="{room.name}" onchange="{wire('this.room.name')}")
            br
            b {voc.width}
            br
            input#roomwidth.wide(type="number" value="{room.width}" onchange="{wire('this.room.width')}")
            br
            b {voc.height}
            br
            input#roomheight.wide(type="number" value="{room.height}" onchange="{wire('this.room.height')}")
            br
            button.wide(data-event="openRoomEvents")
                i.icon.icon-code
                span {voc.events}
        .palette
            .tabwrap
                ul.tabs.nav.noshrink.nogrow
                    li(onclick="{changeTab('roomcopies')}" class="{active: tab === 'roomcopies'}") {voc.copies}
                    li(onclick="{changeTab('roombackgrounds')}" class="{active: tab === 'roombackgrounds'}") {voc.backgrounds}
                    //-li(data-tab="#roomtiles") {voc.tiles}
                div(style="position: relative;")
                    #roomcopies.tabbed.tall(show="{tab === 'roomcopies'}")
                        span#roomnotype(onclick="{roomUnpickType}")
                            span {window.languageJSON.common.none}
                        div(each="{type in window.currentProject.types}" onclick="{selectType(type))}" class="{active: type === currentType}")
                            span {type.name}
                            img(src="{type.graph === -1? '/img/nograph.png' : sessionStorage.projdir + '/img/' + type.graph + '_prev.png'}")
                    #roombackgrounds.tabbed(show="{tab === 'roombackgrounds'}")
                        ul#roombgstack
                            li.bg(each="{background, ind in room.backgrounds}" oncontextmenu="{onBgContextMenu}")
                                img(src="{sessionStorage.projdir + '/img/' + background.graph}" onclick="{onChangeBgGraphic}")
                                span {background.depth}

                        button.inline.wide(onclick="{roomAddBg}")
                            i.icon.icon-plus
                            span {voc.add}
                    //-
                        #roomtiles.tabbed
                            select#roomtilesselect.select
                                option(disabled selected) {voc.selectbg}
        .done.nogrow
            button.wide#roomviewdone(onclick="{roomSave}")
                i.icon.icon-confirm
                span {voc.done}
    .editor
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
                i.icon.icon-move-view
        .zoom
            b {voc.zoom}
            div.button-stack
                button#roomzoom25.inline(onclick="{roomToggleZoom(0.25)}" class="{active: zoomFactor === 0.25}") 25%
                button#roomzoom50.inline(onclick="{roomToggleZoom(0.5)}" class="{active: zoomFactor === 0.5}") 50%
                button#roomzoom100.inline(onclick="{roomToggleZoom(1)}" class="{active: zoomFactor === 1}") 100%
                button#roomzoom200.inline(onclick="{roomToggleZoom(2)}" class="{active: zoomFactor === 2}") 200%
        .grid
            button#roomgrid(onclick="{roomToggleGrid}" class="{active: grid > 0}") 
                span {voc[grid > 0? 'gridoff' : 'grid']}
        .center
            button#roomcenter(data-event="roomToCenter") {voc.tocenter}
    room-events-editor(show="{editingCode}" room="{room}")
    graphic-selector(ref="graphPicker" if="{pickingBackground}")
    script.
        this.editingCode = false;
        this.pickingBackground = false;
        this.voc = window.languageJSON.roomview;
        const fs = require('fs-extra'),
              gui = require('nw.gui');
        const win = gui.Window.get();
        this.mixin(window.riotWired);
        
        this.roomx = 0;
        this.roomy = 0;
        this.zoomFactor = 1;
        this.grid = 64;
        this.currentType = -1;
        this.dragging = false;
        
        var updateCanvasSize = (newWidth, newHeight) => {
            this.refs.canvas.width = newWidth - $('room-editor .toolbar').width();
            this.refs.canvas.height = newHeight - $('main-nav').height();
            this.refreshRoomCanvas();
        };
        this.on('mount', () => {
            this.room = this.opts.room;
            this.refs.canvas.x = this.refs.canvas.getContext('2d');
            win.on('resize', updateCanvasSize);
            updateCanvasSize();
        });
        this.on('unmount', () => {
            win.off('resize', updateCanvasSize);
        });
        
        this.openRoomEvents = e => {
            this.editingCode = true;
        };
        
        // Навигация по комнате, настройки вида
        this.roomToggleZoom = zoomFactor => e => {
            this.zoomFactor = zoomFactor;
            this.refreshRoomCanvas();
        };
        this.roomToCenter = e => {
            this.roomx = this.roomy = 0;
            this.refreshRoomCanvas();
        };
        this.roomToggleGrid = function () {
            if (this.grid === 0) {
                alertify.prompt(this.voc.gridsize, function (e, input) {
                    if (e) {
                        if (Number(input) > 1) {
                            this.grid = Number(r);
                        }
                    }
                });
            } else {
                glob.grid = 0;
                $('#roomgrid').text(languageJSON.roomview.grid);
            }
        };
        
        // Работа с копиями
        this.tab = 'roomcopies';
        this.changeTab = tab = e => {
            this.tab = tab;
            if (tab === 'roombackgrounds') {
                this.roomUnpickType();
            }
        };
        this.roomUnpickType = e => {
            this.currentType = -1;
        };
        this.selectType = type => e => {
            this.currentType = type;
        };
        var lastTypeLayer;
        var findTypeLayer = type => {
            if (a.depth === this.currentType.depth) {
                lastTypeLayer = a;
                return true;
            }
            return false;
        };
        
        // При клике на канвас помещает копию на соответствующий слой
        this.onCanvasClick = e => {
            // Если не выбран тип создаваемой копии, то ничего не делаем
            if (currentTypePick === -1) {
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

            if (this.grid == 0) {
                targetLayer.copies.push({
                    x: ~~((e.offsetX - (this.refs.canvas.width - this.room.width) / 2 + this.roomx) / this.zoomFactor),
                    y: ~~((e.offsetY - (this.refs.canvas.height - this.room.height) / 2 + this.roomy) / this.zoomFactor),
                    uid: this.currentType.uid
                });
            } else {
                var x = ~~((e.offsetX - (this.refs.canvas.width - this.room.width) / 2 + this.roomx) / this.zoomFactor),
                    y = ~~((e.offsetY - (this.refs.canvas.height - this.room.height) / 2 + this.roomy) / this.zoomFactor);
                targetLayer.copies.push({
                    x: x - (x % glob.grid),
                    y: y - (y % glob.grid),
                    uid: this.currentType.uid
                });
            }
            this.refreshRoomCanvas();
        };
        // При нажатии на канвас, если не выбрана копия, то начинаем перемещение
        this.onCanvasPress = e => {
            if (currentTypePick === -1) {
                this.dragging = true;
            }
        }
        // и безусловно прекращаем перемещение при отпускании мыши
        this.onCanvasMouseUp = e => {
            this.dragging = false;
        };
        // Начинаем перемещение, или же показываем предварительное расположение новой копии
        this.onCanvasMove = e => {
            if (this.dragging) {
                // перетаскивание
                this.roomx -= e.movementX;
                this.roomy -= e.movementY;
                this.refreshRoomCanvas();
            } else {
                if (this.currentType != -1) {
                    let graph, w, h, grax, gray;
                    // превью вставки
                    this.refreshRoomCanvas();
                    this.refs.canvas.x.globalAlpha = 0.5;
                    if (this.currentType.graph != -1) {
                        graph = window.glob.graphmap[this.currentType.graph];
                        w = graph.width / graph.g.grid[0];
                        h = graph.height / graph.g.grid[1];
                        grax = graph.g.axis[0];
                        gray = graph.g.axis[1];
                    } else {
                        graph = window.glob.graphmap[-1];
                        w = h = 32;
                        grax = gray = 16;
                    }
                    if (glob.grid == 0) {
                        this.refs.canvas.x.setTransform(this.zoomFactor,0,0,this.zoomFactor,0,0);
                        this.refs.canvas.x.drawImage(graph,
                                               0,0,w,h,
                                               e.offsetX / this.zoomFactor - grax/this.zoomFactor, e.offsetY / this.zoomFactor - gray / this.zoomFactor,w,h);
                    } else {
                        // если есть сетка, то координаты предварительной копии нужно отснэпить по сетке
                        dx = (e.offsetX + this.roomx - (this.refs.canvas.width - this.room.width) / 2) / this.zoomFactor;
                        dy = (e.offsetY + this.roomy - (this.refs.canvas.height - this.room.height) / 2) / this.zoomFactor;
                        w = glob.graphmap[ct.graph].width / glob.graphmap[ct.graph].g.grid[0];
                        h = glob.graphmap[ct.graph].height / glob.graphmap[ct.graph].g.grid[1];
                        this.refs.canvas.x.drawImage(graph,
                                               0,0,w,h,
                                               dx - dx % glob.grid - grax, dy - dy % glob.grid - gray,w,h);
                    }
                }
            }
        };
        
        // При прокрутке колёсиком меняем фактор зума
        this.onCanvasWheel = e => {
            if (e.wheelDelta > 0) {
                // in
                if (this.zoomFactor === 1) {
                    this.roomToggleZoom(1);
                } else if (this.zoomFactor === 0.5) {
                    this.roomToggleZoom(0.5);
                }  else if (this.zoomFactor === 0.25) {
                    this.roomToggleZoom(0.25);
                }
            } else {
                // out
                if (this.zoomFactor === 2) {
                    this.roomToggleZoom(2);
                } else if (this.zoomFactor === 1) {
                    this.roomToggleZoom(1);
                }  else if (this.zoomFactor === 0.5) {
                    this.roomToggleZoom(0.5);
                }
            }
        };
        this.onCanvasContextMenu = e => {
            // Сначала ищется ближайшая к курсору копия. Если слоёв в комнате нет, то всё отменяется
            if (this.room.layers.length == 0) return false;
            var closest = this.room.layers[0].copies[0],
                layer = 0,
                pos = 0,
                length = Infinity,
                l;
            for (let i = 0, li = this.room.layers.length; i < li; i++) {
                let layer = this.room.layers[i];
                for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                    let xp = layer.copies[j].x * this.zoomFactor + (this.refs.canvas.width - this.room.width) / 2 - this.roomx - e.offsetX,
                        yp = layer.copies[j].y * this.zoomFactor + (this.refs.canvas.height - this.room.height) / 2 - this.roomy - e.offsetY;
                    l = Math.sqrt(xp * xp + yp * yp);
                    console.log(xp, yp, l, length);
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
            this.refs.canvas.x.lineJoin = 'round';
            this.refs.canvas.x.strokeStyle = '#446adb';
            this.refs.canvas.x.lineWidth = 3;
            var left = copy.x - graph.axis[0] - 1.5,
                top = copy.y - graph.axis[1] - 1.5,
                height = graph.width / graph.grid[0] + 3,
                width = + graph.height / graph.grid[1] + 3;
            this.refs.canvas.x.strokeRect(left, top, height, width);
            this.refs.canvas.x.strokeStyle = '#fff';
            this.refs.canvas.x.lineWidth = 1;
            this.refs.canvas.x.strokeRect(left, top, height, width);
    
            roomСanvasMenu.items[0].label = window.languageJSON.roomview.deletecopy.f(type.name);
            roomСanvasMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        
        // Контекстное меню по нажатию на холст
        roomСanvasMenu = new gui.Menu();
        roomСanvasMenu.append(new gui.MenuItem({
            label: window.languageJSON.roomview.deletecopy.f(this.closestType),
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: () => {
                console.log(this.closestLayer, this.closestPos);
                this.room.layers[this.closestLayer].copies.splice(this.closestPos, 1);
                if (this.room.layers[this.closestLayer].copies.length == 0) {
                    this.room.layers.splice(this.closestLayer,1);
                }
                this.refreshRoomCanvas();
            }
        }));
        
        // Позволяет переместить сразу все копии в комнате
        this.roomShift = e => {
            window.alertify.custom(`
                ${window.languageJSON.roomview.shifttext} <br/><br/>
                <label>X: 
                    <input id="roomshiftx" type="number" value="32" />
                </label>
                <label>Y: 
                    <input id="roomshifty" type="number" value="32" />
                </label>
            `, e => {
                if (e) {
                    var dx = Number($('#roomshiftx').val()) || 0,
                        dy = Number($('#roomshifty').val()) || 0;
                    for (let i = 0, l = this.room.layers.length; i < l; i++) {
                        let layer = this.room.layers[i];
                        for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                            layer.copies[j].x += dx;
                            layer.copies[j].y += dy;
                        }
                    }
                }
            });
        };
        
        // Работа с фонами
        this.roomAddBg = function () {
            var newBg = {
                depth: 0,
                graph: -1
            };
            this.room.backgrounds.push(newBg);
            this.pickingBackground = true;
            this.update();
            this.refs.graphPicker.onselected = graph => {
                newBg.graph = graph;
                this.pickingBackground = false;
                this.room.backgrounds.sort(function (a, b) {
                    return a.depth - b.depth;
                });
                this.update();
                this.refreshRoomCanvas();
            };
        };
        this.onBgContextMenu = e => {
            console.log(e);
            this.editedBg = Number(e.item.ind);
            roomBgMenu.popup(e.clientX, e.clientY);
        };
        var roombgMenu = new gui.Menu();
        roombgMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: () => {
                this.room.backgrounds.splice(this.editedBg, 1);
                this.refreshRoomCanvas();
                this.update();
            }
        }));
        this.onChangeBgGraphic = e => {
            this.pickingBackground = true;
            this.update();
            this.refs.graphPicker.onselected = graph => {
                e.item.background.graph = graph;
                this.pickingBackground = false;
                this.update();
                this.refreshRoomCanvas();
            };
        };
        this.onChangeBgName = e => {
            alertify.prompt(window.languageJSON.roomview.newdepth, (ok, response) => {
                if (ok) {
                    if (Number(response)) {
                        e.item.backgrounds[currentBackground].depth = response;
                        e.item.backgrounds.sort(function (a, b) {
                            return a.depth - b.depth;
                        });
                        events.roomRefillBg();
                    }
                }
            });
        };
        
        
        // Сохранение комнаты (по факту, лишь помечает проект как несохранённый и закрывает редактор)
        this.roomSave = e => {
            window.glob.modified = true;
            this.parent.editing = false;
            this.parent.update();
        };
        
        // Прорисовка холста
        this.refreshRoomCanvas = function () {
            var canvas = this.refs.canvas;
            // Перед рисовкой проверим, нормального ли размера наш холст
            if (canvas.width != $('room-editor .editor').width() || canvas.height != $('room-editor .editor').height()) {
                canvas.width = $('room-editor .editor').width();
                canvas.height = $('room-editor .editor').height();
            }
            
            // Сбросим базовые настройки рисования
            canvas.x.setTransform(1,0,0,1,0,0);
            canvas.x.globalAlpha = 1;
            // Очистим холст
            canvas.x.clearRect(0,0,canvas.width,canvas.height);
            
            // Выполним перемещение с учётом зума
            canvas.x.translate(-this.roomx,-this.roomy);
            canvas.x.translate(~~(canvas.width / 2),~~(canvas.height / 2));
            canvas.x.translate(~~(-this.room.width / 2), ~~(-this.room.height / 2));
            canvas.x.scale(this.zoomFactor,this.zoomFactor);
            
            // Сделаем массив слоёв и фонов, и копий. У копий приоритет
            var hybrid = [];
            hybrid = this.room.layers.concat(this.room.backgrounds);
            hybrid.sort((a,b) => {
                if (a.depth - b.depth != 0) {
                    return a.depth - b.depth;
                } else {
                    if (a.copies) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
                return 0;
            });
            if (hybrid.length > 0) { //есть слои вообще?
                // копии
                for (let i = 0, li = hybrid.length; i < li; i++) {
                    if (hybrid[i].copies) { // Если есть поле с копиями, то это не слой-фон
                        let layer = hybrid[i];
                        for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                            let copy = layer.copies[j],
                                type = window.currentProject.types[glob.typemap[copy.uid]];
                            let graph, w, h, 
                                grax, gray; // Центр рисовки графики
                            if (ct.graph != -1) {
                                graph = glob.graphmap[window.currentProject.types[glob.typemap[copy.uid]].graph];
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
                    } else { // это слой-фон
                        canvas.x.fillStyle = canvas.x.createPattern(glob.graphmap[hybrid[i].graph], 'repeat');
                        canvas.x.fillRect(
                            this.roomx/this.zoomFactor + ((~~(this.room.width - canvas.width) / 2)/this.zoomFactor),
                            this.roomy/this.zoomFactor + ((~~(this.room.height - canvas.height) / 2)/this.zoomFactor),
                            canvas.width / this.zoomFactor,
                            canvas.height / this.zoomFactor
                        );
                    }
                }
            }
            
            // Обводка границ комнаты
            canvas.x.lineJoin = "round";
            canvas.x.strokeStyle = "#446adb";
            canvas.x.lineWidth = 3;
            canvas.x.strokeRect(-1.5,-1.5,this.room.width+3,this.room.height+3);
            canvas.x.strokeStyle = "#fff";
            canvas.x.lineWidth = 1;
            canvas.x.strokeRect(-1.5,-1.5,this.room.width+3,this.room.height+3);
        };

        /**
         * Генерирует миниатюру комнаты
         */
        this.roomGenSplash = function() {
            var c = document.createElement('canvas'), 
                w, h, k, size;
            c.x = c.getContext('2d');
            c.width = c.height = size = 256;
            c.x.clearRect(0, 0, size, size);
            w = this.canvas.width;
            h = this.canvas.height;
            if (w > h) {
                k = size / w;
            } else {
                k = size / h;
            }
            if (k > 1) k = 1;
            c.x.drawImage(
                this.canvas,
                0, 0, this.canvas.width, this.canvas.height,
                (size - this.canvas.width*k)/2, (size - this.canvas.height*k)/2,
                this.canvas.width*k,
                this.canvas.height*k
            );
            var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            nam = sessionStorage.projdir + '/img/r' + this.room.uid + '.png';
            fs.writeFile(nam, buf, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            nam2 = sessionStorage.projdir + '/img/splash.png';
            fs.writeFile(nam2, buf, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        };
