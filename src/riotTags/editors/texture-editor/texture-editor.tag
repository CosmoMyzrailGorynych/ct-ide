//
    A texture editor with all its tools. Also supports skeletons.

    @attribute asset (ITexture | ISkeleton)

    @attribute onclose (riot function)
        A callback that is called when a user wants to close this window.
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
            input(type="radio" name="collisionform" checked="{opts.asset.shape === 'circle'}" onclick="{assetSelectCircle}")
            span {voc.round}
        label.checkbox
            input(type="radio" name="collisionform" checked="{opts.asset.shape === 'rect'}" onclick="{assetSelectRect}")
            span {voc.rectangle}
        label.checkbox
            input(type="radio" name="collisionform" checked="{opts.asset.shape === 'strip'}" onclick="{assetSelectStrip}")
            span {voc.strip}
    fieldset(if="{opts.asset.shape === 'circle'}")
        b {voc.radius}
        br
        input.wide(type="number" value="{opts.asset.r}" onchange="{wire('opts.asset.r')}" oninput="{wire('opts.asset.r')}")
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
            input.center.short(type="number" value="{opts.asset.top}" onchange="{wire('opts.asset.top')}" oninput="{wire('opts.asset.top')}")
            br
            input.center.short(type="number" value="{opts.asset.left}" onchange="{wire('opts.asset.left')}" oninput="{wire('opts.asset.left')}")
            |
            |
            span.aPivotSymbol
            |
            |
            input.center.short(type="number" value="{opts.asset.right}" onchange="{wire('opts.asset.right')}" oninput="{wire('opts.asset.right')}")
            br
            input.center.short(type="number" value="{opts.asset.bottom}" onchange="{wire('opts.asset.bottom')}" oninput="{wire('opts.asset.bottom')}")
        button.wide(onclick="{assetFillRect}")
            svg.feather
                use(xlink:href="#maximize")
            span {voc.fill}
    fieldset(if="{opts.asset.shape === 'strip'}")
        .flexrow.aStripPointRow(each="{point, ind in getMovableStripPoints()}")
            input.short(type="number" value="{point.x}" oninput="{wire('opts.asset.stripPoints.'+ ind + '.x')}")
            span.center   ×
            input.short(type="number" value="{point.y}" oninput="{wire('opts.asset.stripPoints.'+ ind + '.y')}")
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
            input(
                type="file"
                ref="sourceReplacer"
                accept="{skeletonMode ? '.json' : '.png,.jpg,.jpeg,.bmp,.gif,.webp'}"
                onchange="{sourceReplace}"
            )
            .button.inline.wide
                svg.feather
                    use(xlink:href="#folder")
                span {voc.replaceTexture}
        .aButtonGroup.nmr.nogrow
            button.inline.square(
                if="{opts.asset.source}"
                title="{vocGlob.reimport} (Control+R)"
                onclick="{reimport}"
                data-hotkey="Control+r"
            )
                svg.feather
                    use(xlink:href="#refresh-ccw")
            button.inline.square(
                if="{!skeletonMode}"
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
            input#texturetiled(type="checkbox" checked="{opts.asset.tiled}" onchange="{wire('opts.asset.tiled')}")
            span   {voc.tiled}
    fieldset(if="{!opts.asset.tiled}")
        .flexrow
            div
                b {voc.cols}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.grid[0]}"
                    onchange="{wire('opts.asset.grid.0')}"
                    oninput="{wire('opts.asset.grid.0')}"
                    min="1"
                )
            span &nbsp;
            div
                b {voc.rows}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.grid[1]}"
                    onchange="{wire('opts.asset.grid.1')}"
                    oninput="{wire('opts.asset.grid.1')}"
                    min="1"
                )
        .flexrow
            div
                b {voc.width}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.width}"
                    onchange="{wire('opts.asset.width')}"
                    oninput="{wire('opts.asset.width')}"
                    min="1"
                )
            span &nbsp;
            div
                b {voc.height}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.height}"
                    onchange="{wire('opts.asset.height')}"
                    oninput="{wire('opts.asset.height')}"
                    min="1"
                )
    fieldset(if="{!opts.asset.tiled}")
        b {voc.frames}
        br
        input#textureframes.wide(
            type="number"
            value="{opts.asset.untill}"
            onchange="{wire('opts.asset.untill')}"
            oninput="{wire('opts.asset.untill')}"
            min="0"
        )
    fieldset(if="{!opts.asset.tiled}")
        .flexrow
            div
                b {voc.marginX}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.marginx}"
                    onchange="{wire('opts.asset.marginx')}"
                    oninput="{wire('opts.asset.marginx')}"
                    min="0"
                )
            span &nbsp;
            div
                b {voc.marginY}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.marginy}"
                    onchange="{wire('opts.asset.marginy')}"
                    oninput="{wire('opts.asset.marginy')}"
                    min="0"
                )
        .flexrow
            div
                b {voc.offX}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.offx}"
                    onchange="{wire('opts.asset.offx')}"
                    oninput="{wire('opts.asset.offx')}"
                    min="0"
                )
            span &nbsp;
            div
                b {voc.offY}
                br
                input.wide(
                    type="number"
                    value="{opts.asset.offy}"
                    onchange="{wire('opts.asset.offy')}"
                    oninput="{wire('opts.asset.offy')}"
                    min="0"
                )

mixin axisSettings
    h3.flexrow
        span.alignmiddle
            .aPivotSymbol.nml
            | {voc.center}
        hover-hint.toright.alignmiddle.nogrow(text="{voc.axisExplanation}")
    fieldset.flexrow
        input.short(type="number" value="{opts.asset.axis[0]}" onchange="{wire('opts.asset.axis.0')}" oninput="{wire('opts.asset.axis.0')}")
        span.center ×
        input.short(type="number" value="{opts.asset.axis[1]}" onchange="{wire('opts.asset.axis.1')}" oninput="{wire('opts.asset.axis.1')}")
    fieldset
        .aButtonGroup.flexrow.wide
            button.wide(onclick="{assetCenter}")
                svg.feather
                    use(xlink:href="#crosshair")
                span   {voc.setCenter}
            button.square(onclick="{assetIsometrify}" title="{voc.isometrify}")
                svg.feather
                    use(xlink:href="#map-pin")

mixin viewSettings
    h3 {voc.viewSettings}
    fieldset
        label.checkbox
            input(checked="{prevShowMask}" onchange="{wire('prevShowMask')}" type="checkbox")
            span   {voc.showMask}
        label.checkbox(if="{opts.asset.width > 10 && opts.asset.height > 10 && !opts.asset.tiled}")
            input(checked="{prevShowFrameIndices}" onchange="{wire('prevShowFrameIndices')}" type="checkbox")
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
            value="{opts.asset.padding}"
            onchange="{wire('opts.asset.padding')}"
        )
        .aSpacer.small.nogrow
        hover-hint.nogrow.alignmiddle(text="{voc.paddingNotice}")
    fieldset
        hover-hint.toright(text="{voc.blankTextureNotice}")
        label.checkbox
            input.nogrow(checked="{opts.asset.isBlank}" onchange="{wire('opts.asset.isBlank')}" type="checkbox")
            span   {voc.blankTexture}

mixin previewPanel
    .preview.bordertop.flexfix-footer(hide="{opts.asset.tiled}" if="{!skeletonMode}")
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
                onchange="{wire('prevSpeed')}"
                oninput="{wire('prevSpeed')}"
            )
            hover-hint.alignmiddle.nogrow(text="{voc.previewAnimationNotice}")

mixin canvasTools
    .texture-editor-Tools(if="{!skeletonMode}")
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
                style="left: {(opts.asset.axis[0] + (opts.asset.offx || 0)) * zoomFactor}px; top: {(opts.asset.axis[1] + (opts.asset.offy || 0)) * zoomFactor}px; border-radius: 0;"
                title="{voc.moveCenter}"
                onmousedown="{!skeletonMode && startMoving('axis')}"
            )
            .aDragger(
                if="{prevShowMask && opts.asset.shape === 'strip'}"
                each="{point, ind in getMovableStripPoints()}"
                style="left: {(point.x + parent.opts.asset.axis[0] + (parent.opts.asset.offx || 0)) * zoomFactor}px; top: {(point.y + parent.opts.asset.axis[1] + (parent.opts.asset.offy || 0)) * zoomFactor}px;"
                title="{voc.movePoint}"
                onmousedown="{startMoving('point')}"
                oncontextmenu="{removeStripPoint}"
            )
        +canvasTools()

texture-editor(onclick="{tryClose}")
    .flexrow.tall
        .column.borderright.tall.column1.flexfix.nogrow.noshrink
            .flexfix-body
                h3 {vocGlob.assetTypes.texture[0].slice(0, 1).toUpperCase()}{vocGlob.assetTypes.texture[0].slice(1)}
                label
                    b {voc.name}
                    input.wide(type="text" value="{opts.asset.name}" onchange="{wire('opts.asset.name')}")
                .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nameTaken}
                .aSpacer
                +textureSource()
                div(if="{!skeletonMode}")
                    +sliceSettings()
                    +exportSettings()
            +previewPanel()
        +atlas()
        .column.column2.borderleft.tall.flexfix.nogrow.noshrink
            .flexfix-body
                div(if="{!skeletonMode}")
                    +axisSettings()
                +collisionSettings()
                +viewSettings()
            .flexfix-footer
                button.wide(onclick="{assetSave}" title="Shift+Control+S" data-hotkey="Control+S")
                    svg.feather
                        use(xlink:href="#save")
                    span {this.vocGlob.save}
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
        const {getTextureOrig} = require('./data/node_requires/resources/textures');
        const {getSkeletonRender} = require('./data/node_requires/resources/skeletons');

        this.skeletonMode = this.opts.asset.type === 'skeleton';

        this.namespace = 'textureView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);

        this.nameTaken = false;
        this.prevPlaying = !this.skeletonMode;
        this.prevPos = 0;
        this.prevSpeed = 10;
        this.prevShowMask = this.prevShowFrameIndices = true;
        this.previewColor = localStorage.UItheme === 'Day' ? '#ffffff' : '#08080D';
        this.zoomFactor = 1;

        var textureCanvas, grprCanvas;

        this.on('mount', () => {
            ({textureCanvas, grprCanvas} = this.refs);
            textureCanvas.x = textureCanvas.getContext('2d');
            if (!this.skeletonMode) {
                grprCanvas.x = grprCanvas.getContext('2d');
            }
            const img = document.createElement('img');
            img.onload = () => {
                textureCanvas.img = img;
                this.update();
                if (!this.skeletonMode) {
                    setTimeout(() => {
                        this.launchTexturePreview();
                    }, 0);
                }
            };
            img.onerror = e => {
                alertify.error(this.vocFull.textureView.corrupted);
                console.error(e);
                this.assetSave();
            };
            if (this.skeletonMode) {
                img.src = getSkeletonRender(this.opts.asset, false);
            } else {
                img.src = getTextureOrig(this.opts.asset, false);
            }
        });
        this.on('update', () => {
            const {asset} = this.opts;
            /*
            // TODO: Unified name check
            const {textures, skeletons} = global.currentProject;
            const collection = this.skeletonMode ? skeletons : textures;
            // Check if the name for a specified asset type was already taken
            if (collection.find(other => other.name === asset.name && asset !== other)) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
            */
            if (this.skeletonMode) {
                return;
            }
            // Sanity checks for sliced textures
            const {textureCanvas} = this.refs;
            const {img} = textureCanvas;
            // Enforce positive/zero values
            for (const prop of ['marginx', 'marginy', 'offx', 'offy', 'untill', 'padding']) {
                if (asset[prop] < 0) {
                    asset[prop] = 0;
                }
            }
            for (const prop of ['width', 'height']) {
                if (asset[prop] < 1) {
                    asset[prop] = 1;
                }
            }
            if (asset.grid[0] < 1) {
                asset.grid[0] = 1;
            }
            if (asset.grid[1] < 1) {
                asset.grid[1] = 1;
            }
            // Calculate frame width for the user if it exceeds image size
            if (asset.grid[0] * (asset.width + asset.marginx) - asset.marginx > img.width - asset.offx) {
                asset.width = Math.floor((img.width - asset.offx) / asset.grid[0] - asset.marginx);
            }
            if (asset.grid[1] * (asset.height + asset.marginy) - asset.marginy > img.height - asset.offy) {
                asset.height = Math.floor((img.height - asset.offy) / asset.grid[1] - asset.marginy);
            }
            // Preset frame count can'asset be larger than the grid table size
            if (asset.untill > asset.grid[0] * asset.grid[1]) {
                asset.untill = asset.grid[0] * asset.grid[1];
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

        this.sourceReplace = () => {
            const val = this.refs.sourceReplacer.files[0].path;
            const formatCheck = this.skeletonMode ? /\.json$/gi : /\.(jpg|gif|png|jpeg|webp)$/gi;
            if (formatCheck.test(val)) {
                this.loadImg(val);
            } else {
                alertify.error(this.vocGlob.wrongFormat);
            }
            this.refs.sourceReplacer.value = '';
        };
        this.reimport = async() => {
            const exists = await fs.pathExists(this.opts.asset.source);
            if (!exists) {
                alertify.error(this.vocGlob.reimportSourceMissing);
                return;
            }
            this.loadImg(this.opts.asset.source);
        };
        this.paste = async () => {
            if (this.skeletonMode) {
                throw new Error('Skeletons cannot be pasted from clipboard.');
            }
            const png = nw.Clipboard.get().get('png');
            if (!png) {
                alertify.error(this.vocGlob.couldNotLoadFromClipboard);
                return;
            }
            const imageBase64 = png.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = new Buffer(imageBase64, 'base64');
            await this.loadImg(imageBuffer);
            alertify.success(this.vocGlob.pastedFromClipboard);
        };

        /**
         * Reimports the current texture from a buffer or from a file system path.
         */
        this.loadImg = async (source) => {
            try {
                if (this.skeletonMode) {
                    const {reimportSkeleton} = require('./data/node_requires/resources/skeletons');
                    await reimportSkeleton(this.opts.asset, source);
                    this.refreshTextureCanvas();
                } else {
                    const {reimportTexture} = require('./data/node_requires/resources/textures');
                    const newImage = await reimportTexture(this.opts.asset, source);
                    textureCanvas.img = newImage;
                    this.refreshTextureCanvas();
                    this.launchTexturePreview();
                }
            } catch (e) {
                alertify.error(e);
                throw e;
            }
            this.update();
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
         * Moves the texture's axis to the center of the frame.
         */
        this.assetCenter = () => {
            const {asset} = this.opts;
            let needsRefilling = false;
            if (asset.left === Math.floor(asset.axis[0]) &&
                asset.top === Math.floor(asset.axis[1]) &&
                asset.right === Math.ceil(asset.width - asset.axis[0]) &&
                asset.bottom === Math.ceil(asset.height - asset.axis[1])
            ) {
                needsRefilling = true;
            }
            asset.axis[0] = Math.floor(asset.width / 2);
            asset.axis[1] = Math.floor(asset.height / 2);
            if (needsRefilling) {
                this.assetFillRect();
            }
        };
        /**
         * Changes the rectangular collision mask to fill the frame.
         */
        this.assetFillRect = () => {
            const {asset} = this.opts;
            asset.left = Math.floor(asset.axis[0]);
            asset.top = Math.floor(asset.axis[1]);
            asset.right = Math.ceil(asset.width - asset.axis[0]);
            asset.bottom = Math.ceil(asset.height - asset.axis[1]);
        };
        /**
         * Moves the asset's axis to the bottom middle point of the frame,
         * and makes the rectangular collision mask fill the frame.
         */
        this.assetIsometrify = () => {
            const {asset} = this.opts;
            asset.axis[0] = Math.floor(asset.width / 2);
            asset.axis[1] = asset.height;
            this.assetFillRect();
        };
        this.pasteCollisionMask = () => {
            if (!sessionStorage.copiedCollisionMask) {
                return;
            }
            Object.assign(this.opts.asset, JSON.parse(sessionStorage.copiedCollisionMask));
        };
        this.copyCollisionMask = () => {
            const {asset} = this.opts;
            sessionStorage.copiedCollisionMask = JSON.stringify({
                shape: asset.shape,
                stripPoints: asset.stripPoints,
                left: asset.left,
                right: asset.right,
                top: asset.top,
                bottom: asset.bottom,
                r: asset.r
            });
        };

        /**
         * Toggles the playback of the preview canvas
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
         * Switches to the previous frame of the framed animation in the preview canvas
         */
        this.previewBack = () => {
            this.prevPos--;
            const {asset} = this.opts;
            const total = asset.untill === 0 ?
                asset.grid[0] * asset.grid[1] :
                Math.min(asset.grid[0] * asset.grid[1], asset.untill);
            if (this.prevPos < 0) {
                this.prevPos = asset.untill === 0 ? asset.grid[0] * asset.grid[1] : total - 0;
            }
            this.refreshPreviewCanvas();
        };
        /**
         * Switches to the next frame of the framed animation in the preview canvas
         */
        this.previewNext = () => {
            this.prevPos++;
            const {asset} = this.opts;
            const total = asset.untill === 0 ?
                asset.grid[0] * asset.grid[1] :
                Math.min(asset.grid[0] * asset.grid[1], asset.untill);
            if (this.prevPos >= total) {
                this.prevPos = 0;
            }
            this.refreshPreviewCanvas();
        };
        this.refreshPreviewCanvas = () => {
            const {asset} = this.opts;
            const xx = this.prevPos % asset.grid[0],
                  yy = Math.floor(this.prevPos / asset.grid[0]),
                  x = asset.offx + xx * (asset.marginx + asset.width),
                  y = asset.offy + yy * (asset.marginy + asset.height),
                  w = asset.width,
                  h = asset.height;
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
            const {asset} = this.opts;
            this.prevTime = window.setTimeout(() => {
                const total = Math.min(
                    asset.untill === 0 ? Infinity : asset.untill,
                    asset.grid[0] * asset.grid[1]
                );
                this.prevPos++;
                if (this.prevPos >= total) {
                    this.prevPos = 0;
                }
                this.refs.textureviewframe.innerHTML = `${this.prevPos} / ${total}`;
                if (!asset.tiled) {
                    this.refreshPreviewCanvas();
                }
                this.stepTexturePreview();
            }, 1000 / this.prevSpeed);
        };

        /**
         * Turns the collision mask shape to a circle and,
         * if it wasn't set before, sets the radius.
         */
        this.assetSelectCircle = function textureSelectCircle() {
            const {asset} = this.opts;
            asset.shape = 'circle';
            if (!('r' in asset) || asset.r === 0) {
                asset.r = Math.min(
                    Math.floor(asset.width / 2),
                    Math.floor(asset.height / 2)
                );
            }
        };
        /**
         * Turns the collision mask shape to a rectangle.
         */
        this.assetSelectRect = function textureSelectRect() {
            this.opts.asset.shape = 'rect';
            this.assetFillRect();
        };
        /**
         * Changes collision mask's type to a polygon and defines
         * starting points if none were set previously.
         */
        this.assetSelectStrip = function textureSelectStrip() {
            const {asset} = this.opts;
            asset.shape = 'strip';
            asset.stripPoints = asset.stripPoints || [];
            if (!asset.stripPoints.length) {
                const twoPi = Math.PI * 2;
                asset.closedStrip = true;
                for (let i = 0; i < 5; i++) {
                    asset.stripPoints.push({
                        x: Math.round(Math.sin(twoPi / 5 * i) * asset.width / 2),
                        y: -Math.round(Math.cos(twoPi / 5 * i) * asset.height / 2)
                    });
                }
            }
        };

        this.removeStripPoint = e => {
            if (this.opts.asset.symmetryStrip) {
                // Remove an extra point
                this.opts.asset.stripPoints.pop();
            }
            this.opts.asset.stripPoints.splice(e.item.ind, 1);
            e.preventDefault();
        };
        this.addStripPoint = () => {
            this.opts.asset.stripPoints.push({
                x: 0,
                y: 16
            });
        };
        this.addStripPointOnSegment = e => {
            const {asset} = this.opts;
            const offx = this.skeletonMode ? 0 : asset.offx,
                  offy = this.skeletonMode ? 0 : asset.offy;
            const {top, left} = textureCanvas.getBoundingClientRect();
            const point = {
                x: (e.pageX - left) / this.zoomFactor - asset.axis[0] - offx,
                y: (e.pageY - top) / this.zoomFactor - asset.axis[1] - offy
            };
            asset.stripPoints.splice(e.item.ind + 1, 0, point);
            if (asset.symmetryStrip) {
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
            const {asset} = this.opts;
            asset.closedStrip = !asset.closedStrip;
            if (!asset.closedStrip && asset.symmetryStrip) {
                this.onSymmetryChange();
            }
        };
        this.onSymmetryChange = () => {
            const {asset} = this.opts;
            if (asset.symmetryStrip) {
                asset.stripPoints = this.getMovableStripPoints();
            } else {
                const nbPointsToAdd = asset.stripPoints.length - 2;
                for (let i = 0; i < nbPointsToAdd; i++) {
                    this.addStripPoint();
                }
                asset.closedStrip = true; // Force closedStrip to true
            }

            asset.symmetryStrip = !asset.symmetryStrip;
            this.update();
        };
        this.startMoving = (which, point) => e => {
            if (e.button !== 0) {
                return;
            }
            const startX = e.screenX,
                  startY = e.screenY;
            if (which === 'axis') {
                // Skeletons' axis can't be changed
                if (this.skeletonMode) {
                    return;
                }
                const {asset} = this.opts;
                const [oldX, oldY] = asset.axis;
                const func = e => {
                    asset.axis[0] = (e.screenX - startX) / this.zoomFactor + oldX;
                    asset.axis[1] = (e.screenY - startY) / this.zoomFactor + oldY;
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
            const {asset} = this.opts;
            const offx = this.skeletonMode ? 0 : asset.offx,
                  offy = this.skeletonMode ? 0 : asset.offy;
            context.fillStyle = getSwatch('accent1');
            context.globalAlpha = 0.5;
            if (asset.shape === 'rect') {
                context.fillRect(
                    asset.axis[0] - asset.left + offx,
                    asset.axis[1] - asset.top + offy,
                    asset.right + asset.left,
                    asset.bottom + asset.top
                );
            } else if (asset.shape === 'circle') {
                context.beginPath();
                context.arc(
                    asset.axis[0] + offx,
                    asset.axis[1] + offy,
                    asset.r,
                    0, 2 * Math.PI
                );
                context.fill();
            } else if (asset.shape === 'strip' && asset.stripPoints.length) {
                context.strokeStyle = getSwatch('accent1');
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(
                    asset.stripPoints[0].x + asset.axis[0] + offx,
                    asset.stripPoints[0].y + asset.axis[1] + offy
                );
                for (let i = 1, l = asset.stripPoints.length; i < l; i++) {
                    context.lineTo(
                        asset.stripPoints[i].x + asset.axis[0] + offx,
                        asset.stripPoints[i].y + asset.axis[1] + offy
                    );
                }
                if (asset.closedStrip) {
                    context.closePath();
                }
                context.stroke();

                if (asset.symmetryStrip) {
                    const movablePoints = this.getMovableStripPoints();
                    const [axisPoint1] = movablePoints;
                    const axisPoint2 = movablePoints[movablePoints.length - 1];

                    // Draw symmetry axis
                    context.strokeStyle = getSwatch('act');
                    context.lineWidth = 3;
                    context.beginPath();
                    context.moveTo(
                        axisPoint1.x + asset.axis[0] + offx,
                        axisPoint1.y + asset.axis[1] + offy
                    );
                    context.lineTo(
                        axisPoint2.x + asset.axis[0] + offx,
                        axisPoint2.y + asset.axis[1] + offy
                    );
                    context.stroke();
                }
            }
        };

        /**
         * Redraws the canvas with the full image, its collision mask, and its slicing grid
         */
        this.refreshTextureCanvas = () => {
            const {asset} = this.opts;
            const tc = textureCanvas;
            tc.width = tc.img.width;
            tc.height = tc.img.height;
            const minSide = Math.min(asset.width, asset.height);
            tc.x.strokeStyle = getSwatch('act');
            tc.x.lineWidth = 1;
            tc.x.font = `${Math.min(24, minSide)}px sans-serif`;
            tc.x.textAlign = 'left';
            tc.x.textBaseline = 'top';
            tc.x.globalCompositeOperation = 'source-over';
            tc.x.clearRect(0, 0, tc.width, tc.height);
            tc.x.drawImage(tc.img, 0, 0);
            if (!asset.tiled && !this.skeletonMode) {
                const l = Math.min(
                    asset.grid[0] * asset.grid[1],
                    asset.untill || Infinity
                );
                for (let i = 0; i < l; i++) {
                    const xx = i % asset.grid[0],
                          yy = Math.floor(i / asset.grid[0]),
                          x = asset.offx + xx * (asset.marginx + asset.width),
                          y = asset.offy + yy * (asset.marginy + asset.height),
                          w = asset.width,
                          h = asset.height;
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

        /**
         * Saves the texture/skeleton and closes the opened window
         */
        this.assetSave = () => {
            if (this.nameTaken) {
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                const {soundbox} = require('./data/node_requires/3rdparty/soundbox');
                soundbox.play('Failure');
                return false;
            }
            glob.modified = true;
            const {asset} = this.opts;
            asset.lastmod = Number(new Date());
            if (!this.skeletonMode) {
                const {textureGenPreview, updatePixiTexture, updateDOMImage} = require('./data/node_requires/resources/textures');
                updateDOMImage(asset);
                updatePixiTexture(asset);
                textureGenPreview(asset, global.projdir + '/img/' + asset.origname + '_prev@2.png', 128);
                textureGenPreview(asset, global.projdir + '/img/' + asset.origname + '_prev.png', 64)
                .then(() => {
                    this.opts.onclose();
                });
            } else {
                // No need to update textures for skeletons => just close the window.
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
            if (!this.opts.asset) {
                return false;
            }
            const points = this.opts.asset.stripPoints;
            if (!this.opts.asset.symmetryStrip) {
                return points;
            }
            return points.slice(0, 2 + Math.round((points.length - 2) / 2));
        };
        this.getStripSegments = () => {
            if (!this.opts.asset) {
                return false;
            }
            const {asset} = this.opts;
            const offx = this.skeletonMode ? 0 : asset.offx,
                  offy = this.skeletonMode ? 0 : asset.offy;
            if (asset.shape !== 'strip') {
                return false;
            }

            const points = this.getMovableStripPoints();
            const segs = [];

            for (let i = 0; i < points.length; i++) {
                const point1 = points[i];
                const point2 = points[(i + 1) % points.length];

                const x1 = (point1.x + asset.axis[0] + offx) * this.zoomFactor;
                const y1 = (point1.y + asset.axis[1] + offy) * this.zoomFactor;
                const x2 = (point2.x + asset.axis[0] + offx) * this.zoomFactor;
                const y2 = (point2.y + asset.axis[1] + offy) * this.zoomFactor;
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
            const {asset} = this.opts;
            if (asset && asset.symmetryStrip) {
                const movablePoints = this.getMovableStripPoints();
                const [axisPoint1] = movablePoints;
                const axisPoint2 = movablePoints[movablePoints.length - 1];
                for (let i = 1; i < movablePoints.length - 1; i++) {
                    const j = asset.stripPoints.length - i;
                    const point = movablePoints[i];
                    const axisPoint = this.pointToLine(axisPoint1, axisPoint2, point);
                    asset.stripPoints[j] = {
                        x: 2 * axisPoint.x - point.x,
                        y: 2 * axisPoint.y - point.y
                    };
                }
            }
        };

