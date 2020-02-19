emitter-tandem-editor.panel.view.flexrow
    .flexfix(style="width: {panelWidth}px")
        .flexfix-header
            .panel.pad
                b {vocGlob.name}
                br
                input.wide(type="text" value="{tandem.name}" onchange="{wire('this.tandem.name')}")
                .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nametaken}
        .flexfix-body.flexrow
            emitter-editor(
                each="{emitter in tandem.emitters}"
                emitter="{emitter}"
                emittermap="{parent.uidToEmitterMap}"
            )
            button.emitter-tandem-editor-anAddEmitterButton(onclick="{addEmitter}")
                svg.feather
                    use(xlink:href="data/icons.svg#plus")
                span {voc.addEmitter}
        .flexfix-footer
            button.wide(onclick="{apply}")
                svg.feather
                    use(xlink:href="data/icons.svg#check")
                span {vocGlob.apply}
    .aResizer.vertical(onmousedown="{gutterMouseDown}")
    div(ref="preview")
        canvas(
            ref="canvas"
            onmousewheel="{onCanvasWheel}"
            onpointermove="{onCanvasMove}"
            onpointerout="{resetEmitterPositioning}"
        )
        button.emitter-tandem-editor-aResetEmittersButton(onclick="{resetEmitters}")
            span {voc.reset}
        button.emitter-tandem-editor-aChangeBgButton(onclick="{changePreviewBg}")
            svg.feather
                use(xlink:href="data/icons.svg#droplet")
            span {voc.changeBg}
        .zoom
            b(if="{window.innerWidth - panelWidth > 500}") {vocGlob.zoom}
            div.button-stack
                button.inline(if="{window.innerWidth - panelWidth > 320}" onclick="{setZoom(0.125)}" class="{active: zoom === 0.125}") 12%
                button.inline(onclick="{setZoom(0.25)}" class="{active: zoom === 0.25}") 25%
                button.inline(if="{window.innerWidth - panelWidth > 320}" onclick="{setZoom(0.5)}" class="{active: zoom === 0.5}") 50%
                button.inline(onclick="{setZoom(1)}" class="{active: zoom === 1}") 100%
                button.inline(onclick="{setZoom(2)}" class="{active: zoom === 2}") 200%
                button.inline(if="{window.innerWidth - panelWidth > 320}" onclick="{setZoom(4)}" class="{active: zoom === 4}") 400%
    color-picker(
        ref="previewBackgroundColor" if="{changingPreviewColor}"
        hidealpha="true"
        color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"
    )
    script.
        this.tandem = this.opts.tandem;

        this.namespace = 'particleEmitters';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.previewColor = localStorage.tandemEditorPreviewBg || '#cccccc';
        this.complete = false;

        /*
            Rendering and spawning emitters
        */
        const PIXI = require('pixi.js-legacy');
        this.uidToEmitterMap = {};

        this.awaitCompletion = [];
        // Creates a new emitter
        this.spawnEmitter = async (emitterData, container) => {
            const particles = require('pixi-particles');
            const {getPixiTexture} = require('./data/node_requires/resources/textures');
            const textures = await getPixiTexture(emitterData.texture, null, true);
            const emitter = new particles.Emitter(
                container,
                textures,
                emitterData.settings
            );
            emitter.emit = true;
            if (emitterData.settings.delay < 0) { // this needs to be prewarmed
                emitter.update(-emitterData.settings.delay);
            } else if (emitterData.settings.delay > 0) { // this needs to be delayed
                emitter.emit = false;
                setTimeout(() => { // will capture the emitter in memory and create a temporary leak, but if delays are not longer than hours, we can ignore it
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
            await Promise.all(
                this.tandem.emitters
                .map(emitterData => this.spawnEmitter(emitterData, this.emitterContainer))
            ).then(emitters =>
                this.emitterInstances.push(...emitters)
            );
            this.update(); // Need to update the riot tag so that editors get their link to emitter instances
        };
        // Advances emitter simulation by a given amount of seconds
        this.updateEmitters = seconds => {
            for (const emitter of this.emitterInstances) {
                emitter.update(seconds);
            }
        };

        // Fits the canvas to the available space
        this.updatePreviewLayout = () => {
            if (this.renderer && this.refs.canvas) {
                const box = this.refs.preview.getBoundingClientRect();
                const canvas = this.refs.canvas;
                canvas.width = Math.round(box.width);
                canvas.height = Math.round(box.height);
                this.renderer.resize(canvas.width, canvas.height);
                this.emitterContainer.x = canvas.width / 2;
                this.emitterContainer.y = canvas.height / 2;
                this.emitterContainer.scale.x = this.emitterContainer.scale.y = this.zoom;
            }
        };

        this.on('mount', () => {
            window.addEventListener('resize', this.updatePreviewLayout);

            const box = this.refs.preview.getBoundingClientRect();

            this.renderer = new PIXI.Application({
                width: Math.round(box.width),
                height: Math.round(box.height),
                view: this.refs.canvas,
                antialias: !currentProject.settings.pixelatedrender
            });
            if (currentProject.settings.pixelatedrender) {
                PIXI.settings.ROUND_PIXELS = true;
                PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            }

            this.renderer.renderer.backgroundColor = Number('0x'+this.previewColor.slice(1));
            this.emitterContainer = new PIXI.Container();
            this.renderer.stage.addChild(this.emitterContainer);
            this.inspector = new PIXI.Text('', {
                fill: 0xFFFFFF,
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAngle: Math.PI * 0.75,
                fontSize: 16
            });
            this.inspector.x = this.inspector.y = 12;
            this.renderer.ticker.add((delta) => {
                this.updateEmitters(delta / (this.renderer.ticker.maxFPS || 60));
                this.inspector.text = `FPS: ${Math.round(1 / this.renderer.ticker.deltaMS * 1000)} / ${this.renderer.ticker.maxFPS || 60}\n` +
                    this.emitterInstances.map(e => `${e.particleCount} / ${e.maxParticles}`).join('\n') +
                    (this.complete? '\n'+this.voc.inspectorComplete : '');
            });
            this.renderer.stage.addChild(this.inspector);

            this.resetEmitters();
            this.updatePreviewLayout();

            window.signals.on('emitterResetRequest', this.resetEmitters);
        });
        this.on('unmount', () => {
            window.removeEventListener('resize', this.updatePreviewLayout);
            window.signals.off('emitterResetRequest', this.resetEmitters);
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
        this.addEmitter = e => {
            const defaultEmitter = require('./data/node_requires/resources/particles/defaultEmitter').get();
            this.tandem.emitters.push(defaultEmitter);
            this.resetEmitters();
        };
        this.changePreviewBg = e => {
            this.changingPreviewColor = !this.changingPreviewColor;
            if (this.changingPreviewColor) {
                this.oldPreviewColor = this.previewColor;
            }
        };
        this.updatePreviewColor = (color, evtype) => {
            this.previewColor = localStorage.tandemEditorPreviewBg = color;
            this.renderer.renderer.backgroundColor = Number('0x'+color.slice(1));
            if (evtype === 'onapply') {
                this.changingPreviewColor = false;
            }
            this.update();
        };
        this.cancelPreviewColor = () => {
            this.changingPreviewColor = false;
            this.previewColor = localStorage.tandemEditorPreviewBg = this.oldPreviewColor;
            this.renderer.renderer.backgroundColor = Number('0x'+this.previewColor.slice(1));
            this.update();
        };

        /* Zoom in/out by clicking buttons and scrolling mouse wheel */

        this.zoom = 1;
        this.setZoom = zoom => e => {
            this.zoom = zoom;
            if (this.emitterContainer) {
                this.emitterContainer.scale.x = this.emitterContainer.scale.y = this.zoom;
            }
        };
        this.onCanvasWheel = e => {
            if (e.wheelDelta > 0) {
                // in
                if (this.zoom === 2) {
                    this.zoom = 4;
                } else if (this.zoom === 1) {
                    this.zoom = 2;
                } else if (this.zoom === 0.5) {
                    this.zoom = 1;
                } else if (this.zoom === 0.25) {
                    this.zoom = 0.5;
                } else if (this.zoom === 0.125) {
                    this.zoom = 0.25;
                }
            } else {
                // out
                if (this.zoom === 4) {
                    this.zoom = 2;
                } else if (this.zoom === 2) {
                    this.zoom = 1;
                } else if (this.zoom === 1) {
                    this.zoom = 0.5;
                } else if (this.zoom === 0.5) {
                    this.zoom = 0.25;
                } else if (this.zoom === 0.25) {
                    this.zoom = 0.125;
                }
            }
            this.emitterContainer.scale.x = this.emitterContainer.scale.y = this.zoom;
        };

        this.onCanvasMove = e => {
            const box = this.refs.canvas.getBoundingClientRect();
            const dx = (e.offsetX - box.width / 2) / this.zoom,
                  dy = (e.offsetY - box.height / 2) / this.zoom;
            for (const emitter of this.emitterInstances) {
                emitter.updateOwnerPos(dx, dy);
            }
        };
        this.resetEmitterPositioning = e => {
            for (const emitter of this.emitterInstances) {
                emitter.updateOwnerPos(0, 0);
            }
        };

        /*
            Logic of resizeable panel goes here
        */
        const minSizeW = 20 * 16;
        const getMaxSizeW = () => window.innerWidth - 128;
        this.panelWidth = Math.max(minSizeW, Math.min(getMaxSizeW(), localStorage.particlesPanelWidth || 20 * 32));
        this.gutterMouseDown = e => {
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

        this.apply = e => {
            this.parent.editingTandem = false;
            this.parent.update();
            window.signals.trigger('tandemUpdated', this.tandem);
        };
