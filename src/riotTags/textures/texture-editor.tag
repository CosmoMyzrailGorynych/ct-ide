//
    A texture editor with all its tools. Also supports skeletons.

    @attribute asset (ITexture | ISkeleton)

    @attribute onclose (riot function)
        A callback that is called when a user wants to close this window.
    @attribute skeletonmode (atomic)
        Restricts editing functionality to be applicable to skeletal animation assets.
mixin collisionSettings
    fieldset
        .toright
            button.tiny.nmt(if="{sessionStorage.copiedCollisionMask}" onclick="{pasteCollisionMask}" title="{voc.pasteCollisionMask}")
                svg.feather
                    use(xlink:href="#clipboard")
            button.tiny.nmt(onclick="{copyCollisionMask}" title="{voc.copyCollisionMask}")
                svg.feather
                    use(xlink:href="#copy")
        h3.nmt {voc.form}
        label.checkbox
            input(type="radio" name="collisionform" checked="{opts.asset.shape === 'circle'}" onclick="{textureSelectCircle}")
            span {voc.round}
        label.checkbox
            input(type="radio" name="collisionform" checked="{opts.asset.shape === 'rect'}" onclick="{textureSelectRect}")
            span {voc.rectangle}
        label.checkbox
            input(type="radio" name="collisionform" checked="{opts.asset.shape === 'strip'}" onclick="{textureSelectStrip}")
            span {voc.strip}
    fieldset(if="{opts.asset.shape === 'circle'}")
        b {voc.radius}
        br
        input.wide(type="number" value="{opts.asset.r}" onchange="{wire('this.opts.asset.r')}" oninput="{wire('this.opts.asset.r')}")
    fieldset(if="{opts.asset.shape === 'rect'}")
        .center.aDashedMaskMarker
            svg.feather.aDashedMaskMarker-anArrow.left
                use(xlink:href="#chevron-left")
            svg.feather.aDashedMaskMarker-anArrow.right
                use(xlink:href="#chevron-right")
            svg.feather.aDashedMaskMarker-anArrow.up
                use(xlink:href="#chevron-up")
            svg.feather.aDashedMaskMarker-anArrow.down
                use(xlink:href="#chevron-down")
            input.center.short(type="number" value="{opts.asset.top}" onchange="{wire('this.opts.asset.top')}" oninput="{wire('this.opts.asset.top')}")
            br
            input.center.short(type="number" value="{opts.asset.left}" onchange="{wire('this.opts.asset.left')}" oninput="{wire('this.opts.asset.left')}")
            |
            |
            span.aPivotSymbol
            |
            |
            input.center.short(type="number" value="{opts.asset.right}" onchange="{wire('this.opts.asset.right')}" oninput="{wire('this.opts.asset.right')}")
            br
            input.center.short(type="number" value="{opts.asset.bottom}" onchange="{wire('this.opts.asset.bottom')}" oninput="{wire('this.opts.asset.bottom')}")
        button.wide(onclick="{textureFillRect}")
            svg.feather
                use(xlink:href="#maximize")
            span {voc.fill}
    fieldset(if="{opts.asset.shape === 'strip'}")
        .flexrow.aStripPointRow(each="{point, ind in getMovableStripPoints()}")
            input.short(type="number" value="{point.x}" oninput="{wire('this.opts.asset.stripPoints.'+ ind + '.x')}")
            span.center   ×
            input.short(type="number" value="{point.y}" oninput="{wire('this.opts.asset.stripPoints.'+ ind + '.y')}")
            button.square.inline.nogrow(title="{voc.removePoint}" onclick="{removeStripPoint}")
                svg.feather
                    use(xlink:href="#minus")
        button.wide(onclick="{addStripPoint}")
            svg.feather
                use(xlink:href="#plus")
            span   {voc.addPoint}
    fieldset(if="{opts.asset.shape === 'strip'}")
        label.checkbox
            input(type="checkbox" checked="{opts.asset.closedStrip}" onchange="{onClosedStripChange}" )
            span   {voc.closeShape}
        label.checkbox
            input(type="checkbox" checked="{opts.asset.symmetryStrip}" onchange="{onSymmetryChange}")
            span   {voc.symmetryTool}

mixin textureSource
    .flexrow
        label.file(title="{voc.replaceTexture}")
            input(type="file" ref="textureReplacer" accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{textureReplace}")
            .button.inline.wide
                svg.feather
                    use(xlink:href="#folder")
                span {voc.replaceTexture}
        .aButtonGroup.nmr.nogrow
            button.inline.square(
                if="{opts.asset.source}"
                title="{voc.reimport} (Control+R)"
                onclick="{reimport}"
                data-hotkey="Control+r"
            )
                svg.feather
                    use(xlink:href="#refresh-ccw")
            button.inline.square(
                title="{voc.updateFromClipboard} (Control+V)"
                onclick="{paste}"
                data-hotkey="Control+v"
                data-hotkey-require-scope="texture"
                data-hotkey-priority="10"
            )
                svg.feather
                    use(xlink:href="#clipboard")

mixin sliceSettings
    h3 {voc.slicing}
    fieldset
        label.checkbox
            input#texturetiled(type="checkbox" checked="{opts.asset.tiled}" onchange="{wire('this.opts.asset.tiled')}")
            span   {voc.tiled}
    fieldset(if="{!opts.asset.tiled}")
        .flexrow
            div
                b {voc.cols}
                br
                input.wide(
                    type="number"
                    value="{texture.grid[0]}"
                    onchange="{wire('this.opts.asset.grid.0')}"
                    oninput="{wire('this.opts.asset.grid.0')}"
                    min="1"
                )
            span &nbsp;
            div
                b {voc.rows}
                br
                input.wide(
                    type="number"
                    value="{texture.grid[1]}"
                    onchange="{wire('this.opts.asset.grid.1')}"
                    oninput="{wire('this.opts.asset.grid.1')}"
                    min="1"
                )
        .flexrow
            div
                b {voc.width}
                br
                input.wide(
                    type="number"
                    value="{texture.width}"
                    onchange="{wire('this.opts.asset.width')}"
                    oninput="{wire('this.opts.asset.width')}"
                    min="1"
                )
            span &nbsp;
            div
                b {voc.height}
                br
                input.wide(
                    type="number"
                    value="{texture.height}"
                    onchange="{wire('this.opts.asset.height')}"
                    oninput="{wire('this.opts.asset.height')}"
                    min="1"
                )
    fieldset(if="{!opts.asset.tiled}")
        b {voc.frames}
        br
        input#textureframes.wide(
            type="number"
            value="{texture.untill}"
            onchange="{wire('this.opts.asset.untill')}"
            oninput="{wire('this.opts.asset.untill')}"
            min="0"
        )
    fieldset(if="{!opts.asset.tiled}")
        .flexrow
            div
                b {voc.marginX}
                br
                input.wide(
                    type="number"
                    value="{texture.marginx}"
                    onchange="{wire('this.opts.asset.marginx')}"
                    oninput="{wire('this.opts.asset.marginx')}"
                    min="0"
                )
            span &nbsp;
            div
                b {voc.marginY}
                br
                input.wide(
                    type="number"
                    value="{texture.marginy}"
                    onchange="{wire('this.opts.asset.marginy')}"
                    oninput="{wire('this.opts.asset.marginy')}"
                    min="0"
                )
        .flexrow
            div
                b {voc.offX}
                br
                input.wide(
                    type="number"
                    value="{texture.offx}"
                    onchange="{wire('this.opts.asset.offx')}"
                    oninput="{wire('this.opts.asset.offx')}"
                    min="0"
                )
            span &nbsp;
            div
                b {voc.offY}
                br
                input.wide(
                    type="number"
                    value="{texture.offy}"
                    onchange="{wire('this.opts.asset.offy')}"
                    oninput="{wire('this.opts.asset.offy')}"
                    min="0"
                )

mixin axisSettings
    h3.flexrow
        span.alignmiddle
            .aPivotSymbol.nml
            | {voc.center}
        hover-hint.toright.alignmiddle.nogrow(text="{voc.axisExplanation}")
    fieldset.flexrow
        input.short(type="number" value="{opts.asset.axis[0]}" onchange="{wire('this.opts.asset.axis.0')}" oninput="{wire('this.opts.asset.axis.0')}")
        span.center ×
        input.short(type="number" value="{opts.asset.axis[1]}" onchange="{wire('this.opts.asset.axis.1')}" oninput="{wire('this.opts.asset.axis.1')}")
    fieldset
        .aButtonGroup.flexrow.wide
            button.wide(onclick="{textureCenter}")
                svg.feather
                    use(xlink:href="#crosshair")
                span   {voc.setCenter}
            button.square(onclick="{textureIsometrify}" title="{voc.isometrify}")
                svg.feather
                    use(xlink:href="#map-pin")

mixin viewSettings
    h3 {voc.viewSettings}
    fieldset
        label.checkbox
            input(checked="{prevShowMask}" onchange="{wire('this.prevShowMask')}" type="checkbox")
            span   {voc.showMask}
        label.checkbox(if="{opts.asset.width > 10 && opts.asset.height > 10 && !opts.asset.tiled}")
            input(checked="{prevShowFrameIndices}" onchange="{wire('this.prevShowFrameIndices')}" type="checkbox")
            span   {voc.showFrameIndices}

mixin exportSettings
    h3 {voc.exportSettings}
    fieldset.flexrow
        b.nogrow.alignmiddle
            span {voc.padding}
        .aSpacer.small.nogrow
        input.inline.alignmiddle(
            type="number"
            min="0" max="128" step="1"
            value="{texture.padding}"
            onchange="{wire('this.opts.asset.padding')}"
        )
        .aSpacer.small.nogrow
        hover-hint.nogrow.alignmiddle(text="{voc.paddingNotice}")
    fieldset
        hover-hint.toright(text="{voc.blankTextureNotice}")
        label.checkbox
            input.nogrow(checked="{texture.isBlank}" onchange="{wire('this.opts.asset.isBlank')}" type="checkbox")
            span   {voc.blankTexture}

mixin previewPanel
    .preview.bordertop.flexfix-footer(hide="{opts.asset.tiled}" if="{!opts.skeletonmode}")
        .texture-editor-anAnimationPreview(
            ref="preview"
            style="background-color: {previewColor};"
        )
            canvas(
                ref="grprCanvas"
                style="image-rendering: {currentProject.settings.rendering.pixelatedrender? 'pixelated' : '-webkit-optimize-contrast'};"
            )
            span(ref="textureviewframe") 0 / 1
        .flexrow
            .aButtonGroup.nml.nogrow
                button.nogrow.square.inline(onclick="{previewBack}")
                    svg.feather
                        use(xlink:href="#skip-back")
                button.nogrow.square.inline(onclick="{previewPlayPause}")
                    svg.feather
                        use(xlink:href="#{prevPlaying? 'pause' : 'play'}")
                button.nogrow.square.inline.nmr(onclick="{previewNext}")
                    svg.feather
                        use(xlink:href="#skip-forward")
            b.nogrow.alignmiddle FPS:
            input.texture-editor-anAnimSpeedField.short(
                type="number"
                min="1"
                value="{prevSpeed}"
                onchange="{wire('this.prevSpeed')}"
                oninput="{wire('this.prevSpeed')}"
            )
            hover-hint.alignmiddle.nogrow(text="{voc.previewAnimationNotice}")

mixin canvasTools
    .texture-editor-Tools
        .toright
    .textureview-zoom.flexrow
        b.aContrastingPlaque {Math.round(zoomFactor * 100)}%
        .aSpacer
        zoom-slider(onchanged="{setZoom}" ref="zoomslider" value="{zoomFactor}")
    .textureview-bg
        button.inline.forcebackground(onclick="{changePreviewBg}")
            svg.feather
                use(xlink:href="#droplet")
            span {voc.bgColor}

mixin atlas
    .texture-editor-anAtlas.tall(
        if="{opts.asset}"
        style="background-color: {previewColor};"
        onmousewheel="{onMouseWheel}"
    )
        .texture-editor-aCanvasWrap
            canvas.texture-editor-aCanvas(
                ref="textureCanvas"
                style="transform: scale({zoomFactor}); image-rendering: {zoomFactor > 1? 'pixelated' : '-webkit-optimize-contrast'}; transform-origin: 0% 0%;"
            )
            // This div is needed to cause elements' reflow so the scrollbars update on canvas' size change
            div(style="width: {zoomFactor}px; height: {zoomFactor}px;")
            .aClicker(
                if="{prevShowMask && opts.asset.shape === 'strip' && getStripSegments()}"
                each="{seg, ind in getStripSegments()}"
                style="left: {seg.left}px; top: {seg.top}px; width: {seg.width}px; transform: translate(0, -50%) rotate({seg.angle}deg);"
                title="{voc.addPoint}"
                onmousedown="{addStripPointOnSegment}"
            )
            .aDragger(
                if="{prevShowMask}"
                style="left: {(opts.asset.axis[0] + opts.asset.offx) * zoomFactor}px; top: {(opts.asset.axis[1] + opts.asset.offy) * zoomFactor}px; border-radius: 0;"
                title="{voc.moveCenter}"
                onmousedown="{startMoving('axis')}"
            )
            .aDragger(
                if="{prevShowMask && texture.shape === 'strip'}"
                each="{point, ind in getMovableStripPoints()}"
                style="left: {(point.x + texture.axis[0] + texture.offx) * zoomFactor}px; top: {(point.y + texture.axis[1] + texture.offy) * zoomFactor}px;"
                title="{voc.movePoint}"
                onmousedown="{startMoving('point')}"
                oncontextmenu="{removeStripPoint}"
            )
        +canvasTools()

texture-editor.aDimmer.pointer.pad.fadein(onclick="{tryClose}")
    button.aDimmer-aCloseButton.forcebackground(
        title="{vocGlob.close}"
        onclick="{assetSave}"
    )
        svg.feather
            use(xlink:href="#x")
    .aModal.cursordefault.appear
        .flexrow.tall
            .column.borderright.tall.column1.flexfix.nogrow.noshrink
                .flexfix-body
                    h3 {vocGlob.assetTypes.textures[0].slice(0, 1).toUpperCase()}{vocGlob.assetTypes.textures[0].slice(1)}
                    label
                        b {voc.name}
                        input.wide(type="text" value="{opts.asset.name}" onchange="{wire('this.asset.name')}")
                    .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nameTaken}
                    .aSpacer
                    div(if="{!opts.skeletonmode}")
                        +textureSource()
                        +sliceSettings()
                        +exportSettings()
                +previewPanel()
            +atlas()
            .column.column2.borderleft.tall.flexfix.nogrow.noshrink
                .flexfix-body
                    div(if="{!opts.skeletonmode}")
                        +axisSettings()
                    +collisionSettings()
                    +viewSettings()
                .flexfix-footer
                    button.wide(onclick="{assetSave}" title="Shift+Control+S" data-hotkey="Control+S")
                        svg.feather
                            use(xlink:href="#save")
                        span {window.languageJSON.common.save}
    color-picker(
        ref="previewBackgroundColor" if="{changingPreviewBg}"
        hidealpha="true"
        color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"
    )
    script.
        const path = require('path'),
              fs = require('fs-extra');
        const glob = require('./data/node_requires/glob');
        const {getSwatch} = require('./data/node_requires/themes');

        this.namespace = 'textureView';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.nameTaken = false;
        this.prevPlaying = !this.opts.skeletonmode;
        this.prevPos = 0;
        this.prevSpeed = 10;
        this.prevShowMask = this.prevShowFrameIndices = true;
        this.previewColor = localStorage.UItheme === 'Day' ? '#ffffff' : '#08080D';
        this.zoomFactor = 1;

        var textureCanvas, grprCanvas;

        this.on('mount', () => {
            ({textureCanvas, grprCanvas} = this.refs);
            textureCanvas.x = textureCanvas.getContext('2d');
            grprCanvas.x = grprCanvas.getContext('2d');
            const texture = this.asset = this.opts.asset;
            const img = document.createElement('img');
            img.onload = () => {
                textureCanvas.img = img;
                this.update();
                setTimeout(() => {
                    this.launchTexturePreview();
                }, 0);
            };
            img.onerror = e => {
                alertify.error(window.languageJSON.textureView.corrupted);
                console.error(e);
                this.assetSave();
            };
            img.src = path.join('file://', global.projdir, '/img/', texture.origname) + '?' + Math.random();
        });
        this.on('update', () => {
            const {textures} = global.currentProject;
            const t = this.asset;
            if (textures.find(texture => t.name === texture.name && t !== texture)) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
            const {textureCanvas} = this.refs;
            const {img} = textureCanvas;
            // Enforce positive/zero values
            for (const prop of ['marginx', 'marginy', 'offx', 'offy', 'untill', 'padding']) {
                if (t[prop] < 0) {
                    t[prop] = 0;
                }
            }
            for (const prop of ['width', 'height']) {
                if (t[prop] < 1) {
                    t[prop] = 1;
                }
            }
            if (t.grid[0] < 1) {
                t.grid[0] = 1;
            }
            if (t.grid[1] < 1) {
                t.grid[1] = 1;
            }
            // Calculate frame width for the user if it exceeds image size
            if (t.grid[0] * (t.width + t.marginx) - t.marginx > img.width - t.offx) {
                t.width = Math.floor((img.width - t.offx) / t.grid[0] - t.marginx);
            }
            if (t.grid[1] * (t.height + t.marginy) - t.marginy > img.height - t.offy) {
                t.height = Math.floor((img.height - t.offy) / t.grid[1] - t.marginy);
            }
            // Preset frame count can't be larger than the grid table size
            if (t.untill > t.grid[0] * t.grid[1]) {
                t.untill = t.grid[0] * t.grid[1];
            }
            this.updateSymmetricalPoints();
        });
        this.on('updated', () => {
            this.refreshTextureCanvas();
        });
        this.on('unmount', () => {
            if (this.prevPlaying) { // Need to clear a setTimeout handle to prevent memory leaks
                this.stopTexturePreview();
            }
        });

        this.assetReplace = () => {
            const val = this.refs.textureReplacer.files[0].path;
            if (/\.(jpg|gif|png|jpeg)/gi.test(val)) {
                this.loadImg(
                    val,
                    global.projdir + '/img/i' + this.asset.uid + path.extname(val)
                );
                this.asset.source = val;
            } else {
                alertify.error(window.languageJSON.common.wrongFormat);
            }
            this.refs.textureReplacer.value = '';
        };
        this.reimport = () => {
            this.loadImg(
                this.asset.source,
                global.projdir + '/img/i' + this.asset.uid + path.extname(this.asset.source)
            );
        };
        this.paste = async () => {
            const png = nw.Clipboard.get().get('png');
            if (!png) {
                alertify.error(this.vocGlob.couldNotLoadFromClipboard);
                return;
            }
            const imageBase64 = png.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = new Buffer(imageBase64, 'base64');
            await this.loadImg(
                imageBuffer,
                global.projdir + '/img/i' + this.asset.uid + '.png'
            );
            alertify.success(this.vocGlob.pastedFromClipboard);
        };

        /**
         * Loads an image into the project, generating thumbnails and updating the preview.
         * @param {String|Buffer} filename A source image. It can be either a full path in a file system,
         * or a buffer.
         * @param {Sting} dest The path to write to.
         */
        this.loadImg = async (filename, dest) => {
            try {
                if (filename instanceof Buffer) {
                    await fs.writeFile(dest, filename);
                } else {
                    await fs.copy(filename, dest);
                }
                const image = document.createElement('img');
                image.onload = () => {
                    this.asset.imgWidth = image.width;
                    this.asset.imgHeight = image.height;
                    if (this.asset.tiled || (
                        this.asset.grid[0] === 1 &&
                        this.asset.grid[1] === 1 &&
                        this.asset.offx === 0 &&
                        this.asset.offy === 0
                    )) {
                        this.asset.width = this.asset.imgWidth;
                        this.asset.height = this.asset.imgHeight;
                    }
                    this.asset.origname = path.basename(dest);
                    textureCanvas.img = image;
                    this.asset.lastmod = Number(new Date());

                    const {textureGenPreview, updateDOMImage, updatePixiTexture} = require('./data/node_requires/resources/textures');
                    textureGenPreview(this.asset, dest + '_prev.png', 64, () => {
                        this.update();
                    });
                    textureGenPreview(this.asset, dest + '_prev@2.png', 128);
                    setTimeout(() => {
                        this.refreshTextureCanvas();
                        updateDOMImage(this.asset);
                        updatePixiTexture(this.asset);
                        this.launchTexturePreview();
                    }, 0);
                };
                image.onerror = e => {
                    alertify.error(e);
                };
                image.src = 'file://' + dest + '?' + Math.random();
            } catch (e) {
                alertify.error(e);
                throw e;
            }
        };

        this.setZoom = zoom => {
            this.zoomFactor = zoom;
            this.update();
        };
        /** Change zoomFactor on mouse wheel roll */
        this.onMouseWheel = e => {
            if (e.wheelDelta > 0) {
                this.refs.zoomslider.zoomIn();
            } else {
                this.refs.zoomslider.zoomOut();
            }
            e.preventDefault();
            this.update();
        };

        /**
         * Установить ось вращения на центр изображения
         */
        this.assetCenter = () => {
            const {texture} = this;
            let needsRefilling = false;
            if (texture.left === Math.floor(texture.axis[0]) &&
                texture.top === Math.floor(texture.axis[1]) &&
                texture.right === Math.ceil(texture.width - texture.axis[0]) &&
                texture.bottom === Math.ceil(texture.height - texture.axis[1])
            ) {
                needsRefilling = true;
            }
            texture.axis[0] = Math.floor(texture.width / 2);
            texture.axis[1] = Math.floor(texture.height / 2);
            if (needsRefilling) {
                this.assetFillRect();
            }
        };
        /**
         * Заполнить всё изображение маской-квадратом
         */
        this.assetFillRect = () => {
            const {texture} = this;
            texture.left = Math.floor(texture.axis[0]);
            texture.top = Math.floor(texture.axis[1]);
            texture.right = Math.ceil(texture.width - texture.axis[0]);
            texture.bottom = Math.ceil(texture.height - texture.axis[1]);
        };
        this.assetIsometrify = () => {
            const {texture} = this;
            texture.axis[0] = Math.floor(texture.width / 2);
            texture.axis[1] = texture.height;
            this.assetFillRect();
        };
        this.pasteCollisionMask = () => {
            if (!sessionStorage.copiedCollisionMask) {
                return;
            }
            Object.assign(this.asset, JSON.parse(sessionStorage.copiedCollisionMask));
        };
        this.copyCollisionMask = () => {
            const {texture} = this;
            sessionStorage.copiedCollisionMask = JSON.stringify({
                shape: texture.shape,
                stripPoints: texture.stripPoints,
                left: texture.left,
                right: texture.right,
                top: texture.top,
                bottom: texture.bottom,
                r: texture.r
            });
        };

        /**
         * Запустить предпросмотр анимации
         */
        this.previewPlayPause = () => {
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
        this.previewBack = () => {
            this.prevPos--;
            const {texture} = this;
            const total = texture.untill === 0 ?
                texture.grid[0] * texture.grid[1] :
                Math.min(texture.grid[0] * texture.grid[1], texture.untill);
            if (this.prevPos < 0) {
                this.prevPos = texture.untill === 0 ? texture.grid[0] * texture.grid[1] : total - 0;
            }
            this.refreshPreviewCanvas();
        };
        /**
         * Шагнуть на кадр вперёд в предпросмотре анимации
         */
        this.previewNext = () => {
            this.prevPos++;
            const {texture} = this;
            const total = texture.untill === 0 ?
                texture.grid[0] * texture.grid[1] :
                Math.min(texture.grid[0] * texture.grid[1], texture.untill);
            if (this.prevPos >= total) {
                this.prevPos = 0;
            }
            this.refreshPreviewCanvas();
        };
        this.refreshPreviewCanvas = () => {
            const xx = this.prevPos % this.asset.grid[0],
                  yy = Math.floor(this.prevPos / this.asset.grid[0]),
                  x = this.asset.offx + xx * (this.asset.marginx + this.asset.width),
                  y = this.asset.offy + yy * (this.asset.marginy + this.asset.height),
                  w = this.asset.width,
                  h = this.asset.height;
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
                this.drawMask(grprCanvas, grprCanvas.x, true);
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
            const {texture} = this;
            this.prevTime = window.setTimeout(() => {
                const total = Math.min(
                    texture.untill === 0 ? Infinity : texture.untill,
                    texture.grid[0] * texture.grid[1]
                );
                this.prevPos++;
                if (this.prevPos >= total) {
                    this.prevPos = 0;
                }
                this.refs.textureviewframe.innerHTML = `${this.prevPos} / ${total}`;
                if (!this.asset.tiled) {
                    this.refreshPreviewCanvas();
                }
                this.stepTexturePreview();
            }, 1000 / this.prevSpeed);
        };

        /**
         * Переключает тип маски на круг и выставляет начальные параметры
         */
        this.assetSelectCircle = function textureSelectCircle() {
            this.asset.shape = 'circle';
            if (!('r' in this.asset) || this.asset.r === 0) {
                this.asset.r = Math.min(
                    Math.floor(this.asset.width / 2),
                    Math.floor(this.asset.height / 2)
                );
            }
        };
        /**
         * Переключает тип маски на прямоугольник и выставляет начальные параметры
         */
        this.assetSelectRect = function textureSelectRect() {
            this.asset.shape = 'rect';
            this.assetFillRect();
        };
        /**
         * Переключает тип маски на ломаную/многоугольник и выставляет начальные параметры
         */
        this.assetSelectStrip = function textureSelectStrip() {
            this.asset.shape = 'strip';
            this.asset.stripPoints = this.asset.stripPoints || [];
            if (!this.asset.stripPoints.length) {
                const twoPi = Math.PI * 2;
                this.asset.closedStrip = true;
                for (let i = 0; i < 5; i++) {
                    this.asset.stripPoints.push({
                        x: Math.round(Math.sin(twoPi / 5 * i) * this.asset.width / 2),
                        y: -Math.round(Math.cos(twoPi / 5 * i) * this.asset.height / 2)
                    });
                }
            }
        };
        this.removeStripPoint = function removeStripPoint(e) {
            if (this.asset.symmetryStrip) {
                // Remove an extra point
                this.asset.stripPoints.pop();
            }
            this.asset.stripPoints.splice(e.item.ind, 1);
            e.preventDefault();
        };
        this.addStripPoint = function addStripPoint() {
            this.asset.stripPoints.push({
                x: 0,
                y: 16
            });
        };
        this.addStripPointOnSegment = e => {
            const {top, left} = textureCanvas.getBoundingClientRect();
            const point = {
                x: (e.pageX - left) / this.zoomFactor - this.asset.axis[0] - this.asset.offx,
                y: (e.pageY - top) / this.zoomFactor - this.asset.axis[1] - this.asset.offy
            };
            this.asset.stripPoints.splice(e.item.ind + 1, 0, point);
            if (this.asset.symmetryStrip) {
                // Add an extra point (the symetrical point)
                this.addStripPoint();
            }
            this.startMoving('point', point)(e);
        };
        this.pointToLine = (linePoint1, linePoint2, point) => {
            const dlx = linePoint2.x - linePoint1.x;
            const dly = linePoint2.y - linePoint1.y;
            const lineLength = Math.sqrt(dlx * dlx + dly * dly);
            const lineAngle = Math.atan2(dly, dlx);

            const dpx = point.x - linePoint1.x;
            const dpy = point.y - linePoint1.y;
            const toPointLength = Math.sqrt(dpx * dpx + dpy * dpy);
            const toPointAngle = Math.atan2(dpy, dpx);

            const distance = toPointLength * Math.cos(toPointAngle - lineAngle);

            return {
                x: linePoint1.x + distance * dlx / lineLength,
                y: linePoint1.y + distance * dly / lineLength
            };
        };
        this.onClosedStripChange = () => {
            this.asset.closedStrip = !this.asset.closedStrip;
            if (!this.asset.closedStrip && this.asset.symmetryStrip) {
                this.onSymmetryChange();
            }
        };
        this.onSymmetryChange = () => {
            if (this.asset.symmetryStrip) {
                this.asset.stripPoints = this.getMovableStripPoints();
            } else {
                const nbPointsToAdd = this.asset.stripPoints.length - 2;
                for (let i = 0; i < nbPointsToAdd; i++) {
                    this.addStripPoint();
                }
                this.asset.closedStrip = true; // Force closedStrip to true
            }

            this.asset.symmetryStrip = !this.asset.symmetryStrip;
            this.update();
        };
        this.startMoving = (which, point) => e => {
            if (e.button !== 0) {
                return;
            }
            const startX = e.screenX,
                  startY = e.screenY;
            if (which === 'axis') {
                const [oldX, oldY] = this.asset.axis;
                const func = e => {
                    this.asset.axis[0] = (e.screenX - startX) / this.zoomFactor + oldX;
                    this.asset.axis[1] = (e.screenY - startY) / this.zoomFactor + oldY;
                    this.update();
                };
                const func2 = () => {
                    document.removeEventListener('mousemove', func);
                    document.removeEventListener('mouseup', func2);
                };
                document.addEventListener('mousemove', func);
                document.addEventListener('mouseup', func2);
            } else if (which === 'point') {
                point = point || e.item.point;
                const oldX = point.x,
                      oldY = point.y;
                let hasMoved = false;
                const func = e => {
                    if (!hasMoved && (e.screenX !== startX || e.screenY !== startY)) {
                        hasMoved = true;
                    }
                    point.x = (e.screenX - startX) / this.zoomFactor + oldX;
                    point.y = (e.screenY - startY) / this.zoomFactor + oldY;
                    this.update();
                };
                const func2 = () => {
                    if (!hasMoved) {
                        return;
                    }
                    document.removeEventListener('mousemove', func);
                    document.removeEventListener('mouseup', func2);
                };
                document.addEventListener('mousemove', func);
                document.addEventListener('mouseup', func2);
            }
        };

        this.drawMask = (tc, context, noOffset) => {
            let {offx, offy} = this.asset;
            if (noOffset) {
                offx = offy = 0;
            }
            context.fillStyle = getSwatch('accent1');
            context.globalAlpha = 0.5;
            if (this.asset.shape === 'rect') {
                context.fillRect(
                    this.asset.axis[0] - this.asset.left + offx,
                    this.asset.axis[1] - this.asset.top + offy,
                    this.asset.right + this.asset.left,
                    this.asset.bottom + this.asset.top
                );
            } else if (this.asset.shape === 'circle') {
                context.beginPath();
                context.arc(
                    this.asset.axis[0] + offx,
                    this.asset.axis[1] + offy,
                    this.asset.r,
                    0, 2 * Math.PI
                );
                context.fill();
            } else if (this.asset.shape === 'strip' && this.asset.stripPoints.length) {
                context.strokeStyle = getSwatch('accent1');
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(
                    this.asset.stripPoints[0].x + this.asset.axis[0] + offx,
                    this.asset.stripPoints[0].y + this.asset.axis[1] + offy
                );
                for (let i = 1, l = this.asset.stripPoints.length; i < l; i++) {
                    context.lineTo(
                        this.asset.stripPoints[i].x + this.asset.axis[0] + offx,
                        this.asset.stripPoints[i].y + this.asset.axis[1] + offy
                    );
                }
                if (this.asset.closedStrip) {
                    context.closePath();
                }
                context.stroke();

                if (this.asset.symmetryStrip) {
                    const movablePoints = this.getMovableStripPoints();
                    const [axisPoint1] = movablePoints;
                    const axisPoint2 = movablePoints[movablePoints.length - 1];

                    // Draw symmetry axis
                    context.strokeStyle = getSwatch('act');
                    context.lineWidth = 3;
                    context.beginPath();
                    context.moveTo(
                        axisPoint1.x + this.asset.axis[0] + offx,
                        axisPoint1.y + this.asset.axis[1] + offy
                    );
                    context.lineTo(
                        axisPoint2.x + this.asset.axis[0] + offx,
                        axisPoint2.y + this.asset.axis[1] + offy
                    );
                    context.stroke();
                }
            }
        };

        /**
         * Redraws the canvas with the full image, its collision mask, and its slicing grid
         */
        this.refreshTextureCanvas = () => {
            const tc = textureCanvas;
            tc.width = tc.img.width;
            tc.height = tc.img.height;
            const minSide = Math.min(this.asset.width, this.asset.height);
            tc.x.strokeStyle = getSwatch('act');
            tc.x.lineWidth = 1;
            tc.x.font = `${Math.min(24, minSide)}px sans-serif`;
            tc.x.textAlign = 'left';
            tc.x.textBaseline = 'top';
            tc.x.globalCompositeOperation = 'source-over';
            tc.x.clearRect(0, 0, tc.width, tc.height);
            tc.x.drawImage(tc.img, 0, 0);
            if (!this.asset.tiled) {
                const l = Math.min(
                    this.asset.grid[0] * this.asset.grid[1],
                    this.asset.untill || Infinity
                );
                for (let i = 0; i < l; i++) {
                    const xx = i % this.asset.grid[0],
                          yy = Math.floor(i / this.asset.grid[0]),
                          x = this.asset.offx + xx * (this.asset.marginx + this.asset.width),
                          y = this.asset.offy + yy * (this.asset.marginy + this.asset.height),
                          w = this.asset.width,
                          h = this.asset.height;
                    tc.x.globalAlpha = 0.5;
                    tc.x.strokeStyle = getSwatch('act');
                    tc.x.lineWidth = 1;
                    tc.x.strokeRect(x, y, w, h);
                    if (this.prevShowFrameIndices &&
                        this.opts.asset.width > 8 &&
                        this.opts.asset.height > 8
                    ) {
                        tc.x.lineWidth = 2;
                        tc.x.globalAlpha = 1;
                        tc.x.strokeStyle = getSwatch('act');
                        tc.x.fillStyle = '#fff';
                        tc.x.strokeText(i, x + 2, y + 2);
                        tc.x.fillText(i, x + 2, y + 2);
                    }
                }
            }
            if (this.prevShowMask) {
                this.drawMask(tc, tc.x);
            }
        };

        this.tryClose = e => {
            if (e.target !== this.root) {
                return;
            }
            this.assetSave();
        };
        /**
         * Saves the texture and closes the opened window
         */
        this.assetSave = () => {
            if (this.nameTaken) {
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                const {soundbox} = require('./data/node_requires/3rdparty/soundbox');
                soundbox.play('Failure');
                return false;
            }
            updatePixiTexture(this.asset);
            glob.modified = true;
            this.asset.lastmod = Number(new Date());
            if (!this.opts.skeletonmode) {
                const {textureGenPreview, updatePixiTexture, updateDOMImage} = require('./data/node_requires/resources/textures');
                updateDOMImage(this.asset);
                updatePixiTexture(this.asset);
                textureGenPreview(this.asset, global.projdir + '/img/' + this.asset.origname + '_prev@2.png', 128);
                textureGenPreview(this.asset, global.projdir + '/img/' + this.asset.origname + '_prev.png', 64)
                .then(() => {
                    this.opts.onclose();
                });
            } else {
                this.opts.onclose();
            }
            return true;
        };

        this.changePreviewBg = () => {
            this.changingPreviewBg = !this.changingPreviewBg;
            if (this.changingPreviewBg) {
                this.oldPreviewColor = this.previewColor;
            }
        };
        this.updatePreviewColor = (color, evtype) => {
            this.previewColor = color;
            if (evtype === 'onapply') {
                this.changingPreviewBg = false;
            }
            this.update();
        };
        this.cancelPreviewColor = () => {
            this.changingPreviewBg = false;
            this.previewColor = this.oldPreviewColor;
            this.update();
        };
        this.getMovableStripPoints = () => {
            if (!this.asset) {
                return false;
            }
            const points = this.asset.stripPoints;
            if (!this.asset.symmetryStrip) {
                return points;
            }
            return points.slice(0, 2 + Math.round((points.length - 2) / 2));
        };
        this.getStripSegments = () => {
            if (!this.asset) {
                return false;
            }
            if (this.asset.shape !== 'strip') {
                return false;
            }

            const points = this.getMovableStripPoints();
            const segs = [];

            for (let i = 0; i < points.length; i++) {
                const point1 = points[i];
                const point2 = points[(i + 1) % points.length];

                const x1 = (point1.x + this.asset.axis[0] + this.asset.offx) * this.zoomFactor;
                const y1 = (point1.y + this.asset.axis[1] + this.asset.offy) * this.zoomFactor;
                const x2 = (point2.x + this.asset.axis[0] + this.asset.offx) * this.zoomFactor;
                const y2 = (point2.y + this.asset.axis[1] + this.asset.offy) * this.zoomFactor;
                const dx = x2 - x1;
                const dy = y2 - y1;

                const length = Math.sqrt(dx * dx + dy * dy);
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
            if (this.asset && this.asset.symmetryStrip) {
                const movablePoints = this.getMovableStripPoints();
                const [axisPoint1] = movablePoints;
                const axisPoint2 = movablePoints[movablePoints.length - 1];
                for (let i = 1; i < movablePoints.length - 1; i++) {
                    const j = this.asset.stripPoints.length - i;
                    const point = movablePoints[i];
                    const axisPoint = this.pointToLine(axisPoint1, axisPoint2, point);
                    this.asset.stripPoints[j] = {
                        x: 2 * axisPoint.x - point.x,
                        y: 2 * axisPoint.y - point.y
                    };
                }
            }
        };

