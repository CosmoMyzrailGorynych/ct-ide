emitter-tandem-editor.aPanel.aView.flexrow(class="{opts.class}")
    .flexfix(style="width: {panelWidth}px")
        .flexfix-body.flexrow
            emitter-editor(
                each="{emitter in asset.emitters}"
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
    .relative(ref="preview")
        canvas(
            ref="canvas"
            onpointermove="{onCanvasMove}"
            onpointerout="{resetEmitterPositioning}"
        )
        .emitter-tandem-editor-Tools.flexrow
            button.small.nogrow.forcebackground(onclick="{resetSelf}")
                span {voc.reset}
            .aSpacer
            button.small.nogrow.forcebackground(onclick="{openPreviewTexturePicker}")
                svg.feather
                    use(xlink:href="#texture")
                span {voc.setPreviewTexture}
            button.small.nogrow.forcebackground(onclick="{changeGrid}")
                svg.feather
                    use(xlink:href="#grid")
                span {voc.changeGrid}
            button.small.nogrow.forcebackground(onclick="{changePreviewBg}")
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
        assettypes="texture"
    )
    script.
        /* global net */
        const brehautColor = net.brehaut.Color;
        const PIXI = require('pixi.js');
        const particles = require('@pixi/particle-emitter');

        this.namespace = 'particleEmitters';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

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

        // Creates a new emitter
        this.spawnEmitter = (emitterData, container) => {
            const {getPixiTexture} = require('./data/node_requires/resources/textures');
            const textures = getPixiTexture(emitterData.texture, null, true);
            const settings = {
                ...emitterData.settings,
                behaviors: [
                    ...emitterData.settings.behaviors
                ]
            };
            // Add the texture behavior
            if (emitterData.textureBehavior === 'textureRandom') {
                settings.behaviors.push({
                    type: 'textureRandom',
                    config: {
                        textures
                    }
                });
            } else {
                settings.behaviors.push({
                    type: 'animatedSingle',
                    config: {
                        anim: {
                            framerate: emitterData.animatedSingleFramerate,
                            loop: true,
                            textures
                        }
                    }
                });
            }
            const emitter = new particles.Emitter(container, settings);
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
        this.resetEmitters = async (uid) => {
            if (uid && !this.asset.emitters.find(e => e.uid === uid)) {
                return;
            }
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
            const promisesSpawnEmitters = this.asset.emitters
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
        this.resetSelf = () => this.resetEmitters();
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
            if (this.asset.previewTexture && this.asset.previewTexture !== -1) {
                const textures = require('./data/node_requires/resources/textures');
                const pivot = textures.getTexturePivot(this.asset.previewTexture);
                [this.previewTexture.anchor.x, this.previewTexture.anchor.y] = pivot;
                this.previewTexture.texture = textures.getPixiTexture(this.asset.previewTexture, 0);
            } else {
                this.previewTexture.texture = PIXI.Texture.EMPTY;
            }
        };

        this.generateShapeVisualizers = () => {
            for (const emitter of this.asset.emitters) {
                if (!emitter.showShapeVisualizer) {
                    continue;
                }
                const emitterX = emitter.settings.pos.x,
                      emitterY = emitter.settings.pos.y;
                // eslint-disable-next-line prefer-destructuring
                const bh = emitter.settings.behaviors[5];
                const shapeType = bh.config?.type || bh.type;
                if (shapeType === 'torus') {
                    const circle = new PIXI.Graphics();
                    circle.lineStyle(2, 0x446adb, 1);
                    circle.beginFill(0x446adb, 0.27);
                    circle.drawCircle(emitterX, emitterY, bh.config.data.radius);
                    if (bh.config.data.innerRadius) {
                        circle.beginHole();
                        circle.drawCircle(emitterX, emitterY, bh.config.data.innerRadius);
                        circle.endHole();
                    }
                    circle.endFill();
                    this.visualizersContainer.addChild(circle);
                } else if (shapeType === 'rect') {
                    const rect = new PIXI.Graphics();
                    rect.lineStyle(2, 0x446adb, 1);
                    rect.beginFill(0x446adb, 0.27);
                    rect.drawRect(
                        emitterX + bh.config.data.x,
                        emitterY + bh.config.data.y,
                        bh.config.data.w,
                        bh.config.data.h
                    );
                    rect.endFill();
                    this.visualizersContainer.addChild(rect);
                } else if (shapeType === 'spawnBurst') {
                    const crosshair = new PIXI.Graphics();
                    crosshair.lineStyle(2, 0x446adb, 1);
                    for (let i = bh.config.start; i < 360; i += bh.config.spacing) {
                        const dir = i * Math.PI / 180;
                        crosshair.moveTo(emitterX, emitterY);
                        crosshair.lineTo(
                            emitterX + Math.cos(dir) * 64,
                            emitterY + Math.sin(dir) * 64
                        );
                    }
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

            this.pixiApp.stage.eventMode = 'dynamic';
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
            const ind = this.asset.emitters.indexOf(emitter);
            if (ind !== -1) {
                this.asset.emitters.splice(ind, 1);
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
            this.asset.emitters.push(defaultEmitter);
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
            this.pixiApp.renderer.background.color = Number('0x' + color.slice(1));
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
            this.asset.previewTexture = uid;
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

        this.saveAsset = () => {
            this.writeChanges();
            window.signals.trigger('tandemUpdated', this.asset);
        };
        this.apply = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };
