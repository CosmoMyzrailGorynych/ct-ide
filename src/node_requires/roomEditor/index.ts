import {History} from './history';

import {Copy} from './entityClasses/Copy';
import {Tile} from './entityClasses/Tile';
import {TileLayer} from './entityClasses/TileLayer';
import {Background} from './entityClasses/Background';
import {Viewport} from './entityClasses/Viewport';

import {SnapTarget} from './entityClasses/SnapTarget';
import {MarqueeBox} from './entityClasses/MarqueeBox';
import {Transformer} from './entityClasses/Transformer';
import {ViewportRestriction} from './entityClasses/ViewportRestriction';

import {IRoomEditorRiotTag} from './IRoomEditorRiotTag';
import {IRoomEditorInteraction, AllowedListener, allowedListeners, interactions} from './interactions';
import {getPixiSwatch} from './../themes';
import {defaultTextStyle, recolorFilters, eraseCursor} from './common';
import {ease} from 'node_modules/pixi-ease';

const roomEditorDefaults = {
    width: 10,
    height: 10,
    autoDensity: true,
    transparent: false,
    sharedLoader: true,
    sharedTicker: false,
    resolution: devicePixelRatio,
    antialias: true,
    preserveDrawingBuffer: true
};

export type tileClipboardData = ['tile', ITileTemplate, TileLayer];
export type copyClipboardData = ['copy', IRoomCopy];

class RoomEditor extends PIXI.Application {
    history = new History(this);
    riotEditor: IRoomEditorRiotTag;
    ctRoom: IRoom;
    currentSelection: Set<PIXI.Sprite> = new Set();
    clipboard: Set<tileClipboardData | copyClipboardData> = new Set();
    /** A sprite that catches any click events */
    clicktrap = new PIXI.Sprite(PIXI.Texture.WHITE);
    /** A small circle that shows currently snapped position and a ghost for copy/tile placement */
    snapTarget = new SnapTarget(this);
    /** A secondary ghost container for more complex prefabs and constructions */
    compoundGhost = new PIXI.Container();
    /**
     * An empty Container that will be used as a camera.
     * The camera provides inverted transforms for proper view placement.
     */
    camera = new PIXI.Container();
    /** An overlay showing current rectangular selection */
    marqueeBox = new MarqueeBox(this, 0, 0, 10, 10);
    /** A container for all the room's entities */
    room = new PIXI.Container();
    /** A container for viewport boxes, grid, and other overlays */
    overlays = new PIXI.Container();
    /** A free transform widget that exists in **global** coordinates. */
    transformer = new Transformer(this);
    primaryViewport: Viewport;
    restrictViewport: ViewportRestriction;
    grid = new PIXI.Graphics();
    /**
     * A label that will display current mouse coords relative to a room,
     * in a left-bottom corner. Useful for lining up things in a level.
     */
    pointerCoords = new PIXI.Text('(0;0)', defaultTextStyle);
    /**
     * Whether the room editor currently processes a user interaction.
     * While this is true, no new interactions can be started.
     */
    interacting = false;
    interactions: IRoomEditorInteraction<unknown>[];
    currentInteraction: IRoomEditorInteraction<unknown>;
    affixedInteractionData: unknown;

    copies = new Set<Copy>();
    tiles = new Set<Tile>();
    backgrounds: Background[] = [];
    viewports = new Set<Viewport>();
    tileLayers: TileLayer[] = [];

    /**
     * Creates a pixi.js app — a room editor
     * Its `stage` manipulates the camera, managing panning and zooming.
     * All the CRUD operations are in the Room class.
     *
     * @param {Object} opts A partial set of PIXI.Application options that must
     * include a mounting point (`view`)
     * @param {RiotTag} editor a tag instance of a `room-editor`
     */
    constructor(opts: unknown, editor: IRoomEditorRiotTag, pixelart: boolean) {
        super(Object.assign({}, roomEditorDefaults, opts, {
            resizeTo: editor.root,
            roundPixels: pixelart
        }));
        this.ticker.maxFPS = 60;

        const {room} = editor.opts;
        this.ctRoom = room;
        this.riotEditor = editor;

        this.clicktrap.alpha = 0;
        this.stage.addChild(this.clicktrap);
        this.resizeClicktrap();
        this.room.sortableChildren = true;

        this.camera.x = room.width / 2;
        this.camera.y = room.height / 2;
        this.stage.addChild(this.camera);

        this.stage.addChild(this.room);
        this.redrawGrid();
        this.overlays.addChild(this.grid);
        this.stage.addChild(this.overlays);
        this.compoundGhost.alpha = 0.5;
        this.overlays.addChild(this.compoundGhost);
        this.marqueeBox.visible = false;
        this.overlays.addChild(this.marqueeBox);
        this.overlays.addChild(this.snapTarget);
        this.deserialize(editor.opts.room);
        this.stage.addChild(this.transformer);

        this.pointerCoords.zIndex = Infinity;
        this.pointerCoords.x = 8;
        this.stage.addChild(this.pointerCoords);

        this.ticker.add(() => {
            this.resizeClicktrap();
            this.realignCamera();
            this.snapTarget.update();
            this.repositionCoordLabel();
            this.tickBackgrounds();
            this.tickCopies();
            if (this.transformer.visible) {
                this.transformer.updateFrame();
            }
            if (['addCopies', 'addTiles'].includes(this.riotEditor.currentTool)) {
                if (this.riotEditor.controlMode && ['default', 'inherit'].includes(this.view.style.cursor)) {
                    this.view.style.cursor = eraseCursor;
                    this.snapTarget.visible = false;
                }
                if (!this.riotEditor.controlMode && this.view.style.cursor.includes('Erase')) {
                    this.view.style.cursor = 'default';
                    this.snapTarget.visible = true;
                }
            }
        });

        this.stage.interactive = true;
        this.interactions = interactions;
        for (const event of allowedListeners) {
            this.stage.on(event, (e: PIXI.InteractionEvent) => {
                this.listen(e, event);
            });
        }

        // Riot's observable objects lose function's context, so pass an anonymous function instead
        this.updateTexturesHandle = (textureId: string) => this.updateTextures(textureId);
        this.updateCopiesHandle = (templateId: string) => this.updateCopies(templateId);
        window.signals.on('pixiTextureChanged', this.updateTexturesHandle);
        window.signals.on('templateChanged', this.updateCopiesHandle);
    }
    destroy(removeView: boolean, stageOptions: {
        children?: boolean;
        texture?: boolean;
        baseTexture?: boolean;
    }): void {
        window.signals.off('pixiTextureChanged', this.updateTexturesHandle);
        window.signals.off('templateChanged', this.updateCopiesHandle);
        super.destroy(removeView, stageOptions);
    }

    listen(event: PIXI.InteractionEvent, listener: AllowedListener): void {
        var callback = () => {
            this.interacting = false;
            this.currentInteraction = this.affixedInteractionData = void 0;
        };
        for (const interaction of this.interactions) {
            if (!this.interacting && interaction.ifListener === listener) {
                if (interaction.if.apply(this, [event, this.riotEditor])) {
                    this.interacting = true;
                    this.currentInteraction = interaction;
                    this.affixedInteractionData = {};
                    break;
                }
            }
        }
        for (const interaction of this.interactions) {
            if (this.interacting && this.currentInteraction === interaction) {
                if (listener in this.currentInteraction.listeners) {
                    this.currentInteraction.listeners[listener].apply(
                        this,
                        [event, this.riotEditor, this.affixedInteractionData, callback]
                    );
                }
            }
        }
    }

    deserialize(room: IRoom): void {
        this.simulate = room.simulate ?? true;
        this.renderer.backgroundColor = PIXI.utils.string2hex(room.backgroundColor);
        // Add primary viewport
        this.primaryViewport = new Viewport(room, true, this);
        this.restrictViewport = new ViewportRestriction(this);
        this.overlays.addChild(this.restrictViewport);
        this.overlays.addChild(this.primaryViewport);
        this.viewports.add(this.primaryViewport);
        // Add the remaining entities
        for (const bg of room.backgrounds) {
            this.addBackground(bg);
        }
        for (const copy of room.copies) {
            const pixiCopy = new Copy(copy, this);
            this.room.addChild(pixiCopy);
        }
        for (const tileLayer of room.tiles) {
            this.addTileLayer(tileLayer);
        }
    }
    serialize(): void {
        this.ctRoom.copies = [...this.copies].map(c => c.serialize());
        this.ctRoom.tiles = this.tileLayers.map(tl => tl.serialize());
        this.ctRoom.backgrounds = this.backgrounds.map(bg => bg.serialize());
        this.ctRoom.lastmod = Number(new Date());
    }

    /**
     * It is separated into a method to be usable externally.
     * room-tile-editor uses it to add new layers.
     */
    addTileLayer(tileLayer: ITileLayerTemplate | TileLayer, writeToHistory?: boolean): TileLayer {
        const pixiTileLayer = tileLayer instanceof TileLayer ?
            tileLayer :
            new TileLayer(tileLayer, this);
        if (this.colorizeTileLayers) {
            pixiTileLayer.filters = [recolorFilters[pixiTileLayer.id % 6]];
        }
        this.room.addChild(pixiTileLayer);
        this.tileLayers.push(pixiTileLayer);
        this.tileLayers.sort((a, b) => b.zIndex - a.zIndex);
        if (pixiTileLayer.children) {
            for (const tile of pixiTileLayer.children) {
                this.tiles.add(tile);
            }
        }
        if (writeToHistory) {
            this.history.pushChange({
                type: 'tileLayerCreation',
                created: pixiTileLayer
            });
        }
        return pixiTileLayer;
    }

    /**
     * It is separated as well to be usable by UI written with Riot.
     */
    addBackground(bgTemplate: IRoomBackground): Background {
        const bg = new Background(bgTemplate, this);
        this.backgrounds.push(bg);
        this.room.addChild(bg);
        return bg;
    }

    resizeClicktrap(): void {
        this.clicktrap.width = this.screen.width;
        this.clicktrap.height = this.screen.height;
    }
    redrawGrid(): void {
        const w = this.ctRoom.gridX,
              h = this.ctRoom.gridY;
        this.grid.clear();
        if (!this.riotEditor.gridOn) {
            // Grid isn't needed
            return;
        }
        // Don't draw too fine grid
        if (w / this.camera.scale.x < 8 || h / this.camera.scale.y < 8) {
            return;
        }
        this.grid.lineStyle(this.camera.scale.x, getPixiSwatch('act'), 0.3);
        // Camera boundaries with extra tiles around the border
        const cw = this.screen.width * this.camera.scale.x + w * 2,
              ch = this.screen.height * this.camera.scale.y + h * 2,
              cx = this.camera.x - this.screen.width / 2 * this.camera.scale.x - w,
              cy = this.camera.y - this.screen.height / 2 * this.camera.scale.y - h;
        const xstart = cx;
        const ystart = cy;
        this.grid.x = -(cx % w);
        this.grid.y = -(cy % h);
        if (this.ctRoom.diagonalGrid) {
            const angle1 = Math.atan(h / w);
            const angle2 = Math.PI - angle1;
            const cos1 = Math.cos(angle1),
                  cos2 = Math.cos(angle2),
                  sin1 = Math.sin(angle1),
                  sin2 = Math.sin(angle2);
            const max = Math.sqrt(cw * cw + ch * ch);
            for (let x = xstart; x < cx + cw; x += w) {
                this.grid.moveTo(x, cy);
                this.grid.lineTo(x + cos1 * max, cy + sin1 * max);
                this.grid.moveTo(x, cy);
                this.grid.lineTo(x + cos2 * max, cy + sin2 * max);
            }
            for (let y = ystart + h; y < cy + ch; y += h) {
                this.grid.moveTo(cx, y);
                this.grid.lineTo(cx + cos1 * max, y + sin1 * max);
            }
            const cwCorrected = Math.ceil(cw / w) * w;
            for (let y = ystart; y < cy + ch; y += h) {
                this.grid.moveTo(cx + cwCorrected, y);
                this.grid.lineTo(cx + cwCorrected + cos2 * max, y + sin2 * max);
            }
        } else {
            for (let x = xstart; x < cx + cw; x += w) {
                this.grid.moveTo(x, cy);
                this.grid.lineTo(x, cy + ch);
            }
            for (let y = ystart; y < cy + ch; y += h) {
                this.grid.moveTo(cx, y);
                this.grid.lineTo(cx + cw, y);
            }
        }
    }
    redrawViewports(): void {
        for (const viewport of this.viewports) {
            viewport.redrawFrame();
        }
        this.restrictViewport.redrawFrame();
    }
    /**
     * Updates room position based on the camera position.
     * @returns {void}
     */
    realignCamera(): void {
        this.room.transform.setFromMatrix(this.camera.worldTransform
            .clone()
            .invert()
            .translate(
                this.view.width / devicePixelRatio / 2,
                this.view.height / devicePixelRatio / 2
            ));
        this.overlays.transform = this.room.transform;
        this.redrawGrid();
        this.redrawViewports();
    }
    tickBackgrounds(): void {
        for (const background of this.backgrounds) {
            background.tick(this.ticker.deltaTime);
        }
    }
    tickCopies(): void {
        if (!this.simulate) {
            return;
        }
        for (const copy of this.copies) {
            copy.update(this.ticker.deltaTime);
        }
    }
    repositionCoordLabel(): void {
        this.pointerCoords.y = this.screen.height - 30;
    }

    updateTextures(textureId: string): void {
        for (const child of this.room.children) {
            if (child instanceof Copy) {
                if (child.cachedTemplate.texture === textureId) {
                    child.refreshTexture();
                }
            } else if (child instanceof Tile) {
                if (child.tileTexture === textureId) {
                    child.refreshTexture();
                }
            } else if (child instanceof Background) {
                if (child.bgTexture === textureId) {
                    child.refreshTexture();
                }
            }
        }
    }
    updateCopies(templateId: string): void {
        for (const child of this.room.children) {
            if (child instanceof Copy) {
                if (child.templateId === templateId) {
                    child.refreshTexture();
                }
            }
        }
    }
    updateTexturesHandle: (textureId: string) => void;
    updateCopiesHandle: (templateId: string) => void;

    #simulate: boolean;
    get simulate(): boolean {
        return this.#simulate;
    }
    set simulate(value: boolean) {
        this.#simulate = value;
        if (this.#simulate) {
            this.ticker.speed = 1;
        } else {
            this.ticker.speed = 0;
        }
    }

    #copiesVisible = true;
    #tilesVisible = true;
    #backgroundsVisible = true;
    #xrayMode = false;
    #colorizeTileLayers = false;
    get copiesVisible(): boolean {
        return this.#copiesVisible;
    }
    set copiesVisible(value: boolean) {
        value = Boolean(value);
        if (value === this.#copiesVisible) {
            return;
        }
        this.#copiesVisible = value;
        for (const copy of this.copies) {
            copy.visible = this.#copiesVisible;
        }
    }
    get tilesVisible(): boolean {
        return this.#tilesVisible;
    }
    set tilesVisible(value: boolean) {
        value = Boolean(value);
        if (value === this.#tilesVisible) {
            return;
        }
        this.#tilesVisible = value;
        for (const layer of this.tileLayers) {
            layer.visible = this.#tilesVisible;
        }
    }
    get backgroundsVisible(): boolean {
        return this.#backgroundsVisible;
    }
    set backgroundsVisible(value: boolean) {
        value = Boolean(value);
        if (value === this.#backgroundsVisible) {
            return;
        }
        this.#backgroundsVisible = value;
        for (const bg of this.backgrounds) {
            bg.visible = this.#backgroundsVisible;
        }
    }
    get xrayMode(): boolean {
        return this.#xrayMode;
    }
    set xrayMode(value: boolean) {
        this.#xrayMode = Boolean(value);
        this.room.alpha = this.#xrayMode ? 0.5 : 1;
    }
    get colorizeTileLayers(): boolean {
        return this.#colorizeTileLayers;
    }
    set colorizeTileLayers(value: boolean) {
        this.#colorizeTileLayers = Boolean(value);
        for (const layer of this.tileLayers) {
            if (this.#colorizeTileLayers) {
                layer.filters = [recolorFilters[layer.id % 6]];
            } else {
                layer.filters = [];
            }
            layer.visible = this.#tilesVisible;
        }
    }

    #selectCopies = true;
    #selectTiles = true;
    get selectCopies(): boolean {
        return this.#selectCopies;
    }
    set selectCopies(value: boolean) {
        value = Boolean(value);
        this.#selectCopies = value;
    }
    get selectTiles(): boolean {
        return this.#selectTiles;
    }
    set selectTiles(value: boolean) {
        value = Boolean(value);
        this.#selectTiles = value;
    }

    goHome(): void {
        this.riotEditor.zoom = 1;
        ease.add(this.camera, {
            x: this.ctRoom.width / 2,
            y: this.ctRoom.height / 2,
            scale: 1
        }, {
            duration: 500
        })
        .on('each', () => {
            this.riotEditor.refs.zoomLabel.innerHTML = `${Math.round(this.getZoom())}%`;
        });
    }
    zoomTo(zoom: number): void {
        const scale = 1 / zoom * 100;
        ease.add(this.camera, {
            scale
        }, {
            duration: 500
        })
        .on('each', () => {
            this.riotEditor.refs.zoomLabel.innerHTML = `${Math.round(this.getZoom())}%`;
        });
    }
    getZoom(): number {
        // Somehow, when updating a room-editor tag, it loses camera but not the editor itself
        return this.camera ? (1 / this.camera.scale.x * 100) : 100;
    }

    /**
     * Returns a base64 string of a room's main viewport.
     * It is expected to be run when the room editor is no longer needed,
     * as it repositions the room.
     */
    getSplashScreen(big: boolean): HTMLCanvasElement {
        const w = big ? 340 : 64,
              h = big ? 256 : 64;
        const renderTexture = PIXI.RenderTexture.create({
            width: w,
            height: h
        });
        this.overlays.visible = false;
        this.transformer.visible = false;
        this.pointerCoords.visible = false;
        this.clicktrap.width = w;
        this.clicktrap.height = h;
        this.clicktrap.alpha = 1;
        this.clicktrap.tint = this.renderer.backgroundColor;
        this.room.scale.set(Math.min(w / this.ctRoom.width, h / this.ctRoom.height));
        this.room.x = (w - this.ctRoom.width * this.room.scale.x) / 2;
        this.room.y = (h - this.ctRoom.height * this.room.scale.y) / 2;
        this.renderer.render(this.stage, renderTexture);
        return this.renderer.extract.canvas(renderTexture);
    }
}


const setup = (canvas: HTMLCanvasElement, editorTag: IRoomEditorRiotTag): RoomEditor => {
    const pixelart = Boolean(currentProject.settings.rendering.pixelatedrender);
    editorTag.pixiEditor = new RoomEditor({
        view: canvas
    }, editorTag, pixelart);
    return editorTag.pixiEditor;
};


export {
    setup,
    IRoomEditorInteraction,
    RoomEditor
};
