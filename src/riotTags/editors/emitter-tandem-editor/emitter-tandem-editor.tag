emitter-tandem-editor.aPanel.aView.flexrow
    .flexfix(style="width: {panelWidth}px")
        .flexfix-header
            .aPanel.pad.nbt.nbl.nbr
                b {vocGlob.name}
                br
                input.wide(type="text" value="{tandem.name}" onchange="{wire('this.tandem.name')}")
                .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nameTaken}
        .flexfix-body.flexrow
            emitter-editor(
                each="{emitter in tandem.emitters}"
                emitter="{emitter}"
                emittermap="{parent.uidToEmitterMap}"
            )
            button.emitter-tandem-editor-anAddEmitterButton(onclick="{addEmitter}")
                svg.feather
                    use(xlink:href="#plus")
                span {voc.addEmitter}
        .flexfix-footer
            button.wide(onclick="{apply}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    .aResizer.vertical(onmousedown="{gutterMouseDown}")
    div(ref="preview")
        canvas(
            ref="canvas"
            onpointermove="{onCanvasMove}"
            onpointerout="{resetEmitterPositioning}"
        )
        .emitter-tandem-editor-Tools.flexrow
            button.nogrow.forcebackground(onclick="{resetEmitters}")
                span {voc.reset}
            .aSpacer
            button.nogrow.forcebackground(onclick="{openPreviewTexturePicker}")
                svg.feather
                    use(xlink:href="#texture")
                span {voc.setPreviewTexture}
            button.nogrow.forcebackground(onclick="{changeGrid}")
                svg.feather
                    use(xlink:href="#grid")
                span {voc.changeGrid}
            button.nogrow.forcebackground(onclick="{changePreviewBg}")
                svg.feather
                    use(xlink:href="#droplet")
                span {voc.changeBg}
        .zoom.flexrow
            b.aContrastingPlaque
                span(if="{window.innerWidth - panelWidth > 550}") {vocGlob.zoom}
                |
                |
                b {Math.round(zoom * 100)}%
            .aSpacer
            zoom-slider(onchanged="{setZoom}" ref="zoomslider" value="{zoom}")
    color-picker(
        ref="previewBackgroundColor" if="{changingPreviewColor}"
        hidealpha="true"
        color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"
    )
    asset-selector(
        if="{pickingPreviewTexture}"
        allownone="yes"
        onselected="{onPreviewTexturePicked}"
        oncancelled="{onPreviewTextureCancel}"
        assettype="textures"
    )
    script.
        /* global net */
        const brehautColor = net.brehaut.Color;
        const PIXI = require('pixi.js');
        const particles = require('@pixi/particle-emitter');

        this.tandem = this.opts.asset;

        this.namespace = 'particleEmitters';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.previewColor = localStorage.tandemEditorPreviewBg || '#cccccc';
        this.complete = false;

        this.gridSize = [64, 64];
        if ('tandemEditorGridSize' in localStorage) {
            this.gridSize = JSON.parse(localStorage.tandemEditorGridSize);
        }

        /*
            Rendering and spawning emitters
        */
        this.uidToEmitterMap = {};

        this.awaitCompletion = [];

        const {upgradeConfig} = require('@pixi/particle-emitter');

        // Creates a new emitter
        this.spawnEmitter = async (emitterData, container) => {
            const {getPixiTexture} = require('./data/node_requires/resources/textures');
            const textures = await getPixiTexture(emitterData.texture, null, true);
            const v3config = upgradeConfig(emitterData.settings, textures);
            console.log(v3config);
            const emitter = new particles.Emitter(container, v3config);
            /*const emitter = new particles.Emitter(
                container,
                textures,
                emitterData.settings
            );*/
            emitter.emit = true;
            if (emitterData.settings.delay < 0) { // this needs to be prewarmed
                emitter.update(-emitterData.settings.delay);
            } else if (emitterData.settings.delay > 0) { // this needs to be delayed
                emitter.emit = false;
                // will capture the emitter in memory and create a temporary leak,
                // but if delays are not longer than hours, we can ignore it
                setTimeout(() => {
                    emitter.emit = true;
                }, emitterData.settings.delay * 1000);
            }
            this.uidToEmitterMap[emitterData.uid] = emitter;
            this.awaitCompletion.push(emitter);
            emitter.playOnce(() => {
                const ind = this.awaitCompletion.indexOf(emitter);
                if (ind !== -1) {
                    this.awaitCompletion.splice(ind, 1);
                    if (!this.awaitCompletion.length) {
                        this.complete = true;
                        this.resetOnCompletionTimeout = setTimeout(this.resetEmitters, 1000);
                    }
                }
            });
            return emitter;
        };

        // Recreates all the emitters
        this.resetEmitters = async () => {
            this.visualizersContainer.removeChildren();
            this.awaitCompletion = [];
            this.complete = false;
            if (this.resetOnCompletionTimeout) {
                clearTimeout(this.resetOnCompletionTimeout);
                this.resetOnCompletionTimeout = null;
            }
            if (this.emitterInstances && this.emitterInstances.length) {
                for (const emitter of this.emitterInstances) {
                    emitter.destroy();
                }
            }
            this.emitterInstances = [];
            this.uidToEmitterMap = {};
            const promisesSpawnEmitters = this.tandem.emitters
                  .map(emitterData => this.spawnEmitter(emitterData, this.emitterContainer));
            await Promise.all(promisesSpawnEmitters)
                  .then(emitters => this.emitterInstances.push(...emitters));
            if (this.refs.canvas) {
                const box = this.refs.canvas.getBoundingClientRect();
                this.visualizersContainer.x = box.width / 2;
                this.visualizersContainer.y = box.height / 2;
            }
            this.generateShapeVisualizers();
            // Need to update the riot tag
            // so that editors get their link to emitter instances
            this.update();
        };
        // Advances emitter simulation by a given amount of seconds
        this.updateEmitters = seconds => {
            for (const emitter of this.emitterInstances) {
                emitter.update(seconds);
            }
        };

        // Fits the canvas to the available space
        this.updatePreviewLayout = () => {
            if (this.pixiApp && this.refs.canvas) {
                const box = this.refs.preview.getBoundingClientRect();
                const {canvas} = this.refs;
                this.pixiApp.renderer.resize(box.width, box.height);
                this.pixiApp.render(); // Avoid flicker during continuous panel resize
                this.emitterContainer.x = canvas.width / 2;
                this.emitterContainer.y = canvas.height / 2;
                this.visualizersContainer.x = this.previewTexture.x = this.emitterContainer.x;
                this.visualizersContainer.y = this.previewTexture.y = this.emitterContainer.y;
                this.emitterContainer.scale.x =
                    this.emitterContainer.scale.y =
                    this.visualizersContainer.scale.x =
                    this.visualizersContainer.scale.y =
                        this.zoom;
                this.updateGrid();
            }
            if (this.tandem.previewTexture && this.tandem.previewTexture !== -1) {
                const textures = require('./data/node_requires/resources/textures');
                const pivot = textures.getTexturePivot(this.tandem.previewTexture);
                [this.previewTexture.anchor.x, this.previewTexture.anchor.y] = pivot;
                this.previewTexture.texture = textures.getPixiTexture(this.tandem.previewTexture, 0);
            } else {
                this.previewTexture.texture = PIXI.Texture.EMPTY;
            }
        };

        this.generateShapeVisualizers = () => {
            for (const emitter of this.tandem.emitters) {
                if (!emitter.showShapeVisualizer) {
                    continue;
                }
                const emitterX = emitter.settings.pos.x,
                      emitterY = emitter.settings.pos.y;
                if (emitter.settings.spawnType === 'point') {
                    const crosshair = new PIXI.Graphics();
                    crosshair.lineStyle(2, 0x446adb, 1);
                    crosshair.moveTo(0, -64);
                    crosshair.lineTo(0, 64);
                    crosshair.moveTo(-64, 0);
                    crosshair.lineTo(64, 0);
                    crosshair.x = emitterX;
                    crosshair.y = emitterY;
                    this.visualizersContainer.addChild(crosshair);
                } else if (emitter.settings.spawnType === 'circle' || emitter.settings.spawnType === 'ring') {
                    const circle = new PIXI.Graphics();
                    circle.lineStyle(2, 0x446adb, 1);
                    circle.beginFill(0x446adb, 0.27);
                    circle.drawCircle(emitterX, emitterY, emitter.settings.spawnCircle.r);
                    if (emitter.settings.spawnType === 'ring') {
                        circle.beginHole();
                        circle.drawCircle(emitterX, emitterY, emitter.settings.spawnCircle.minR);
                        circle.endHole();
                    }
                    circle.endFill();
                    this.visualizersContainer.addChild(circle);
                } else if (emitter.settings.spawnType === 'rect') {
                    const rect = new PIXI.Graphics();
                    rect.lineStyle(2, 0x446adb, 1);
                    rect.beginFill(0x446adb, 0.27);
                    rect.drawRect(
                        emitterX + emitter.settings.spawnRect.x,
                        emitterY + emitter.settings.spawnRect.y,
                        emitter.settings.spawnRect.w,
                        emitter.settings.spawnRect.h
                    );
                    rect.endFill();
                    this.visualizersContainer.addChild(rect);
                } else if (emitter.settings.spawnType === 'burst') {
                    const crosshair = new PIXI.Graphics();
                    crosshair.lineStyle(2, 0x446adb, 1);
                    crosshair.drawStar(
                        emitterX, emitterY,
                        emitter.settings.particlesPerWave,
                        64, 16,
                        Math.PI * (0.5 + emitter.settings.angleStart / 180)
                    );
                    this.visualizersContainer.addChild(crosshair);
                }
            }
        };

        this.updateGrid = () => {
            if (!this.grid || !this.emitterContainer) {
                return;
            }

            const dark = brehautColor(this.previewColor).getLuminance() > 0.5;
            this.grid.blendMode = dark ? PIXI.BLEND_MODES.MULTIPLY : PIXI.BLEND_MODES.ADD;

            this.grid.width = this.refs.canvas.width;
            this.grid.height = this.refs.canvas.height;
            this.grid.tilePosition.x = Math.round(this.emitterContainer.x);
            this.grid.tilePosition.y = Math.round(this.emitterContainer.y);

            this.grid.texture = this.gridGen([
                this.gridSize[0] * this.zoom,
                this.gridSize[1] * this.zoom
            ], dark ? '#ddd' : '#222');
        };

        this.on('mount', () => {
            window.addEventListener('resize', this.updatePreviewLayout);
            window.signals.on('emitterResetRequest', this.resetEmitters);
        });
        this.on('unmount', () => {
            window.removeEventListener('resize', this.updatePreviewLayout);
            window.signals.off('emitterResetRequest', this.resetEmitters);
        });
        this.on('mount', () => {
            const box = this.refs.preview.getBoundingClientRect();

            this.gridGen = require('./data/node_requires/generators/gridTexture').generatePixiTextureGrid;
            this.grid = new PIXI.TilingSprite(this.gridGen());

            this.pixiApp = new PIXI.Application({
                width: Math.round(box.width),
                height: Math.round(box.height),
                sharedTicker: false,
                view: this.refs.canvas,
                antialias: !global.currentProject.settings.rendering.pixelatedrender
            });
            if (global.currentProject.settings.rendering.pixelatedrender) {
                PIXI.settings.ROUND_PIXELS = true;
                PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            }

            this.pixiApp.renderer.backgroundColor = Number('0x' + this.previewColor.slice(1));
            this.visualizersContainer = new PIXI.Container();
            this.previewTexture = new PIXI.Sprite(PIXI.Texture.EMPTY);
            this.previewTexture.alpha = 0.5;
            this.emitterContainer = new PIXI.Container();
            this.inspector = new PIXI.Text('', {
                fill: 0xFFFFFF,
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAngle: Math.PI * 0.75,
                fontSize: 16
            });
            this.inspector.x = this.inspector.y = 12;
            this.pixiApp.ticker.add((delta) => {
                this.updateEmitters(delta / (this.pixiApp.ticker.maxFPS || 60));
                this.inspector.text = `FPS: ${Math.round(1 / this.pixiApp.ticker.deltaMS * 1000)} / ${this.pixiApp.ticker.maxFPS || 60}\n` +
                    this.emitterInstances.map(e => `${e.particleCount} / ${e.maxParticles}`).join('\n') +
                    (this.complete ? '\n' + this.voc.inspectorComplete : '');
            });
            this.pixiApp.stage.addChild(this.previewTexture);
            this.pixiApp.stage.addChild(this.grid);
            this.pixiApp.stage.addChild(this.emitterContainer);
            this.pixiApp.stage.addChild(this.inspector);
            this.pixiApp.stage.addChild(this.visualizersContainer);

            this.pixiApp.stage.interactive = true;
            this.pixiApp.stage.on('wheel', this.onCanvasWheel);

            this.resetEmitters();
            this.updatePreviewLayout();
        });
        this.on('unmount', () => {
            this.emitterContainer = void 0;
            if (this.pixiApp) {
                this.pixiApp.ticker.stop();
                this.pixiApp.destroy();
            }
            if (this.resetOnCompletionTimeout) {
                clearTimeout(this.resetOnCompletionTimeout);
                this.resetOnCompletionTimeout = null;
            }
        });

        this.deleteEmitter = emitter => {
            const ind = this.tandem.emitters.indexOf(emitter);
            if (ind !== -1) {
                this.tandem.emitters.splice(ind, 1);
            } else {
                throw new Error('An attempt to delete a non-existing emitter ', emitter);
            }
            this.resetEmitters();
        };

        /*
            UI events
        */
        this.addEmitter = () => {
            const defaultEmitter = require('./data/node_requires/resources/emitterTandems/defaultEmitter').get();
            this.tandem.emitters.push(defaultEmitter);
            this.resetEmitters();
        };
        this.changePreviewBg = () => {
            this.changingPreviewColor = !this.changingPreviewColor;
            if (this.changingPreviewColor) {
                this.oldPreviewColor = this.previewColor;
            }
        };
        this.updatePreviewColor = (color, evtype) => {
            this.previewColor = localStorage.tandemEditorPreviewBg = color;
            this.pixiApp.renderer.backgroundColor = Number('0x' + color.slice(1));
            if (evtype === 'onapply') {
                this.changingPreviewColor = false;
            }
            this.updateGrid();
            this.update();
        };
        this.cancelPreviewColor = () => {
            this.changingPreviewColor = false;
            this.previewColor = localStorage.tandemEditorPreviewBg = this.oldPreviewColor;
            this.pixiApp.renderer.backgroundColor = Number('0x' + this.previewColor.slice(1));
            this.update();
        };
        this.changeGrid = () => {
            window.alertify
            .confirm(`${this.voc.newGridSize}<br/><input type="number" value="${this.gridSize[0]}" style="width: 6rem;" min=2 id="theGridSizeX"> x <input type="number" value="${this.gridSize[1]}" style="width: 6rem;" min=2 id="theGridSizeY">`)
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    this.gridSize[0] = Number(document.getElementById('theGridSizeX').value);
                    this.gridSize[1] = Number(document.getElementById('theGridSizeY').value);
                    localStorage.tandemEditorGridSize = JSON.stringify(this.gridSize);
                    this.updateGrid();
                }
            });
        };

        this.openPreviewTexturePicker = () => {
            this.pickingPreviewTexture = true;
        };
        this.onPreviewTexturePicked = uid => {
            this.tandem.previewTexture = uid;
            this.pickingPreviewTexture = false;
            this.updatePreviewLayout();
            this.update();
        };
        this.onPreviewTextureCancel = () => {
            this.pickingPreviewTexture = false;
            this.update();
        };

        /* Zoom in/out by clicking buttons and scrolling mouse wheel */

        this.zoom = 1;
        this.setZoom = zoom => {
            this.zoom = zoom;
            if (this.emitterContainer) {
                this.emitterContainer.scale.x = this.emitterContainer.scale.y = this.zoom;
            }
            this.emitterContainer.scale.x =
                this.emitterContainer.scale.y =
                this.visualizersContainer.scale.x =
                this.visualizersContainer.scale.y =
                this.previewTexture.scale.x =
                this.previewTexture.scale.y =
                    this.zoom;
            this.updateGrid();
            this.update();
        };
        this.onCanvasWheel = e => {
            if (e.deltaY < 0) {
                this.refs.zoomslider.zoomIn();
            } else {
                this.refs.zoomslider.zoomOut();
            }
        };

        this.onCanvasMove = e => {
            // When hovering a preview pane, emitters follow the mouse.
            // Can be used by game developers to see how their effects look in motion.
            e.preventUpdate = true;
            const box = this.refs.canvas.getBoundingClientRect();
            const dx = (e.offsetX - box.width / 2) / this.zoom,
                  dy = (e.offsetY - box.height / 2) / this.zoom;
            for (const emitter of this.emitterInstances) {
                emitter.updateOwnerPos(dx, dy);
            }
            this.visualizersContainer.x = e.offsetX;
            this.visualizersContainer.y = e.offsetY;
        };
        this.resetEmitterPositioning = e => {
            e.preventUpdate = true;
            for (const emitter of this.emitterInstances) {
                emitter.updateOwnerPos(0, 0);
            }
            const box = this.refs.canvas.getBoundingClientRect();
            this.visualizersContainer.x = box.width / 2;
            this.visualizersContainer.y = box.height / 2;
        };

        /*
            Logic of resizeable panel goes here
        */
        const minSizeW = 20 * 16;
        const getMaxSizeW = () => window.innerWidth - 128;
        const savedPanelWidth = localStorage.particlesPanelWidth || (20 * 32);
        this.panelWidth = Math.max(minSizeW, Math.min(savedPanelWidth, getMaxSizeW()));
        this.gutterMouseDown = () => {
            this.draggingGutter = true;
        };
        const gutterMove = e => {
            if (!this.draggingGutter) {
                return;
            }
            this.panelWidth = Math.max(minSizeW, Math.min(getMaxSizeW(), e.clientX));
            localStorage.particlesPanelWidth = this.panelWidth;
            this.update();
            this.updatePreviewLayout();
        };
        const gutterUp = () => {
            if (this.draggingGutter) {
                this.draggingGutter = false;
            }
        };
        document.addEventListener('mousemove', gutterMove);
        document.addEventListener('mouseup', gutterUp);
        this.on('unmount', () => {
            document.removeEventListener('mousemove', gutterMove);
            document.removeEventListener('mouseup', gutterUp);
        });

        this.apply = () => {
            this.parent.editingTandem = false;
            this.parent.update();
            require('./data/node_requires/glob').modified = true;
            window.signals.trigger('tandemUpdated', this.tandem);
        };
