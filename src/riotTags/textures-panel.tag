textures-panel.panel.view
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
                        accept=".png,.jpg,.jpeg,.bmp,.gif,.json" 
                        onchange="{textureImport}")
                    .button
                        i.icon.icon-import
                        span {voc.import}
        //-    button#texturecreate(data-event="textureCreate")
        //-        i.icon.icon-lamp
        //-        span {voc.create}
        .flexfix-body
            ul.cards
                li(
                    each="{texture in (searchResults? searchResults : textures)}"
                    oncontextmenu="{showTexturePopup(texture)}"
                    onclick="{openTexture(texture, false)}"
                    no-reorder
                )
                    span {texture.name}
                    img(src="file://{sessionStorage.projdir + '/img/' + texture.origname + '_prev.png?' + texture.lastmod}")
            h2 
                span {voc.skeletons}
                docs-shortcut(path="/skeletal-animation.html")
            ul.cards
                li(
                    each="{skeleton in (searchResultsSkel? searchResultsSkel : skeletons)}"
                    oncontextmenu="{showTexturePopup(skeleton, true)}"
                    onclick="{openSkeleton(texture)}"
                    no-reorder
                )
                    span {skeleton.name}
                    img(src="file://{sessionStorage.projdir + '/img/' + skeleton.origname + '_prev.png?' + skeleton.lastmod}")
                
                label.file.flexfix-header
                    input(type="file" multiple 
                        accept=".json" 
                        onchange="{textureImport}")
                    .button
                        i.icon.icon-import
                        span {voc.import}
        
    .aDropzone(if="{dropping}")
        .middleinner
            i.icon-import
            h2 {languageJSON.common.fastimport}
            input(type="file" multiple 
                accept=".png,.jpg,.jpeg,.bmp,.gif,.json" 
                onchange="{textureImport}")
    
    texture-editor(if="{editing}" texture="{currentTexture}")
    script.
        const fs = require('fs-extra'),
              path = require('path'),
              gui = require('nw.gui');
        this.namespace = 'texture';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.dropping = false;
        this.sort = 'name';
        this.sortReverse = false;

        this.updateList = () => {
            this.textures = [...window.currentProject.textures];
            this.skeletons = [...window.currentProject.skeletons];
            if (this.sort === 'name') {
                this.textures.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                this.skeletons.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.textures.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
                this.skeletons.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.textures.reverse();
                this.skeletons.reverse();
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
                var fuse = new Fuse(this.textures, fuseOptions);
                var fuseSkel = new Fuse(this.skeletons, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
                this.searchResultsSkel = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };

        this.fillTextureMap = () => {
            glob.texturemap = {};
            window.currentProject.textures.forEach(texture => {
                var img = document.createElement('img');
                glob.texturemap[texture.uid] = img;
                img.g = texture;
                img.src = 'file://' + sessionStorage.projdir + '/img/' + texture.origname + '?' + texture.lastmod;
            });
            var img = document.createElement('img');
            glob.texturemap[-1] = img;
            img.g = {
                width: 32,
                height: 32,
                offx: 0,
                offy: 0,
                grid: [1, 1],
                axis: [16, 16],
                marginx: 0,
                marginy: 0,
                imgWidth: 32,
                imgHeight: 32,
                closedStrip: true
            }
            img.src = '/data/img/unknown.png';
        };

        this.setUpPanel = e => {
            this.updateList();
            this.fillTextureMap();
            this.searchResults = null;
            this.editing = false;
            this.dropping = false;
            this.currentTexture = null;
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        /**
         * Событие добавления файлов через проводник
         */
        this.textureImport = e => { // input[type="file"]
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
                } else if (/_ske\.json/i.test(files[i])) {
                    let id = window.generateGUID();
                    this.loadSkeleton(
                        id,
                        files[i],
                        sessionStorage.projdir + '/img/skdb' + id + '_ske.json'
                    )
                }
            }
            e.srcElement.value = "";
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
                        window.currentProject.textures.push(obj);
                        this.imgGenPreview(dest, dest + '_prev.png', 64)
                        .then(dataUrl => {
                            this.updateList();
                            this.update();
                        });
                        this.imgGenPreview(dest, dest + '_prev@2.png', 128);
                        this.fillTextureMap();
                    }, 0);
                }
                image.onerror = e => {
                    alertify.error(e);
                }
                image.src = 'file://' + dest + '?' + Math.random();
            });
        };
        this.loadSkeleton = (uid, filename, dest) => {
            fs.copy(filename, dest)
            .then(() => fs.copy(filename.replace('_ske.json', '_tex.json'), dest.replace('_ske.json', '_tex.json')))
            .then(() => fs.copy(filename.replace('_ske.json', '_tex.png'), dest.replace('_ske.json', '_tex.png')))
            .then(() => {
                currentProject.skeletons.push({
                    name: path.basename(filename).replace('_ske.json', ''),
                    origname: path.basename(dest),
                    from: 'dragonbones',
                    uid: uid
                })
                this.skelGenPreview(dest, dest + '_prev.png', 64)
                .then(dataUrl => {
                    this.updateList();
                    this.update();
                });
                this.skelGenPreview(dest, dest + '_prev@2.png', 128);
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
        /**
         * Генерирует квадратную превьюху из исходного изображения
         * @param {String} source Путь к исходному _ske.json файлу
         * @param {String} destFile Путь к создаваемой превью
         * @param {Number} size Размер стороны квадрата в пикселах
         * @returns {Promise} Промис по завершению создания превью. При успехе передаёт data-url полученного превью
         */
        this.skelGenPreview = (source, destFile, size) => {
            const loader = new PIXI.loaders.Loader(),
                  dbf = dragonBones.PixiFactory.factory;
            const slice = source.replace('_ske.json', '');
            return new Promise((resolve, reject) => {
                loader.add(`${slice}_ske.json`, `${slice}_ske.json`)
                    .add(`${slice}_tex.json`, `${slice}_tex.json`)
                    .add(`${slice}_tex.png`, `${slice}_tex.png`);
                loader.load(() => {
                    const app = new PIXI.Application();
                    dbf.parseDragonBonesData(loader.resources[`${slice}_ske.json`].data);
                    dbf.parseTextureAtlasData(loader.resources[`${slice}_tex.json`].data, loader.resources[`${slice}_tex.png`].texture);
                    const skel = dbf.buildArmatureDisplay('Armature', loader.resources[`${slice}_ske.json`].data.name);
                    const base64 = app.renderer.plugins.extract.base64(skel)
                    var data = base64.replace(/^data:image\/\w+;base64,/, '');;
                    var buf = new Buffer(data, 'base64');
                    var stream = fs.createWriteStream(destFile);
                    stream.on('finish', () => {
                        setTimeout(() => { // WHY THE HECK I EVER NEED THIS?!
                            resolve(destFile);
                        }, 100);
                    });
                    stream.on('error', err => {
                        reject(err);
                    });
                    stream.end(buf);
                });
            });
        };
        
        // Создание контекстного меню, появляющегося при жмаке на карточку
        var textureMenu = new gui.Menu();
        textureMenu.append(new gui.MenuItem({
            label: languageJSON.common.open,
            click: e => {
                if (this.currentTextureType === 'skeleton') {
                    this.openSkeleton(this.currentTexture)();
                } else {
                    this.openTexture(this.currentTexture)();
                }
                this.update();
            }
        }));
        // Пункт "Скопировать название"
        textureMenu.append(new gui.MenuItem({
            label: languageJSON.common.copyName,
            click: e => {
                var clipboard = nw.Clipboard.get();
                clipboard.set(this.currentTexture.name, 'text');
            }
        }));
        // пункт "Переименовать"
        textureMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            click: e => {
                alertify
                .defaultValue(this.currentTexture.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    console.log(e);
                    if (e.inputValue && e.inputValue != '' && e.buttonClicked !== 'cancel') {
                        this.currentTexture.name = e.inputValue;
                        this.update();
                    }
                });
            }
        }));
        textureMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        // Пункт "Удалить"
        textureMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            click: e => {
                alertify
                .okBtn(window.languageJSON.common.delete)
                .cancelBtn(window.languageJSON.common.cancel)
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentTexture.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        if (this.currentTextureType === 'skeleton') {
                            window.currentProject.skeletons.splice(this.currentTextureId, 1);
                        } else {
                            for (const type of window.currentProject.types) {
                                if (type.texture === this.currentTexture.uid) {
                                    type.texture = -1;
                                }
                            }
                            for (const room of window.currentProject.rooms) {
                                if ('tiles' in room) {
                                    for (const layer of room.tiles) {
                                        let i = 0;
                                        while (i < layer.tiles.length) {
                                            if (layer.tiles[i].texture === this.currentTexture.uid) {
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
                                        if (room.backgrounds[i].texture === this.currentTexture.uid) {
                                            room.backgrounds.splice(i, 1);
                                        } else {
                                            i++;
                                        }
                                    }
                                }
                            }
                            window.currentProject.textures.splice(this.currentTextureId, 1);
                        }
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
        this.showTexturePopup = (texture, isSkeleton) => e => {
            this.currentTextureType = isSkeleton? 'skeleton' : 'texture';
            if (isSkeleton) {
                this.currentTextureId = currentProject.skeletons.indexOf(texture);
            } else {
                this.currentTextureId = currentProject.textures.indexOf(texture);
            }
            this.currentTexture = texture; 
            textureMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        
        /**
         * Открывает редактор для указанного объекта графики
         */
        this.openTexture = texture => e => {
            this.currentTexture = texture;
            this.currentTextureId = window.currentProject.textures.indexOf(texture);
            this.editing = true;
        };
        this.openSkeleton = skel => e => {

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