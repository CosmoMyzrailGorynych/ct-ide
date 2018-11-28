graphic-editor.panel.view
    .column.borderright.tall.column1.flexfix
        .flexfix-body
            b {voc.name}
            br
            input.wide(type="text" value="{opts.graphic.name}" onchange="{wire('this.graphic.name')}")
            .anErrorNotice(if="{nameTaken}") {vocGlob.nametaken}
            br
            b {voc.center}
            .flexrow
                input.short(type="number" value="{opts.graphic.axis[0]}" onchange="{wire('this.graphic.axis.0')}" oninput="{wire('this.graphic.axis.0')}")
                span.center   ×  
                input.short(type="number" value="{opts.graphic.axis[1]}" onchange="{wire('this.graphic.axis.1')}" oninput="{wire('this.graphic.axis.1')}")
            br
            .flexrow
                button.wide(onclick="{graphicCenter}")
                    span   {voc.setcenter}
                button.square(onclick="{graphicIsometrify}" title="{voc.isometrify}")
                    i.icon-map-pin
            br
            b {voc.form}
            br
            label
                input(type="radio" name="collisionform" checked="{opts.graphic.shape === 'circle'}" onclick="{graphicSelectCircle}")
                span {voc.round}
            br
            label
                input(type="radio" name="collisionform" checked="{opts.graphic.shape === 'rect'}" onclick="{graphicSelectRect}")
                span {voc.rectangle}
            br
            div(if="{opts.graphic.shape === 'circle'}")
                b {voc.radius}
                br
                input.wide(type="number" value="{opts.graphic.r}" onchange="{wire('this.graphic.r')}" oninput="{wire('this.graphic.r')}")
            div(if="{opts.graphic.shape === 'rect'}")
                .center
                    input.short(type="number" value="{opts.graphic.top}" onchange="{wire('this.graphic.top')}" oninput="{wire('this.graphic.top')}")
                    br
                    input.short(type="number" value="{opts.graphic.left}" onchange="{wire('this.graphic.left')}" oninput="{wire('this.graphic.left')}")
                    span   ×  
                    input.short(type="number" value="{opts.graphic.right}" onchange="{wire('this.graphic.right')}" oninput="{wire('this.graphic.right')}")
                    br
                    input.short(type="number" value="{opts.graphic.bottom}" onchange="{wire('this.graphic.bottom')}" oninput="{wire('this.graphic.bottom')}")
                br
                button.wide(onclick="{graphicFillRect}")
                    i.icon-maximize
                    span {voc.fill}
            br
            label
                input(checked="{prevShowMask}" onchange="{wire('this.prevShowMask')}" type="checkbox")
                span   {voc.showmask}
        .flexfix-footer
            button.wide(onclick="{graphicSave}") 
                i.icon-save
                span {window.languageJSON.common.save}
    .column.column2.borderleft.tall.flexfix
        .flexfix-body
            .fifty.np
                b {voc.cols}
                br
                input.wide(type="number" value="{opts.graphic.grid[0]}" onchange="{wire('this.graphic.grid.0')}" oninput="{wire('this.graphic.grid.0')}")
            .fifty.np
                b {voc.rows}
                br
                input.wide(type="number" value="{opts.graphic.grid[1]}" onchange="{wire('this.graphic.grid.1')}" oninput="{wire('this.graphic.grid.1')}")
            .clear
            .fifty.np
                b {voc.width}
                br
                input.wide(type="number" value="{opts.graphic.width}" onchange="{wire('this.graphic.width')}" oninput="{wire('this.graphic.width')}")
            .fifty.np
                b {voc.height}
                br
                input.wide(type="number" value="{opts.graphic.height}" onchange="{wire('this.graphic.height')}" oninput="{wire('this.graphic.height')}")
            .clear
            .fifty.np
                b {voc.marginx}
                br
                input.wide(type="number" value="{opts.graphic.marginx}" onchange="{wire('this.graphic.marginx')}" oninput="{wire('this.graphic.marginx')}")
            .fifty.np
                b {voc.marginy}
                br
                input.wide(type="number" value="{opts.graphic.marginy}" onchange="{wire('this.graphic.marginy')}" oninput="{wire('this.graphic.marginy')}")
            .clear
            .fifty.np
                b {voc.offx}
                br
                input.wide(type="number" value="{opts.graphic.offx}" onchange="{wire('this.graphic.offx')}" oninput="{wire('this.graphic.offx')}")
            .fifty.np
                b {voc.offy}
                br
                input.wide(type="number" value="{opts.graphic.offy}" onchange="{wire('this.graphic.offy')}" oninput="{wire('this.graphic.offy')}")
            .clear
            b {voc.frames}
            br
            input#graphframes.wide(type="number" value="{opts.graphic.untill}" onchange="{wire('this.graphic.untill')}" oninput="{wire('this.graphic.untill')}")
            br
            label
                input#graphtiled(type="checkbox" checked="{opts.graphic.tiled}" onchange="{wire('this.graphic.tiled')}")
                span   {voc.tiled}
        .preview.bordertop.flexfix-footer
            #preview(ref="preview" style="background-color: {previewColor};")
                canvas(ref="grprCanvas")
            div
                button#graphplay.square.inline(onclick="{currentGraphicPreviewPlay}")
                    i(class="icon-{this.prevPlaying? 'pause' : 'play'}")
                button#graphviewback.square.inline(onclick="{currentGraphicPreviewBack}")
                    i.icon-back
                button#graphviewnext.square.inline(onclick="{currentGraphicPreviewNext}")
                    i.icon-next
                span(ref="graphviewframe") 0 / 1
                br
                b {voc.speed}
                input#grahpspeed.short(type="number" min="1" value="{prevSpeed}" onchange="{wire('this.prevSpeed')}" oninput="{wire('this.prevSpeed')}")
            .relative
                button#graphcolor.inline.wide(onclick="{changeGraphicPreviewColor}")
                    i.icon-drop
                    span {voc.bgcolor}
            input.color.rgb#previewbgcolor
    //-
        button#graphsplicedone.wide(onclick="graphicFinishSplit")
            i.icon-confirm
            span {voc.done}

    color-picker(
        ref="previewBackgroundColor" if="{changingGraphicPreviewColor}"
        color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"
    )
    .graphic-editor-anAtlas(style="background-color: {previewColor};")
        .graphview-tools
            label.toright.file(title="{voc.replacegraph}")
                input(type="file" ref="graphReplacer" accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{graphReplace}")
                .button.inline
                    i.icon-folder
                    span {voc.replacegraph}
            .button.inline.toright(title="{voc.reimport}" if="{opts.graphic.source}" onclick="{reimport}")
                i.icon-refresh-ccw
            //- TODO
            //-
                .button-stack
                    button.inline(title="#graphview.tools.deleteframe" onclick="{graphicDeleteFrame}")
                        i.icon-delete
                    button.inline(title="#graphview.tools.duplicateframe" onclick="{graphicDuplicateFrame}")
                        i.icon-duplicate
                    button.inline(title="#graphview.tools.addframe" onclick="{graphicAddFrame}")
                        i.icon-plus
                .button-stack
                    button.inline(title="#graphview.tools.shift" onclick="{graphicShift}")
                        i.icon-move-view
                    button.inline(title="#graphview.tools.flipvertical" onclick="{graphicFlipVertical}")
                        i.icon-flip-vertical
                    button.inline(title="#graphview.tools.fliphorizontal" onclick="{graphicFlipHorizontal}")
                        i.icon-flip-horisontal
                    button.inline(title="#graphview.tools.rotate" onclick="{graphicRotate}")
                        i.icon-refresh
                .button-stack
                    button.inline(title="#graphview.tools.resize" onclick="{graphicResize}")
                        i.icon-maximize
                    button.inline(title="#graphview.tools.crop" onclick="{graphicCrop}")
                        i.icon-crop
        canvas(ref="graphCanvas")
    script.
        const path = require('path'),
              fs = require('fs-extra');
        this.namespace = 'graphview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.nameTaken = false;
        this.prevPlaying = true;
        this.prevPos = 0;
        this.prevSpeed = 10;
        this.prevShowMask = true;
        this.previewColor = localStorage.UItheme === 'Day'? '#ffffff' : '#08080D';
        
        var graphCanvas, grprCanvas;
        
        this.on('mount', () => {
            graphCanvas = this.refs.graphCanvas;
            grprCanvas = this.refs.grprCanvas;
            graphCanvas.x = graphCanvas.getContext('2d');
            grprCanvas.x = grprCanvas.getContext('2d');
            var graphic = this.graphic = this.opts.graphic;
            var img = document.createElement('img');
            img.onload = () => {
                graphCanvas.img = img;
                this.update();
                setTimeout(() => {
                    this.launchGraphPreview();
                }, 0);
            };
            img.onerror = e => {
                alertify.error(languageJSON.graphview.corrupted);
                console.error(e);
                this.graphicSave();
            };
            img.src = path.join('file://', sessionStorage.projdir, '/img/', graphic.origname) + '?' + Math.random();
        });
        this.on('update', () => {
            if (window.currentProject.graphs.find(graph => 
                this.graphic.name === graph.name && this.graphic !== graph
            )) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        });
        this.on('updated', () => {
            this.refreshGraphCanvas();
        });
        this.on('unmount', () => {
            if (this.prevPlaying) { // вырубаем анимацию превью, если редактор был закрыт
                this.stopGraphPreview();
            }
        });
        
        this.graphReplace = e => {
            if (/\.(jpg|gif|png|jpeg)/gi.test(this.refs.graphReplacer.value)) {
                this.loadImg(
                    this.graphic.uid,
                    this.refs.graphReplacer.value,
                    sessionStorage.projdir + '/img/i' + this.graphic.uid + path.extname(this.refs.graphReplacer.value)
                );
                this.graphic.source = this.refs.graphReplacer.value;
            } else {
                alertify.error(window.languageJSON.common.wrongFormat);
                console.log(this.refs.graphReplacer.value, 'NOT passed');
            }
            this.refs.graphReplacer.value = '';
        };
        this.reimport = e => {
            this.loadImg(
                this.graphic.uid,
                this.graphic.source,
                sessionStorage.projdir + '/img/i' + this.graphic.uid + path.extname(this.refs.graphReplacer.value)
            );
        }

        /**
         * Загружает изображение в редактор и генерирует квадратную превьюху из исходного изображения
         * @param {Number} uid Идентификатор изображения
         * @param {String} filename Путь к исходному изображению
         * @param {Sting} dest Путь к изображению в папке проекта
         */
        this.loadImg = (uid, filename, dest) => {
            window.megacopy(filename, dest, e => {
                if (e) throw e;
                image = document.createElement('img');
                image.onload = () => {
                    this.graphic.imgWidth = image.width;
                    this.graphic.imgHeight = image.height;
                    this.graphic.origname = path.basename(dest);
                    graphCanvas.img = image;
                    this.graphic.lastmod = +(new Date());
                    this.parent.imgGenPreview(dest, dest + '_prev.png', 64, () => {
                        this.update();
                    });
                    this.parent.imgGenPreview(dest, dest + '_prev@2.png', 128, () => {
                        
                    });
                    setTimeout(() => {
                        this.refreshGraphCanvas();
                        this.parent.fillGraphMap();
                        this.launchGraphPreview();
                    }, 0);
                };
                image.onerror = e => {
                    alertify.error(e);
                };
                image.src = 'file://' + dest + '?' + Math.random();
            });
        };
        
        // TODO
        this.graphicDeleteFrame = e => {
            
        };
        this.graphicDuplicateFrame = e => {
            
        };
        this.graphicAddFrame = e => {
            
        };
        this.graphicShift = e => {
            
        };
        this.graphicFlipVertical = e => {
            
        };
        this.graphicFlipHorizontal = e => {
            
        };
        this.graphicRotate = e => {
            
        };
        this.graphicResize = e => {
            
        };
        this.graphicCrop = e => {
            
        };

        /**
         * Установить ось вращения на центр изображения
         */
        this.graphicCenter = e => {
            var graphic = this.graphic;
            graphic.axis[0] = Math.floor(graphic.width / 2);
            graphic.axis[1] = Math.floor(graphic.height / 2);
        };
        /**
         * Заполнить всё изображение маской-квадратом 
         */
        this.graphicFillRect = e => {
            var graphic = this.graphic;
            graphic.left = ~~(graphic.axis[0]);
            graphic.top = ~~(graphic.axis[1]);
            graphic.right = ~~(graphic.width - graphic.axis[0]);
            graphic.bottom = ~~(graphic.height - graphic.axis[1]);
        };
        this.graphicIsometrify = e => {
            var graphic = this.graphic;
            graphic.axis[0] = Math.floor(graphic.width / 2);
            graphic.axis[1] = graphic.height;
            this.graphicFillRect();
        };
        /**
         * Запустить предпросмотр анимации
         */
        this.currentGraphicPreviewPlay = e => {
            if (this.prevPlaying) {
                this.stopGraphPreview();
            } else {
                this.launchGraphPreview();
            }
            this.prevPlaying = !this.prevPlaying;
        };
        /**
         * Отступить на шаг назад в предпросмотре анимации
         */
        this.currentGraphicPreviewBack = e => {
            this.prevPos--;
            var graphic = this.graphic;
            var total = graphic.untill === 0? graphic.grid[0] * graphic.grid[1] : Math.min(graphic.grid[0] * graphic.grid[1], graphic.untill);
            if (this.prevPos < 0) {
                this.prevPos = graphic.untill === 0 ? graphic.grid[0] * graphic.grid[1] : total - 0;
            }
            this.refreshPreviewCanvas();
        };
        /**
         * Шагнуть на кадр вперёд в предпросмотре анимации
         */
        this.currentGraphicPreviewNext = e => {
            this.prevPos++;
            var graphic = this.graphic;
            var total = graphic.untill === 0? graphic.grid[0] * graphic.grid[1] : Math.min(graphic.grid[0] * graphic.grid[1], graphic.untill);
            if (this.prevPos >= total) {
                this.prevPos = 0;
            }
            this.refreshPreviewCanvas();
        };
        this.refreshPreviewCanvas = () => {
            let xx = this.prevPos % this.graphic.grid[0],
                yy = Math.floor(this.prevPos / this.graphic.grid[0]),
                x = this.graphic.offx + xx * (this.graphic.marginx + this.graphic.width),
                y = this.graphic.offy + yy * (this.graphic.marginy + this.graphic.height),
                w = this.graphic.width,
                h = this.graphic.height;
            grprCanvas.width = w;
            grprCanvas.height = h;

            grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
            grprCanvas.x.drawImage(
                graphCanvas.img, 
                x, y, w, h, 
                0, 0, w, h
            );
            // shape
            if (this.prevShowMask) {
                grprCanvas.x.globalAlpha = 0.5;
                grprCanvas.x.fillStyle = '#ff0';
                if (this.graphic.shape == 'rect') {
                    grprCanvas.x.fillRect(
                        this.graphic.axis[0] - this.graphic.left,
                        this.graphic.axis[1] - this.graphic.top,
                        this.graphic.right + this.graphic.left,
                        this.graphic.bottom + this.graphic.top
                    );
                } else {
                    grprCanvas.x.beginPath();
                    grprCanvas.x.arc(this.graphic.axis[0], this.graphic.axis[1], this.graphic.r, 0, 2 * Math.PI);
                    grprCanvas.x.fill();
                }
                grprCanvas.x.globalAlpha = 1;
                grprCanvas.x.fillStyle = '#f33';
                grprCanvas.x.beginPath();
                grprCanvas.x.arc(this.graphic.axis[0], this.graphic.axis[1], 3, 0, 2 * Math.PI);
                grprCanvas.x.fill();
            }
        };
        /**
         * Остановить предпросмотр анимации
         */
        this.stopGraphPreview = () => {
            window.clearTimeout(this.prevTime);
        };
        /**
         * Запустить предпросмотр анимации
         */
        this.launchGraphPreview = () => {
            var graphic = this.graphic;
            if (this.prevTime) {
                window.clearTimeout(this.prevTime);
            }
            this.prevPos = 0;
            this.stepGraphPreview();
        };
        /**
         * Шаг анимации в предпросмотре. Выполняет рендер. Записывает таймер следующего шага в this.prevTime
         */
        this.stepGraphPreview = () => {
            var graphic = this.graphic;
            this.prevTime = window.setTimeout(() => {
                var total = Math.min(graphic.untill === 0 ? Infinity : graphic.untill, graphic.grid[0] * graphic.grid[1]);
                this.prevPos++;
                if (this.prevPos >= total) {
                    this.prevPos = 0;
                }
                this.refs.graphviewframe.innerHTML = `${this.prevPos} / ${total}`;
                this.refreshPreviewCanvas();
                this.stepGraphPreview();
            }, ~~(1000 / this.prevSpeed));
        };

        /**
         * Переключает тип маски на круг и выставляет начальные параметры
         */
        this.graphicSelectCircle = function() {
            this.graphic.shape = 'circle';
            if (!('r' in this.graphic) || this.graphic.r === 0) {
                this.graphic.r = Math.min(
                    Math.floor(this.graphic.width / 2),
                    Math.floor(this.graphic.height / 2)
                );
            }
        };
        /**
         * Переключает тип маски на прямоугольник и выставляет начальные параметры
         */
        this.graphicSelectRect = function() {
            this.graphic.shape = 'rect';
            this.graphicFillRect();
        };
        /**
         * Перерисовывает канвас со спрайтом со всеми масками и делениями
         */
        this.refreshGraphCanvas = () => {
            graphCanvas.width = graphCanvas.img.width;
            graphCanvas.height = graphCanvas.img.height;
            graphCanvas.x.strokeStyle = "#0ff";
            graphCanvas.x.lineWidth = 1;
            graphCanvas.x.globalCompositeOperation = 'source-over';
            graphCanvas.x.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
            graphCanvas.x.drawImage(graphCanvas.img, 0, 0);
            graphCanvas.x.globalAlpha = 0.5;
            for (let i = 0, l = Math.min(this.graphic.grid[0] * this.graphic.grid[1], this.graphic.untill || Infinity); i < l; i++) {
                let xx = i % this.graphic.grid[0],
                    yy = Math.floor(i / this.graphic.grid[0]),
                    x = this.graphic.offx + xx * (this.graphic.marginx + this.graphic.width),
                    y = this.graphic.offy + yy * (this.graphic.marginy + this.graphic.height),
                    w = this.graphic.width,
                    h = this.graphic.height;
                graphCanvas.x.strokeRect(x, y, w, h);
            }
            if (this.prevShowMask) {
                graphCanvas.x.fillStyle = '#ff0';
                if (this.graphic.shape == 'rect') {
                    graphCanvas.x.fillRect(
                        this.graphic.axis[0] - this.graphic.left,
                        this.graphic.axis[1] - this.graphic.top,
                        this.graphic.right + this.graphic.left,
                        this.graphic.bottom + this.graphic.top
                    );
                } else {
                    graphCanvas.x.beginPath();
                    graphCanvas.x.arc(this.graphic.axis[0], this.graphic.axis[1], this.graphic.r, 0, 2 * Math.PI);
                    graphCanvas.x.fill();
                }
                graphCanvas.x.globalAlpha = 1;
                graphCanvas.x.fillStyle = '#f33';
                graphCanvas.x.beginPath();
                graphCanvas.x.arc(this.graphic.axis[0], this.graphic.axis[1], 3, 0, 2 * Math.PI);
                graphCanvas.x.fill();
            }
        };
        
        /**
         * Событие сохранения графики
         */
        this.graphicSave = () => {
            this.parent.fillGraphMap();
            window.glob.modified = true;
            this.graphic.lastmod = +(new Date());
            this.graphGenPreview(sessionStorage.projdir + '/img/' + this.graphic.origname + '_prev@2.png', 128);
            this.graphGenPreview(sessionStorage.projdir + '/img/' + this.graphic.origname + '_prev.png', 64)
            .then(() => {
                this.parent.editing = false;
                this.parent.update();
            });
        };
        
        /**
         * Генерирует превьюху первого кадра графики
         * @returns {Promise} Промис
         */
        this.graphGenPreview = function(destination, size) {
            return new Promise((accept, decline) => {
                // destination = sessionStorage.projdir + '/img/' + this.graphic.destinatione + '_prev.png'
                var c = document.createElement('canvas');
                let x = this.graphic.offx,
                    y = this.graphic.offy,
                    w = this.graphic.width,
                    h = this.graphic.height;
                c.x = c.getContext('2d');
                c.width = c.height = size;
                c.x.clearRect(0, 0, size, size);
                if (w > h) {
                    k = size / w;
                } else {
                    k = size / h;
                }
                if (k > 1) k = 1;
                c.x.drawImage(graphCanvas.img,
                    x, y, w, h,
                    (size - w*k) / 2, (size - h*k) / 2,
                    w*k, h*k
                );
                var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, '');
                var buf = new Buffer(data, 'base64');
                fs.writeFile(destination, buf, function(err) {
                    if (err) {
                        console.log(err);
                        decline(err);
                    } else {
                        accept(destination);
                    }
                });
            });
        };

        this.changeGraphicPreviewColor = e => {
            this.changingGraphicPreviewColor = !this.changingGraphicPreviewColor;
            if (this.changingGraphicPreviewColor) {
                this.oldPreviewColor = this.previewColor;
            }
        };
        this.updatePreviewColor = (color, evtype) => {
            this.previewColor = color;
            if (evtype === 'onapply') {
                this.changingGraphicPreviewColor = false;
            }
            this.update();
        };
        this.cancelPreviewColor = () => {
            this.changingGraphicPreviewColor = false;
            this.previewColor = this.oldPreviewColor;
            this.update();
        };
