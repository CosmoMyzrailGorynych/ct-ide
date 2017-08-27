graphics-panel.panel.view
    label.file
        input#inputgraphic(ref="importer" type="file" multiple accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{graphicImport}")
        .button
            i.icon.icon-plus
            span {voc.import}
    //-    button#graphiccreate(data-event="graphicCreate")
    //-        i.icon.icon-lamp
    //-        span {voc.create}
    ul.cards
        li(
            each="{graphic in window.currentProject.graphs}"
            oncontextmenu="{showGraphicPopup(graphic)}"
            onclick="{openGraphic(graphic)}"
        )
            span {graphic.name}
            img(src="{sessionStorage.projdir + '/img/' + graphic.origname + '_prev.png'}")
    graphic-editor(if="{editing}" graphic="{currentGraphic}")
    script.
        const fs = require('fs-extra'),
              path = require('path'),
              gui = require('nw.gui');
        this.voc = window.languageJSON.graphic;
        this.editing = false;
        
        this.fillGraphMap = () => {
            glob.graphmap = {};
            window.currentProject.graphs.forEach(graph => {
                var img = document.createElement('img');
                glob.graphmap[graph.origname] = img;
                img.g = graph;
                img.src = sessionStorage.projdir + '/img/' + graph.origname;
            });
            var img = document.createElement('img');
            glob.graphmap[-1] = img;
            img.src = '/img/unknown.png';
        };
        this.on('mount', () => {
            this.fillGraphMap();
        });
        
        /**
         * Событие добавления файлов через проводник
         */
        this.graphicImport = e => { // input[type="file"]
            var i;
            files = this.refs.importer.value.split(';');
            for (i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    console.log(i, files[i], 'passed');
                    currentProject.graphtick++;
                    this.loadImg(
                        i,
                        files[i],
                        sessionStorage.projdir + '/img/i' + currentProject.graphtick + path.extname(files[i]),
                        true
                    );
                } else {
                    console.log(i, files[i], 'NOT passed');
                }
            }
        };
        /**
         * Делает попытку загрузить изображение и сделать его миниатюру
         * @param {Number} uid Счётчик. Должно быть уникально для каждого загружаемого изображения
         * @param {String} filename Путь к исходному изображению
         * @param {String} dest Папка, в которую нужно поместить изображение и миниатюру
         * @param {Boolean} imprt Если истинно, то создаёт новую графику в проекте; иначе обновляет текущую открытую графику
         */
        this.loadImg = (uid, filename, dest, imprt) => {
            console.log(uid, filename, 'copying');
            window.megacopy(filename, dest, e => {
                console.log(uid, filename, 'copy finished');
                if (e) throw e;
                image = document.createElement('img');
                image.onload = () => {
                    var obj = {
                        name: path.basename(filename).replace(/\.(jpg|gif|png|jpeg)/gi, '').replace(/\s/g, '_'),
                        untill: 0,
                        grid: [1, 1],
                        axis: [0, 0],
                        origname: path.basename(dest),
                        shape: "rect",
                        left: 0,
                        right: this.width,
                        top: 0,
                        bottom: this.height
                    };
                    this.id = currentProject.graphs.length;
                    window.currentProject.graphs.push(obj);
                    this.imgGenPreview(dest, dest + '_prev.png', 64)
                    .then(dataUrl => {
                        console.log(uid, filename, 'preview generated');
                        this.update();
                    });
                    this.imgGenPreview(dest, dest + '_prev@2.png', 128)
                    .then(dataUrl => {
                        console.log(uid, filename, 'hdpi preview generated');
                    });
                }
                image.onerror = e => {
                    window.alertify.error(e);
                }
                image.src = dest + '?' + Math.random();
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
                    w = size, thumbnail.width;
                    h = size, thumbnail.height;
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
                    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(destFile, buf, err => {
                        if (err) {
                            reject(err);
                        } else {
                            accept(dataURL);
                        }
                    });
                }
                thumbnail.src = source;
            });
        };
        
        // Создание контекстного меню, появляющегося при жмаке на карточку
        // Пункт "Открыть"
        var graphMenu = new gui.Menu();
        graphMenu.append(new gui.MenuItem({
            label: languageJSON.common.open,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: e => {
                this.openGraphic(this.currentGraphic);
            }
        }));
        // пункт "Создать дубликат"
        graphMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
            click: e => {
                window.alertify.prompt(window.languageJSON.common.newname, (e, newName) => {
                    if (e) {
                        if (newName != '') {
                            var newGraphic = JSON.parse(JSON.stringify(currentGraphic));
                            newGraphic.name = newName;
                            window.currentProject.graphtick ++;
                            newGraphic.origname = 'i' + currentProject.graphtick + path.extname(currentGraphic.origname);
                            window.megacopy(sessionStorage.projdir + '/img/' + currentGraphic.origname, sessionStorage.projdir + '/img/i' + currentProject.graphtick + path.extname(this.currentGraphic.origname), () => {
                                window.currentProject.graphs.push(gr);
                                this.update();
                            });
                        }
                    }
                }, currentGraphic.name + '_dup');
            }
        }));
        // пункт "Переименовать"
        graphMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click: e => {
                window.alertify.prompt(window.languageJSON.common.newname, function (e, newName) {
                    if (e) {
                        if (newName != '') {
                            currentGraphic.name = newName;
                            this.update();
                        }
                    }
                }, currentGraphic.name);
            }
        }));
        // Пункт "Удалить"
        graphMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: e => {
                window.alertify.confirm(window.languageJSON.common.confirmDelete.f(this.currentGraphic.name), response => {
                    if (response) {
                        window.currentProject.graphs.splice(this.currentGraphicId,1);
                        this.update();
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
        };
        
        /**
         * Открывает редактор для указанного объекта графики
         */
        this.openGraphic = graphic => e => {
            this.currentGraphic = graphic;
            this.currentGraphicId = window.currentProject.graphs.indexOf(graphic);
            this.editing = true;
        };
