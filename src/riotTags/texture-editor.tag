texture-editor.panel.view
    .flexrow.tall
        .column.borderright.tall.column1.flexfix.nogrow.noshrink
            .flexfix-body
                fieldset
                    b {voc.name}
                    br
                    input.wide(type="text" value="{opts.texture.name}" onchange="{wire('this.texture.name')}")
                    .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nametaken}
                    label.checkbox
                        input#texturetiled(type="checkbox" checked="{opts.texture.tiled}" onchange="{wire('this.texture.tiled')}")
                        span   {voc.tiled}
                fieldset
                    b {voc.center}
                    .flexrow
                        input.short(type="number" value="{opts.texture.axis[0]}" onchange="{wire('this.texture.axis.0')}" oninput="{wire('this.texture.axis.0')}")
                        span.center ×
                        input.short(type="number" value="{opts.texture.axis[1]}" onchange="{wire('this.texture.axis.1')}" oninput="{wire('this.texture.axis.1')}")
                    .flexrow
                        button.wide.nml(onclick="{textureCenter}")
                            span   {voc.setcenter}
                        .spacer
                        button.square.nmr(onclick="{textureIsometrify}" title="{voc.isometrify}")
                            svg.feather
                                use(xlink:href="data/icons.svg#map-pin")
                fieldset
                    b {voc.form}
                    label.checkbox
                        input(type="radio" name="collisionform" checked="{opts.texture.shape === 'circle'}" onclick="{textureSelectCircle}")
                        span {voc.round}
                    label.checkbox
                        input(type="radio" name="collisionform" checked="{opts.texture.shape === 'rect'}" onclick="{textureSelectRect}")
                        span {voc.rectangle}
                    label.checkbox
                        input(type="radio" name="collisionform" checked="{opts.texture.shape === 'strip'}" onclick="{textureSelectStrip}")
                        span {voc.strip}
                fieldset(if="{opts.texture.shape === 'circle'}")
                    b {voc.radius}
                    br
                    input.wide(type="number" value="{opts.texture.r}" onchange="{wire('this.texture.r')}" oninput="{wire('this.texture.r')}")
                fieldset(if="{opts.texture.shape === 'rect'}")
                    .center
                        input.short(type="number" value="{opts.texture.top}" onchange="{wire('this.texture.top')}" oninput="{wire('this.texture.top')}")
                        br
                        input.short(type="number" value="{opts.texture.left}" onchange="{wire('this.texture.left')}" oninput="{wire('this.texture.left')}")
                        span   ×
                        input.short(type="number" value="{opts.texture.right}" onchange="{wire('this.texture.right')}" oninput="{wire('this.texture.right')}")
                        br
                        input.short(type="number" value="{opts.texture.bottom}" onchange="{wire('this.texture.bottom')}" oninput="{wire('this.texture.bottom')}")
                    button.wide(onclick="{textureFillRect}")
                        svg.feather
                            use(xlink:href="data/icons.svg#maximize")
                        span {voc.fill}
                fieldset(if="{opts.texture.shape === 'strip'}")
                    .flexrow.aStripPointRow(each="{point, ind in getMovableStripPoints()}")
                        input.short(type="number" value="{point.x}" oninput="{wire('this.texture.stripPoints.'+ ind + '.x')}")
                        span   ×
                        input.short(type="number" value="{point.y}" oninput="{wire('this.texture.stripPoints.'+ ind + '.y')}")
                        button.square.inline(title="{voc.removePoint}" onclick="{removeStripPoint}")
                            svg.feather
                                use(xlink:href="data/icons.svg#minus")
                    label.checkbox
                        input(type="checkbox" checked="{opts.texture.closedStrip}" onchange="{onClosedStripChange}" )
                        span   {voc.closeShape}
                    label.checkbox
                        input(type="checkbox" checked="{opts.texture.symmetryStrip}" onchange="{onSymmetryChange}")
                        span   {voc.symmetryTool}
                    button.wide(onclick="{addStripPoint}")
                        svg.feather
                            use(xlink:href="data/icons.svg#plus")
                        span   {voc.addPoint}
                fieldset
                    label.checkbox
                        input(checked="{prevShowMask}" onchange="{wire('this.prevShowMask')}" type="checkbox")
                        span   {voc.showmask}
            .flexfix-footer
                button.wide(onclick="{textureSave}" title="Shift+Control+S" data-hotkey="Control+S")
                    svg.feather
                        use(xlink:href="data/icons.svg#save")
                    span {window.languageJSON.common.save}
        .texture-editor-anAtlas.tall(
            if="{opts.texture}"
            style="background-color: {previewColor};"
            onmousewheel="{onMouseWheel}"
        )
            .texture-editor-aCanvasWrap
                canvas.texture-editor-aCanvas(ref="textureCanvas" style="transform: scale({zoomFactor}); image-rendering: {zoomFactor > 1? 'pixelated' : '-webkit-optimize-contrast'}; transform-origin: 0% 0%;")
                // This div is needed to cause elements' reflow so the scrollbars update on canvas' size change
                div(style="width: {zoomFactor}px; height: {zoomFactor}px;")
                .aClicker(
                    if="{prevShowMask && opts.texture.shape === 'strip'}"
                    each="{seg, ind in getStripSegments()}"
                    style="left: {seg.left}px; top: {seg.top}px; width: {seg.width}px; transform: translate(0, -50%) rotate({seg.angle}deg);"
                    title="{voc.addPoint}"
                    onclick="{addStripPointOnSegment}"
                )
                .aDragger(
                    if="{prevShowMask}"
                    style="left: {opts.texture.axis[0] * zoomFactor}px; top: {opts.texture.axis[1] * zoomFactor}px; border-radius: 0;"
                    title="{voc.moveCenter}"
                    onmousedown="{startMoving('axis')}"
                )
                .aDragger(
                    if="{prevShowMask && opts.texture.shape === 'strip'}"
                    each="{point, ind in getMovableStripPoints()}"
                    style="left: {(point.x + texture.axis[0]) * zoomFactor}px; top: {(point.y + texture.axis[1]) * zoomFactor}px;"
                    title="{voc.movePoint}"
                    onmousedown="{startMoving('point')}"
                )
            .textureview-tools
                .toright
                    label.file(title="{voc.replacetexture}")
                        input(type="file" ref="textureReplacer" accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{textureReplace}")
                        .button.inline
                            svg.feather
                                use(xlink:href="data/icons.svg#folder")
                            span {voc.replacetexture}
                    .button.inline(title="{voc.reimport}" if="{opts.texture.source}" onclick="{reimport}")
                        svg.feather
                            use(xlink:href="data/icons.svg#refresh-ccw")
            .textureview-zoom
                div.button-stack.inlineblock
                    button#texturezoom25.inline(onclick="{textureToggleZoom(0.25)}" class="{active: zoomFactor === 0.25}") 25%
                    button#texturezoom50.inline(onclick="{textureToggleZoom(0.5)}" class="{active: zoomFactor === 0.5}") 50%
                    button#texturezoom100.inline(onclick="{textureToggleZoom(1)}" class="{active: zoomFactor === 1}") 100%
                    button#texturezoom200.inline(onclick="{textureToggleZoom(2)}" class="{active: zoomFactor === 2}") 200%
                    button#texturezoom400.inline(onclick="{textureToggleZoom(4)}" class="{active: zoomFactor === 4}") 400%
        .column.column2.borderleft.tall.flexfix.nogrow.noshrink(show="{!opts.texture.tiled}")
            .flexfix-body
                fieldset
                    .flexrow
                        div
                            b {voc.cols}
                            br
                            input.wide(type="number" value="{opts.texture.grid[0]}" onchange="{wire('this.texture.grid.0')}" oninput="{wire('this.texture.grid.0')}")
                        span &nbsp;
                        div
                            b {voc.rows}
                            br
                            input.wide(type="number" value="{opts.texture.grid[1]}" onchange="{wire('this.texture.grid.1')}" oninput="{wire('this.texture.grid.1')}")
                    .flexrow
                        div
                            b {voc.width}
                            br
                            input.wide(type="number" value="{opts.texture.width}" onchange="{wire('this.texture.width')}" oninput="{wire('this.texture.width')}")
                        span &nbsp;
                        div
                            b {voc.height}
                            br
                            input.wide(type="number" value="{opts.texture.height}" onchange="{wire('this.texture.height')}" oninput="{wire('this.texture.height')}")
                    .flexrow
                        div
                            b {voc.marginx}
                            br
                            input.wide(type="number" value="{opts.texture.marginx}" onchange="{wire('this.texture.marginx')}" oninput="{wire('this.texture.marginx')}")
                        span &nbsp;
                        div
                            b {voc.marginy}
                            br
                            input.wide(type="number" value="{opts.texture.marginy}" onchange="{wire('this.texture.marginy')}" oninput="{wire('this.texture.marginy')}")
                    .flexrow
                        div
                            b {voc.offx}
                            br
                            input.wide(type="number" value="{opts.texture.offx}" onchange="{wire('this.texture.offx')}" oninput="{wire('this.texture.offx')}")
                        span &nbsp;
                        div
                            b {voc.offy}
                            br
                            input.wide(type="number" value="{opts.texture.offy}" onchange="{wire('this.texture.offy')}" oninput="{wire('this.texture.offy')}")
                fieldset
                    b {voc.frames}
                    br
                    input#textureframes.wide(type="number" value="{opts.texture.untill}" onchange="{wire('this.texture.untill')}" oninput="{wire('this.texture.untill')}")
                fieldset
                    b
                        span {voc.padding}
                        hover-hint(text="{voc.paddingNotice}")
                    br
                    input.wide(type="number" min="0" max="128" step="1" value="{opts.texture.padding}" onchange="{wire('this.texture.padding')}")
            .preview.bordertop.flexfix-footer
                #preview(ref="preview" style="background-color: {previewColor};")
                    canvas(ref="grprCanvas")
                .flexrow
                    button#textureplay.square.inline(onclick="{currentTexturePreviewPlay}")
                        svg.feather
                            use(xlink:href="data/icons.svg#{prevPlaying? 'pause' : 'play'}")
                    span(ref="textureviewframe") 0 / 1
                    .filler
                    button#textureviewback.square.inline(onclick="{currentTexturePreviewBack}")
                        svg.feather
                            use(xlink:href="data/icons.svg#skip-back")
                    button#textureviewnext.square.inline.nmr(onclick="{currentTexturePreviewNext}")
                        svg.feather
                            use(xlink:href="data/icons.svg#skip-forward")
                .flexrow
                    b {voc.speed}
                    .filler
                    input#grahpspeed.short(type="number" min="1" value="{prevSpeed}" onchange="{wire('this.prevSpeed')}" oninput="{wire('this.prevSpeed')}")
                .relative
                    button#texturecolor.inline.wide(onclick="{changeTexturePreviewColor}")
                        svg.feather
                            use(xlink:href="data/icons.svg#droplet")
                        span {voc.bgcolor}
                input.color.rgb#previewbgcolor

    color-picker(
        ref="previewBackgroundColor" if="{changingTexturePreviewColor}"
        hidealpha="true"
        color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"
    )
    script.
        const path = require('path'),
              fs = require('fs-extra');
        const glob = require('./data/node_requires/glob');
        this.namespace = 'textureview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.nameTaken = false;
        this.prevPlaying = true;
        this.prevPos = 0;
        this.prevSpeed = 10;
        this.prevShowMask = true;
        this.previewColor = localStorage.UItheme === 'Day'? '#ffffff' : '#08080D';
        this.zoomFactor = 1;

        var textureCanvas, grprCanvas;

        this.on('mount', () => {
            textureCanvas = this.refs.textureCanvas;
            grprCanvas = this.refs.grprCanvas;
            textureCanvas.x = textureCanvas.getContext('2d');
            grprCanvas.x = grprCanvas.getContext('2d');
            var texture = this.texture = this.opts.texture;
            var img = document.createElement('img');
            img.onload = () => {
                textureCanvas.img = img;
                this.update();
                setTimeout(() => {
                    this.launchTexturePreview();
                }, 0);
            };
            img.onerror = e => {
                alertify.error(languageJSON.textureview.corrupted);
                console.error(e);
                this.textureSave();
            };
            img.src = path.join('file://', global.projdir, '/img/', texture.origname) + '?' + Math.random();
        });
        this.on('update', () => {
            if (global.currentProject.textures.find(texture =>
                this.texture.name === texture.name && this.texture !== texture
            )) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
            this.updateSymmetricalPoints();
        });
        this.on('updated', () => {
            this.refreshTextureCanvas();
        });
        this.on('unmount', () => {
            if (this.prevPlaying) { // вырубаем анимацию превью, если редактор был закрыт
                this.stopTexturePreview();
            }
        });

        this.textureReplace = e => {
            const val = this.refs.textureReplacer.files[0].path;
            if (/\.(jpg|gif|png|jpeg)/gi.test(val)) {
                this.loadImg(
                    this.texture.uid,
                    val,
                    global.projdir + '/img/i' + this.texture.uid + path.extname(val)
                );
                this.texture.source = val;
            } else {
                alertify.error(window.languageJSON.common.wrongFormat);
                console.log(val, 'NOT passed');
            }
            this.refs.textureReplacer.value = '';
        };
        this.reimport = e => {
            this.loadImg(
                this.texture.uid,
                this.texture.source,
                global.projdir + '/img/i' + this.texture.uid + path.extname(this.texture.source)
            );
        }

        /**
         * Загружает изображение в редактор и генерирует квадратную превьюху из исходного изображения
         * @param {Number} uid Идентификатор изображения
         * @param {String} filename Путь к исходному изображению
         * @param {Sting} dest Путь к изображению в папке проекта
         */
        this.loadImg = (uid, filename, dest) => {
            fs.copy(filename, dest, e => {
                if (e) throw e;
                image = document.createElement('img');
                image.onload = () => {
                    this.texture.imgWidth = image.width;
                    this.texture.imgHeight = image.height;
                    if (this.texture.tiled || (
                        this.texture.grid[0] === 1 &&
                        this.texture.grid[1] === 1 &&
                        this.texture.offx === 0 &&
                        this.texture.offy === 0
                    )) {
                        this.texture.width = this.texture.imgWidth;
                        this.texture.height = this.texture.imgHeight;
                    }
                    this.texture.origname = path.basename(dest);
                    textureCanvas.img = image;
                    this.texture.lastmod = +(new Date());

                    const {imgGenPreview} = require('./data/node_requires/resources/textures');
                    imgGenPreview(dest, dest + '_prev.png', 64, () => {
                        this.update();
                    });
                    imgGenPreview(dest, dest + '_prev@2.png', 128, () => {});
                    setTimeout(() => {
                        this.refreshTextureCanvas();
                        this.parent.fillTextureMap();
                        this.launchTexturePreview();
                    }, 0);
                };
                image.onerror = e => {
                    alertify.error(e);
                };
                image.src = 'file://' + dest + '?' + Math.random();
            });
        };

        this.textureToggleZoom = zoom => e => {
            this.zoomFactor = zoom;
        };
        /** Change zoomFactor on mouse wheel roll */
        this.onMouseWheel = e => {
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
                }
            }
            e.preventDefault();
            this.update();
        };

        /**
         * Установить ось вращения на центр изображения
         */
        this.textureCenter = e => {
            var texture = this.texture;
            texture.axis[0] = Math.floor(texture.width / 2);
            texture.axis[1] = Math.floor(texture.height / 2);
        };
        /**
         * Заполнить всё изображение маской-квадратом
         */
        this.textureFillRect = e => {
            var texture = this.texture;
            texture.left = ~~(texture.axis[0]);
            texture.top = ~~(texture.axis[1]);
            texture.right = ~~(texture.width - texture.axis[0]);
            texture.bottom = ~~(texture.height - texture.axis[1]);
        };
        this.textureIsometrify = e => {
            var texture = this.texture;
            texture.axis[0] = Math.floor(texture.width / 2);
            texture.axis[1] = texture.height;
            this.textureFillRect();
        };
        /**
         * Запустить предпросмотр анимации
         */
        this.currentTexturePreviewPlay = e => {
            if (this.prevPlaying) {
                this.stopTexturePreview();
            } else {
                this.launchTexturePreview();
            }
            this.prevPlaying = !this.prevPlaying;
        };
        /**
         * Отступить на шаг назад в предпросмотре анимации
         */
        this.currentTexturePreviewBack = e => {
            this.prevPos--;
            var texture = this.texture;
            var total = texture.untill === 0? texture.grid[0] * texture.grid[1] : Math.min(texture.grid[0] * texture.grid[1], texture.untill);
            if (this.prevPos < 0) {
                this.prevPos = texture.untill === 0 ? texture.grid[0] * texture.grid[1] : total - 0;
            }
            this.refreshPreviewCanvas();
        };
        /**
         * Шагнуть на кадр вперёд в предпросмотре анимации
         */
        this.currentTexturePreviewNext = e => {
            this.prevPos++;
            var texture = this.texture;
            var total = texture.untill === 0? texture.grid[0] * texture.grid[1] : Math.min(texture.grid[0] * texture.grid[1], texture.untill);
            if (this.prevPos >= total) {
                this.prevPos = 0;
            }
            this.refreshPreviewCanvas();
        };
        this.refreshPreviewCanvas = () => {
            let xx = this.prevPos % this.texture.grid[0],
                yy = Math.floor(this.prevPos / this.texture.grid[0]),
                x = this.texture.offx + xx * (this.texture.marginx + this.texture.width),
                y = this.texture.offy + yy * (this.texture.marginy + this.texture.height),
                w = this.texture.width,
                h = this.texture.height;
            grprCanvas.width = w;
            grprCanvas.height = h;

            grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
            grprCanvas.x.drawImage(
                textureCanvas.img,
                x, y, w, h,
                0, 0, w, h
            );
            // shape
            if (this.prevShowMask) {
                grprCanvas.x.globalAlpha = 0.5;
                grprCanvas.x.fillStyle = '#ff0';
                if (this.texture.shape == 'rect') {
                    grprCanvas.x.fillRect(
                        this.texture.axis[0] - this.texture.left,
                        this.texture.axis[1] - this.texture.top,
                        this.texture.right + this.texture.left,
                        this.texture.bottom + this.texture.top
                    );
                } else if (this.texture.shape === 'circle') {
                    grprCanvas.x.beginPath();
                    grprCanvas.x.arc(this.texture.axis[0], this.texture.axis[1], this.texture.r, 0, 2 * Math.PI);
                    grprCanvas.x.fill();
                } else if (this.texture.shape === 'strip' && this.texture.stripPoints.length) {
                    grprCanvas.x.strokeStyle = '#ff0';
                    grprCanvas.x.lineWidth = 3;
                    grprCanvas.x.beginPath();
                    grprCanvas.x.moveTo(this.texture.stripPoints[0].x + this.texture.axis[0], this.texture.stripPoints[0].y + this.texture.axis[1]);
                    for (let i = 1, l = this.texture.stripPoints.length; i < l; i++) {
                        grprCanvas.x.lineTo(this.texture.stripPoints[i].x + this.texture.axis[0], this.texture.stripPoints[i].y + this.texture.axis[1]);
                    }
                    if (this.texture.closedStrip) {
                        grprCanvas.x.closePath();
                    }
                    grprCanvas.x.stroke();
                }
                grprCanvas.x.globalAlpha = 1;
                grprCanvas.x.fillStyle = '#f33';
                grprCanvas.x.beginPath();
                grprCanvas.x.arc(this.texture.axis[0], this.texture.axis[1], 3, 0, 2 * Math.PI);
                grprCanvas.x.fill();
            }
        };
        /**
         * Stops the animated preview
         */
        this.stopTexturePreview = () => {
            window.clearTimeout(this.prevTime);
        };
        /**
         * Starts the preview of a framed animation
         */
        this.launchTexturePreview = () => {
            var texture = this.texture;
            if (this.prevTime) {
                window.clearTimeout(this.prevTime);
            }
            this.prevPos = 0;
            this.stepTexturePreview();
        };
        /**
         * Шаг анимации в предпросмотре. Выполняет рендер. Записывает таймер следующего шага в this.prevTime
         */
        this.stepTexturePreview = () => {
            var texture = this.texture;
            this.prevTime = window.setTimeout(() => {
                var total = Math.min(texture.untill === 0 ? Infinity : texture.untill, texture.grid[0] * texture.grid[1]);
                this.prevPos++;
                if (this.prevPos >= total) {
                    this.prevPos = 0;
                }
                this.refs.textureviewframe.innerHTML = `${this.prevPos} / ${total}`;
                if (!this.texture.tiled) {
                    this.refreshPreviewCanvas();
                }
                this.stepTexturePreview();
            }, ~~(1000 / this.prevSpeed));
        };

        /**
         * Переключает тип маски на круг и выставляет начальные параметры
         */
        this.textureSelectCircle = function() {
            this.texture.shape = 'circle';
            if (!('r' in this.texture) || this.texture.r === 0) {
                this.texture.r = Math.min(
                    Math.floor(this.texture.width / 2),
                    Math.floor(this.texture.height / 2)
                );
            }
        };
        /**
         * Переключает тип маски на прямоугольник и выставляет начальные параметры
         */
        this.textureSelectRect = function() {
            this.texture.shape = 'rect';
            this.textureFillRect();
        };
        /**
         * Переключает тип маски на ломаную/многоугольник и выставляет начальные параметры
         */
        this.textureSelectStrip = function () {
            this.texture.shape = 'strip';
            this.texture.stripPoints = this.texture.stripPoints || [];
            if (!this.texture.stripPoints.length) {
                const twoPi = Math.PI * 2;
                this.texture.closedStrip = true;
                for (let i = 0; i < 5; i++) {
                    this.texture.stripPoints.push({
                        x: Math.round(Math.sin(twoPi / 5 * i) * this.texture.width / 2),
                        y: -Math.round(Math.cos(twoPi / 5 * i) * this.texture.height / 2)
                    });
                }
            }
        };
        this.removeStripPoint = function (e) {
            if(this.texture.symmetryStrip) {
                // Remove an extra point
                this.texture.stripPoints.pop();
            }
            this.texture.stripPoints.splice(e.item.ind, 1);
        };
        this.addStripPoint = function () {
            this.texture.stripPoints.push({
                x: 0,
                y: 16
            });
        };
        this.addStripPointOnSegment = e => {
            const { top, left } = textureCanvas.getBoundingClientRect();
            this.texture.stripPoints.splice(e.item.ind+1, 0, {
                x: (e.pageX - left) / this.zoomFactor - this.texture.axis[0],
                y: (e.pageY - top) / this.zoomFactor - this.texture.axis[1]
            });
            if(this.texture.symmetryStrip) {
                // Add an extra point (the symetrical point)
                this.addStripPoint();
            }
        };
        this.pointToLine = (linePoint1, linePoint2, point) => {
            const dlx = linePoint2.x - linePoint1.x;
            const dly = linePoint2.y - linePoint1.y;
            const lineLength = Math.sqrt(dlx*dlx + dly*dly);
            const lineAngle = Math.atan2(dly, dlx);

            const dpx = point.x - linePoint1.x;
            const dpy = point.y - linePoint1.y;
            const toPointLength = Math.sqrt(dpx*dpx + dpy*dpy);
            const toPointAngle = Math.atan2(dpy, dpx);

            const distance = toPointLength * Math.cos(toPointAngle - lineAngle);

            return {
                x: linePoint1.x + distance * dlx / lineLength,
                y: linePoint1.y + distance * dly / lineLength
            };
        };
        this.onClosedStripChange = e => {
            this.texture.closedStrip = !this.texture.closedStrip;
            if(!this.texture.closedStrip && this.texture.symmetryStrip) {
                this.onSymmetryChange();
            }
        };
        this.onSymmetryChange = e => {
            if(this.texture.symmetryStrip) {
                this.texture.stripPoints = this.getMovableStripPoints();
            } else {
                const nbPointsToAdd = this.texture.stripPoints.length - 2;
                for(let i = 0; i < nbPointsToAdd; i++) {
                    this.addStripPoint();
                }
                this.texture.closedStrip = true; // Force closedStrip to true
            }

            this.texture.symmetryStrip = !this.texture.symmetryStrip;
            this.update();
        }
        this.startMoving = which => e => {
            const startX = e.screenX,
                  startY = e.screenY;
            if (which === 'axis') {
                const oldX = this.texture.axis[0],
                      oldY = this.texture.axis[1];
                const func = e => {
                    this.texture.axis[0] = (e.screenX - startX) / this.zoomFactor + oldX;
                    this.texture.axis[1] = (e.screenY - startY) / this.zoomFactor + oldY;
                    this.update();
                }, func2 = () => {
                    document.removeEventListener('mousemove', func);
                    document.removeEventListener('mouseup', func2);
                };
                document.addEventListener('mousemove', func);
                document.addEventListener('mouseup', func2);
            } else if (which === 'point') {
                const point = e.item.point,
                      oldX = point.x,
                      oldY = point.y;
                let hasMoved = false;
                const func = e => {
                    if(!hasMoved && (e.screenX !== startX || e.screenY !== startY)) {
                        hasMoved = true;
                    }
                    point.x = (e.screenX - startX) / this.zoomFactor + oldX;
                    point.y = (e.screenY - startY) / this.zoomFactor + oldY;
                    this.update();
                }, func2 = () => {
                    if(!hasMoved) {
                        this.removeStripPoint(e);
                        this.update();
                    }
                    document.removeEventListener('mousemove', func);
                    document.removeEventListener('mouseup', func2);
                };
                document.addEventListener('mousemove', func);
                document.addEventListener('mouseup', func2);
            }
        };
        /**
         * Redraws the canvas with the full image, its collision mask, and its slicing grid
         */
        this.refreshTextureCanvas = () => {
            textureCanvas.width = textureCanvas.img.width;
            textureCanvas.height = textureCanvas.img.height;
            textureCanvas.x.strokeStyle = "#0ff";
            textureCanvas.x.lineWidth = 1;
            textureCanvas.x.globalCompositeOperation = 'source-over';
            textureCanvas.x.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
            textureCanvas.x.drawImage(textureCanvas.img, 0, 0);
            textureCanvas.x.globalAlpha = 0.5;
            if (!this.texture.tiled) {
                for (let i = 0, l = Math.min(this.texture.grid[0] * this.texture.grid[1], this.texture.untill || Infinity); i < l; i++) {
                    let xx = i % this.texture.grid[0],
                        yy = Math.floor(i / this.texture.grid[0]),
                        x = this.texture.offx + xx * (this.texture.marginx + this.texture.width),
                        y = this.texture.offy + yy * (this.texture.marginy + this.texture.height),
                        w = this.texture.width,
                        h = this.texture.height;
                    textureCanvas.x.strokeRect(x, y, w, h);
                }
            }
            if (this.prevShowMask) {
                textureCanvas.x.fillStyle = '#ff0';
                if (this.texture.shape === 'rect') {
                    textureCanvas.x.fillRect(
                        this.texture.axis[0] - this.texture.left,
                        this.texture.axis[1] - this.texture.top,
                        this.texture.right + this.texture.left,
                        this.texture.bottom + this.texture.top
                    );
                } else if (this.texture.shape === 'circle') {
                    textureCanvas.x.beginPath();
                    textureCanvas.x.arc(this.texture.axis[0], this.texture.axis[1], this.texture.r, 0, 2 * Math.PI);
                    textureCanvas.x.fill();
                } else if (this.texture.shape === 'strip' && this.texture.stripPoints.length) {
                    textureCanvas.x.strokeStyle = '#ff0';
                    textureCanvas.x.lineWidth = 3;
                    textureCanvas.x.beginPath();
                    textureCanvas.x.moveTo(this.texture.stripPoints[0].x + this.texture.axis[0], this.texture.stripPoints[0].y + this.texture.axis[1]);
                    for (let i = 1, l = this.texture.stripPoints.length; i < l; i++) {
                        textureCanvas.x.lineTo(this.texture.stripPoints[i].x + this.texture.axis[0], this.texture.stripPoints[i].y + this.texture.axis[1]);
                    }
                    if (this.texture.closedStrip) {
                        textureCanvas.x.closePath();
                    }
                    textureCanvas.x.stroke();

                    if(this.texture.symmetryStrip) {
                        const movablePoints = this.getMovableStripPoints();
                        const axisPoint1 = movablePoints[0];
                        const axisPoint2 = movablePoints[movablePoints.length - 1];

                        // Draw symmetry axis
                        textureCanvas.x.strokeStyle = '#f00';
                        textureCanvas.x.lineWidth = 3;
                        textureCanvas.x.beginPath();
                        textureCanvas.x.moveTo(axisPoint1.x + this.texture.axis[0], axisPoint1.y + this.texture.axis[1]);
                        textureCanvas.x.lineTo(axisPoint2.x + this.texture.axis[0], axisPoint2.y + this.texture.axis[1]);
                        textureCanvas.x.stroke();
                    }
                }
            }
        };

        /**
         * Событие сохранения графики
         */
        this.textureSave = () => {
            if (this.nameTaken) {
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                soundbox.play('Failure');
                return false;
            }
            this.parent.fillTextureMap();
            glob.modified = true;
            this.texture.lastmod = +(new Date());
            this.textureGenPreview(global.projdir + '/img/' + this.texture.origname + '_prev@2.png', 128);
            this.textureGenPreview(global.projdir + '/img/' + this.texture.origname + '_prev.png', 64)
            .then(() => {
                this.parent.editing = false;
                this.parent.update();
            });
        };

        /**
         * Генерирует превьюху первого кадра графики
         * @returns {Promise} Промис
         */
        this.textureGenPreview = function(destination, size) {
            return new Promise((accept, decline) => {
                var c = document.createElement('canvas');
                let x = this.texture.offx,
                    y = this.texture.offy,
                    w = this.texture.width,
                    h = this.texture.height;
                c.x = c.getContext('2d');
                c.width = c.height = size;
                c.x.clearRect(0, 0, size, size);
                if (w > h) {
                    k = size / w;
                } else {
                    k = size / h;
                }
                if (k > 1) k = 1;
                c.x.drawImage(textureCanvas.img,
                    x, y, w, h,
                    (size - w*k) / 2, (size - h*k) / 2,
                    w*k, h*k
                );
                var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, '');
                var buf = Buffer.from(data, 'base64');
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

        this.changeTexturePreviewColor = e => {
            this.changingTexturePreviewColor = !this.changingTexturePreviewColor;
            if (this.changingTexturePreviewColor) {
                this.oldPreviewColor = this.previewColor;
            }
        };
        this.updatePreviewColor = (color, evtype) => {
            this.previewColor = color;
            if (evtype === 'onapply') {
                this.changingTexturePreviewColor = false;
            }
            this.update();
        };
        this.cancelPreviewColor = () => {
            this.changingTexturePreviewColor = false;
            this.previewColor = this.oldPreviewColor;
            this.update();
        };
        this.getMovableStripPoints = () => {
            if(!this.texture) return;
            if(!this.texture.symmetryStrip) {
                return this.texture.stripPoints;
            } else {
                return this.texture.stripPoints.slice(0, 2 + Math.round((this.texture.stripPoints.length - 2) / 2));
            }
        };
        this.getStripSegments = () => {
            if(!this.texture) {
                return;
            }
            if (this.texture.shape !== 'strip') {
                return;
            }

            const points = this.getMovableStripPoints();
            const segs = [];

            for(let i = 0; i < points.length; i++) {
                const point1 = points[i];
                const point2 = points[(i + 1) % points.length];

                const x1 = (point1.x + this.texture.axis[0]) * this.zoomFactor;
                const y1 = (point1.y + this.texture.axis[1]) * this.zoomFactor;
                const x2 = (point2.x + this.texture.axis[0]) * this.zoomFactor;
                const y2 = (point2.y + this.texture.axis[1]) * this.zoomFactor;
                const dx = x2 - x1;
                const dy = y2 - y1;

                const length = Math.sqrt(dx*dx + dy*dy);
                const cssAngle = Math.atan2(dy, dx) * 180 / Math.PI;

                segs.push({
                    left: x1,
                    top: y1,
                    width: length,
                    angle: cssAngle
                });
            }

            return segs;
        };
        this.updateSymmetricalPoints = () => {
            if(this.texture && this.texture.symmetryStrip) {
                const movablePoints = this.getMovableStripPoints();
                const axisPoint1 = movablePoints[0];
                const axisPoint2 = movablePoints[movablePoints.length - 1];
                for(let i = 1; i < movablePoints.length - 1; i++) {
                    const j = this.texture.stripPoints.length - i;
                    const point = movablePoints[i];
                    const axisPoint = this.pointToLine(axisPoint1, axisPoint2, point);
                    this.texture.stripPoints[j] = {
                        x: 2 * axisPoint.x - point.x,
                        y: 2 * axisPoint.y - point.y
                    }
                }
            }
        };

