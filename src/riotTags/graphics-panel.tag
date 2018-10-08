graphics-panel.panel.view
    .flexfix.tall
        div
            .toright
                b {vocGlob.sort}   
                button.inline.square(onclick="{switchSort('date')}" class="{selected: sort === 'date' && !searchResults}")
                    i.icon-clock
                button.inline.square(onclick="{switchSort('name')}" class="{selected: sort === 'name' && !searchResults}")
                    i.icon-sort-alphabetically
                .aSearchWrap
                    input.inline(type="text" onkeyup="{fuseSearch}")
            .toleft
                label.file.flexfix-header
                    input(type="file" multiple 
                        accept=".png,.jpg,.jpeg,.bmp,.gif" 
                        onchange="{graphicImport}")
                    .button
                        i.icon.icon-import
                        span {voc.import}
        //-    button#graphiccreate(data-event="graphicCreate")
        //-        i.icon.icon-lamp
        //-        span {voc.create}
        ul.cards.flexfix-body
            li(
                each="{graphic in (searchResults? searchResults : graphs)}"
                oncontextmenu="{showGraphicPopup(graphic)}"
                onclick="{openGraphic(graphic)}"
                no-reorder
            )
                span {graphic.name}
                img(src="file://{sessionStorage.projdir + '/img/' + graphic.origname + '_prev.png?' + graphic.lastmod}")
        
    .aDropzone(if="{dropping}")
        .middleinner
            i.icon-import
            h2 {languageJSON.common.fastimport}
            input(type="file" multiple 
                accept=".png,.jpg,.jpeg,.bmp,.gif" 
                onchange="{graphicImport}")
    
    graphic-editor(if="{editing}" graphic="{currentGraphic}")
    script.
        const fs = require('fs-extra'),
              path = require('path'),
              gui = require('nw.gui');
        this.namespace = 'graphic';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.dropping = false;
        this.sort = 'name';
        this.sortReverse = false;

        this.updateList = () => {
            this.graphs = [...window.currentProject.graphs];
            if (this.sort === 'name') {
                this.graphs.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.graphs.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.graphs.reverse();
            }
        };
        this.switchSort = sort => e => {
            if (this.sort === sort) {
                this.sortReverse = !this.sortReverse;
            } else {
                this.sort = sort;
                this.sortReverse = false;
            }
            this.updateList();
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
                var fuse = new Fuse(this.graphs, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };

        this.fillGraphMap = () => {
            glob.graphmap = {};
            window.currentProject.graphs.forEach(graph => {
                var img = document.createElement('img');
                glob.graphmap[graph.uid] = img;
                img.g = graph;
                img.src = 'file://' + sessionStorage.projdir + '/img/' + graph.origname + '?' + graph.lastmod;
            });
            var img = document.createElement('img');
            glob.graphmap[-1] = img;
            img.src = '/img/unknown.png';
        };
        this.on('mount', () => {
            this.updateList();
            this.fillGraphMap();
        });
        
        /**
         * Событие добавления файлов через проводник
         */
        this.graphicImport = e => { // input[type="file"]
            var i;
            files = e.target.value.split(';');
            for (i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    let id = window.generateGUID();
                    this.loadImg(
                        id,
                        files[i],
                        sessionStorage.projdir + '/img/i' + id + path.extname(files[i]),
                        true
                    );
                } else {
                    
                }
            }
            this.dropping = false;
            e.preventDefault();
        };
        /**
         * Делает попытку загрузить изображение, добавить в проект и сделать его миниатюру
         * @param {Number} uid Счётчик. Должно быть уникально для каждого загружаемого изображения
         * @param {String} filename Путь к исходному изображению
         * @param {String} dest Папка, в которую нужно поместить изображение и миниатюру
         * @param {Boolean} imprt Если истинно, то создаёт новую графику в проекте; иначе обновляет текущую открытую графику
         */
        this.loadImg = (uid, filename, dest, imprt) => {
            window.megacopy(filename, dest, e => {
                if (e) throw e;
                var image = document.createElement('img');
                image.onload = () => {
                    setTimeout(() => {
                        var obj = {
                            name: path.basename(filename).replace(/\.(jpg|gif|png|jpeg)/gi, '').replace(/\s/g, '_'),
                            untill: 0,
                            grid: [1, 1],
                            axis: [0, 0],
                            marginx: 0,
                            marginy: 0,
                            imgWidth: image.width,
                            imgHeight: image.height,
                            width: image.width,
                            height: image.height,
                            offx: 0,
                            offy: 0,
                            origname: path.basename(dest),
                            source: filename,
                            shape: 'rect',
                            left: 0,
                            right: image.width,
                            top: 0,
                            bottom: image.height,
                            uid: uid
                        };
                        window.currentProject.graphs.push(obj);
                        this.imgGenPreview(dest, dest + '_prev.png', 64)
                        .then(dataUrl => {
                            this.updateList();
                            this.update();
                        });
                        this.imgGenPreview(dest, dest + '_prev@2.png', 128);
                        this.fillGraphMap();
                    }, 0);
                }
                image.onerror = e => {
                    alertify.error(e);
                }
                image.src = 'file://' + dest + '?' + Math.random();
            });
        };
        /**
         * Генерирует квадратную превьюху из исходного изображения
         * @param {String} source Путь к исходному изображению
         * @param {String} destFile Путь к создаваемой превью
         * @param {Number} size Размер стороны квадрата в пикселах
         * @returns {Promise} Промис по завершению создания превью. При успехе передаёт data-url полученного превью
         */
        this.imgGenPreview = (source, destFile, size) => {
            var thumbnail = document.createElement('img');
            return new Promise((accept, reject) => {
                thumbnail.onload = () => {
                    var c = document.createElement('canvas'), 
                    w, h, k;
                    c.x = c.getContext('2d');
                    c.width = c.height = size;
                    c.x.clearRect(0, 0, size, size);
                    w = thumbnail.width;
                    h = thumbnail.height;
                    if (w > h) {
                        k = size / w;
                    } else {
                        k = size / h;
                    }
                    if (k > 1) k = 1;
                    c.x.drawImage(
                        thumbnail,
                        (size - thumbnail.width*k)/2,
                        (size - thumbnail.height*k)/2,
                        thumbnail.width*k,
                        thumbnail.height*k
                    );
                    // strip off the data:image url prefix to get just the base64-encoded bytes
                    var dataURL = c.toDataURL();
                    var data = dataURL.replace(/^data:image\/\w+;base64,/, '');
                    var buf = new Buffer(data, 'base64');
                    var stream = fs.createWriteStream(destFile);
                    stream.on('finish', () => {
                        setTimeout(() => { // WHY THE HECK I EVER NEED THIS?!
                            accept(destFile);
                        }, 100);
                    });
                    stream.on('error', err => {
                        reject(err);
                    });
                    stream.end(buf);
                }
                thumbnail.src = 'file://' + source;
            });
        };
        
        // Создание контекстного меню, появляющегося при жмаке на карточку
        var graphMenu = new gui.Menu();
        graphMenu.append(new gui.MenuItem({
            label: languageJSON.common.open,
            click: e => {
                this.openGraphic(this.currentGraphic);
                this.update();
            }
        }));
        // Пункт "Скопировать название"
        graphMenu.append(new gui.MenuItem({
            label: languageJSON.common.copyName,
            click: e => {
                var clipboard = nw.Clipboard.get();
                clipboard.set(this.currentGraphic.name, 'text');
            }
        }));
        // пункт "Переименовать"
        graphMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            click: e => {
                alertify
                .defaultValue(this.currentGraphic.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    console.log(e);
                    if (e.inputValue && e.inputValue != '' && e.buttonClicked !== 'cancel') {
                        this.currentGraphic.name = e.inputValue;
                        this.update();
                    }
                });
            }
        }));
        graphMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        // Пункт "Удалить"
        graphMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            click: e => {
                alertify
                .okBtn(window.languageJSON.common.delete)
                .cancelBtn(window.languageJSON.common.cancel)
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentGraphic.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        for (const type of window.currentProject.types) {
                            if (type.graph === this.currentGraphic.uid) {
                                type.graph = -1;
                            }
                        }
                        for (const room of window.currentProject.rooms) {
                            if ('tiles' in room) {
                                for (const layer of room.tiles) {
                                    let i = 0;
                                    while (i < layer.tiles.length) {
                                        if (layer.tiles[i].graph === this.currentGraphic.uid) {
                                            layer.tiles.splice(i, 1);
                                        } else {
                                            i++;
                                        }
                                    }
                                } 
                            }
                            if ('backgrounds' in room) {
                                let i = 0;
                                while (i < room.backgrounds.length) {
                                    if (room.backgrounds[i].graph === this.currentGraphic.uid) {
                                        room.backgrounds.splice(i, 1);
                                    } else {
                                        i++;
                                    }
                                }
                            }
                        }

                        window.currentProject.graphs.splice(this.currentGraphicId,1);
                        this.updateList();
                        this.update();
                        alertify
                        .okBtn(window.languageJSON.common.ok)
                        .cancelBtn(window.languageJSON.common.cancel);
                    }
                });
            }
        }));
        /**
         * Отобразить контекстное меню
         */
        this.showGraphicPopup = graphic => e => {
            this.currentGraphicId = currentProject.graphs.indexOf(graphic);
            this.currentGraphic = graphic; 
            graphMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        
        /**
         * Открывает редактор для указанного объекта графики
         */
        this.openGraphic = graphic => e => {
            this.currentGraphic = graphic;
            this.currentGraphicId = window.currentProject.graphs.indexOf(graphic);
            this.editing = true;
        };

        /*
         * Дополнения для drag-n-drop
         */
        var dragTimer;
        this.onDragOver = e => {
            var dt = e.dataTransfer;
            if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
                this.dropping = true;
                this.update();
                window.clearTimeout(dragTimer);
            }
            e.preventDefault();
            e.stopPropagation();
        };
        this.onDrop = e => {
             e.stopPropagation();
        };
        this.onDragLeave = e => {
            dragTimer = window.setTimeout(() => {
                this.dropping = false;
                this.update()
            }, 25);
            e.preventDefault();
            e.stopPropagation();
        };
        this.on('mount', () => {
            document.addEventListener('dragover', this.onDragOver);
            document.addEventListener('dragleave', this.onDragLeave);
            document.addEventListener('drop', this.onDrop);
        });
        this.on('unmount', () => {
            document.removeEventListener('dragover', this.onDragOver);
            document.removeEventListener('dragleave', this.onDragLeave);
            document.removeEventListener('drop', this.onDrop);
        });