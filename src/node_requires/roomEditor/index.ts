import {History} from './history';
import {RoomEditorPreview} from './previewer';

import {ViewportFrame} from './entityClasses/ViewportFrame';

import {Copy} from './entityClasses/Copy';
import {Tile} from './entityClasses/Tile';
import {resetCounter as resetTileLayerCounter, TileLayer} from './entityClasses/TileLayer';
import {Background} from './entityClasses/Background';

import {SnapTarget} from './entityClasses/SnapTarget';
import {MarqueeBox} from './entityClasses/MarqueeBox';
import {Transformer, getAnchor} from './entityClasses/Transformer';
import {Viewport} from './entityClasses/Viewport';
import {ViewportRestriction} from './entityClasses/ViewportRestriction';
import {AlignFrame} from './entityClasses/AlignFrame';

import {IRoomEditorRiotTag} from './IRoomEditorRiotTag';
import {IRoomEditorInteraction, PixiListener, pixiListeners, interactions, customListeners, CustomListener} from './interactions';
import {getById} from '../resources';
import {getPixiSwatch} from './../themes';
import {defaultTextStyle, recolorFilters, eraseCursor, toPrecision, snapToDiagonalGrid, snapToRectangularGrid} from './common';
import {ease, Easing} from 'node_modules/pixi-ease';

import {rotateRad} from '../utils/trigo';

import * as PIXI from 'node_modules/pixi.js';
import 'node_modules/@pixi/events';

class Cursor {
    x: number;
    y: number;
    snapTarget: SnapTarget;
    getLocalPosition(
        displayObject: PIXI.DisplayObject,
        point: PIXI.IPointData,
        globalPos?: PIXI.IPointData
    ): PIXI.IPointData {
        return displayObject.worldTransform.applyInverse(globalPos || this, point);
    }
    update(e: PIXI.FederatedPointerEvent) {
        this.x = e.global.x;
        this.y = e.global.y;
        if (this.snapTarget) {
            this.snapTarget.update();
        }
    }
}

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
    currentSelection: Set<Copy | Tile> = new Set();
    currentUiSelection: Copy | void;
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
    cursor = new Cursor();
    /** An overlay showing current rectangular selection */
    marqueeBox = new MarqueeBox(this, 0, 0, 10, 10);
    /** A container for all the room's entities */
    room = new PIXI.Container();
    /** A container for viewport boxes, grid, and other overlays */
    overlays = new PIXI.Container();
    /**
     * A Graphics instance used to draw selection frames on top of entities,
     * used in several tools to highlight the current selection.
     * See this.drawSelection method to actually draw it.
     */
    selectionOverlay = new PIXI.Graphics();
    /** A free transform widget that exists in **global** coordinates. */
    transformer = new Transformer(this);
    primaryViewport: Viewport;
    restrictViewport: ViewportRestriction;
    alignFrame: AlignFrame;
    grid = new PIXI.Graphics();
    /**
     * A label that will display current mouse coords relative to a room,
     * in a left-bottom corner. Useful for lining up things in a level.
     */
    pointerCoords = new PIXI.Text('(0;0)', defaultTextStyle);
    /**
     * A label that will follow mouse cursor and display entities' relevant names
     * like template name, used sound asset, etc.
     */
    mouseoverHint = new PIXI.Text('Unknown', defaultTextStyle);
    /**
     * A reference to the latest moused over entity.
     * Entities on the map hide the hint only if they were the latest one hovered.
     */
    mouseoverHintPrev: unknown;
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
    viewports = new Set<ViewportFrame>();
    tileLayers: TileLayer[] = [];

    observable: {
        on<T>(eventName: CustomListener, fn: ((eventData: T) => void)): void;
        off(eventName: CustomListener, fn: ((eventData: unknown) => void)): void;
        trigger(eventName: CustomListener, eventData: unknown): void;
    };

    /**
     * Creates a pixi.js app — a room editor
     * Its `stage` manipulates the camera, managing panning and zooming.
     * All the CRUD operations are in the Room class.
     *
     * @param {Object} opts A partial set of PIXI.Application options that must
     * include a mounting point (`view`)
     * @param {RiotTag} editor a tag instance of a `room-editor`
     */
    // eslint-disable-next-line max-lines-per-function
    constructor(opts: unknown, editor: IRoomEditorRiotTag, pixelart: boolean) {
        super(Object.assign({}, roomEditorDefaults, opts, {
            resizeTo: editor.root,
            roundPixels: pixelart
        }));
        this.ticker.maxFPS = 60;
        this.observable = riot.observable();

        const room = editor.asset;
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
        this.deserialize(editor.room as IRoom);
        this.stage.addChild(this.selectionOverlay);
        this.stage.addChild(this.transformer);

        this.pointerCoords.zIndex = Infinity;
        this.pointerCoords.x = 8;
        this.stage.addChild(this.pointerCoords);

        this.mouseoverHint.zIndex = Infinity;
        this.mouseoverHint.visible = false;
        this.mouseoverHint.anchor.set(0, 1);
        this.stage.addChild(this.mouseoverHint);

        this.ticker.add(() => {
            this.resizeClicktrap();
            this.realignCamera();
            // Update positions of various on-screen elements to reflect camera changes
            this.snapTarget.update();
            this.repositionCoordLabel();
            this.repositionMouseoverHint();
            this.tickBackgrounds();
            this.tickCopies();
            // Redraw selection frames & transformer
            if (this.transformer.visible) {
                this.transformer.updateFrame();
            }
            // Redraw selection frame
            if (this.riotEditor.currentTool === 'uiTools' && this.currentUiSelection) {
                this.drawSelection([this.currentUiSelection]);
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

        this.stage.eventMode = 'static';
        this.interactions = interactions;
        for (const event of pixiListeners) {
            this.stage.on(event, (e: PIXI.FederatedEvent) => {
                this.listen(e, event);
            });
        }
        for (const event of customListeners) {
            this.observable.on(event, (e: ((eventData: KeyboardEvent | unknown) => void)) => {
                this.listen(e, event);
            });
        }

        // Riot's observable objects lose function's context, so pass an anonymous function instead
        this.updateTexturesHandle = (textureId: string) => this.updateTextures(textureId);
        this.updateCopiesHandle = (templateId: string) => this.updateCopies(templateId);
        this.cleanupTemplatesHandle = (templateId: string) => this.cleanupTemplates(templateId);
        window.signals.on('pixiTextureChanged', this.updateTexturesHandle);
        window.signals.on('templateChanged', this.updateCopiesHandle);
        window.signals.on('templatesChanged', this.updateCopiesHandle);
        window.signals.on('templateRemoved', this.cleanupTemplatesHandle);
    }
    destroy(removeView: boolean, stageOptions: {
        children?: boolean;
        texture?: boolean;
        baseTexture?: boolean;
    }): void {
        window.signals.off('pixiTextureChanged', this.updateTexturesHandle);
        window.signals.off('templateChanged', this.updateCopiesHandle);
        window.signals.off('templatesChanged', this.updateCopiesHandle);
        window.signals.off('templateRemoved', this.cleanupTemplates);
        super.destroy(removeView, stageOptions);
    }

    listen(
        event: PIXI.FederatedEvent | KeyboardEvent | unknown,
        listener: PixiListener | CustomListener
    ): void {
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

    /**
     * Destroys all the PIXI instances of copies, tiles, and backgrounds,
     * and recreates the room's entities again. Useful when a full state
     * refresh is needed, e.g. when used templates changed base classes.
     */
    recreate(): void {
        this.serialize(false);
        this.room.removeChildren();
        this.copies.clear();
        this.tiles.clear();
        this.backgrounds.length = 0;
        this.currentSelection.clear();
        this.clipboard.clear();
        this.deserialize(this.ctRoom);
    }

    deserialize(room: IRoom): void {
        this.simulate = room.simulate ?? true;
        (this.renderer as PIXI.Renderer).background.color =
            PIXI.utils.string2hex(room.backgroundColor ?? '#000000');
        // Add primary viewport
        this.primaryViewport = new Viewport(room, true, this);
        this.restrictViewport = new ViewportRestriction(this);
        this.alignFrame = new AlignFrame(this);
        this.overlays.addChild(this.restrictViewport);
        this.overlays.addChild(this.alignFrame);
        this.overlays.addChild(this.primaryViewport);
        this.viewports.add(this.primaryViewport);
        // Add the remaining entities
        for (const bg of room.backgrounds) {
            this.addBackground(bg);
        }
        for (const copy of room.copies) {
            try {
                const pixiCopy = new Copy(copy, this);
                this.room.addChild(pixiCopy);
            } catch (e) {
                console.error(e);
                window.alertify.error(e.message);
            }
        }
        for (const tileLayer of room.tiles) {
            this.addTileLayer(tileLayer);
        }
    }
    serialize(deepCopy = false): void {
        this.ctRoom.copies = [...this.copies].map(c => c.serialize(deepCopy));
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
            if (viewport instanceof Viewport) {
                viewport.redrawFrame();
            }
        }
        this.restrictViewport.redrawFrame();
        this.alignFrame.redrawFrame();
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
            copy.sprite?.update(this.ticker.deltaTime);
        }
    }
    deleteSelected(): void {
        if (this.riotEditor.currentTool !== 'select') {
            return;
        }
        const changes = new Set<[Copy | Tile, TileLayer?]>();
        for (const stuff of this.currentSelection) {
            if (stuff instanceof Tile) {
                const {parent} = stuff;
                changes.add([stuff.detach(), parent]);
            } else if (stuff instanceof Copy) {
                changes.add([stuff.detach()]);
            }
        }
        this.history.pushChange({
            type: 'deletion',
            deleted: changes
        });
        this.transformer.clear();
        this.riotEditor.refs.propertiesPanel.updatePropList();
    }
    copySelection(): void {
        if (this.riotEditor.currentTool !== 'select' || !this.currentSelection.size) {
            return;
        }
        this.clipboard.clear();
        for (const stuff of this.currentSelection) {
            if (stuff instanceof Copy) {
                this.clipboard.add([
                    'copy',
                    stuff.serialize(true)
                ]);
            } else if (stuff instanceof Tile) {
                this.clipboard.add([
                    'tile',
                    stuff.serialize(),
                    stuff.parent
                ]);
            }
        }
        this.transformer.blink();
    }
    pasteSelection(): void {
        const createdSet = new Set<[Copy | Tile, TileLayer?]>();
        if (this.riotEditor.currentTool === 'select' &&
            this.currentSelection.size &&
            this.history.currentChange?.type === 'transformation'
        ) {
            this.history.snapshotTransforms();
        }
        this.transformer.clear();
        const extraTileLayer = this.tileLayers.find(tl => tl.zIndex === 0) || new TileLayer({
            depth: 0,
            tiles: []
        }, this);
        for (const copied of this.clipboard) {
            let created;
            if (copied[0] === 'tile') {
                const [, template, layer] = copied;
                const target = this.tileLayers.includes(layer) ? layer : extraTileLayer;
                created = new Tile(template, this, false);
                target.addChild(created);
                createdSet.add([created, target]);
            } else if (copied[0] === 'copy') {
                const [, template] = copied;
                // Skip copies that no longer exist in the project
                try {
                    getById('template', template.uid);
                    created = new Copy(template, this, false);
                    this.room.addChild(created);
                    createdSet.add([created]);
                } catch (_) {
                    continue;
                }
            } else {
                // Unsupported selectable entity
                continue;
            }
            this.currentSelection.add(created);
        }
        if (extraTileLayer.children.length && !this.tileLayers.includes(extraTileLayer)) {
            this.addTileLayer(extraTileLayer);
            this.history.pushChange({
                type: 'tileLayerCreation',
                created: extraTileLayer
            });
        } else {
            extraTileLayer.destroy();
        }
        this.history.pushChange({
            type: 'creation',
            created: createdSet
        });
        if (this.riotEditor.currentTool !== 'select') {
            this.riotEditor.setTool('select')();
            this.riotEditor.update();
        }
        this.transformer.setup(true);

        // place the stuff under mouse cursor but do take the grid into account
        const {x, y} = this.snapTarget.position;
        let dx = x - this.transformer.transformPivotX,
            dy = y - this.transformer.transformPivotY;
        if (this.riotEditor.gridOn) {
            const snap = this.ctRoom.diagonalGrid ? snapToDiagonalGrid : snapToRectangularGrid;
            const snapped = snap({
                x: dx,
                y: dy
            }, this.ctRoom.gridX, this.ctRoom.gridY);
            dx = snapped.x;
            dy = snapped.y;
        }
        this.transformer.transformPivotX += dx;
        this.transformer.transformPivotY += dy;
        this.transformer.applyTranslateX += dx;
        this.transformer.applyTranslateY += dy;
        this.transformer.applyTransforms();
        this.transformer.setup();
        this.riotEditor.refs.propertiesPanel.updatePropList();
        this.transformer.blink();
    }
    drawSelection(entities: Iterable<Copy | Tile>): void {
        this.selectionOverlay.clear();
        this.selectionOverlay.visible = true;
        for (const entity of entities) {
            const w = entity.width,
                  h = entity.height,
                  anchor = getAnchor(entity),
                  // IDK why this works
                  px = Math.sign(entity.scale.x) === -1 ? 1 - anchor.x : anchor.x,
                  py = Math.sign(entity.scale.y) === -1 ? 1 - anchor.y : anchor.y,
                  {x, y} = this.room.toGlobal(entity.position),
                  sx = this.camera.scale.x,
                  sy = this.camera.scale.y;
            const tl = rotateRad(-w * px, -h * py, entity.rotation),
                  tr = rotateRad(w * (1 - px), -h * py, entity.rotation),
                  bl = rotateRad(-w * px, h * (1 - py), entity.rotation),
                  br = rotateRad(w * (1 - px), h * (1 - py), entity.rotation);
            // this.selectionOverlay.lineStyle(3, getPixiSwatch('act'));
            this.selectionOverlay.lineStyle(1, getPixiSwatch('background'));
            this.selectionOverlay.beginFill(getPixiSwatch('act'), 0.15);
            this.selectionOverlay.moveTo(x + tl[0] / sx, y + tl[1] / sy);
            this.selectionOverlay.lineTo(x + tr[0] / sx, y + tr[1] / sy);
            this.selectionOverlay.lineTo(x + br[0] / sx, y + br[1] / sy);
            this.selectionOverlay.lineTo(x + bl[0] / sx, y + bl[1] / sy);
            this.selectionOverlay.lineTo(x + tl[0] / sx, y + tl[1] / sy);
            this.selectionOverlay.endFill();
            // this.selectionOverlay.lineStyle(1, getPixiSwatch('background'));
            // this.selectionOverlay.moveTo(x + tl[0] / sx, y + tl[1] / sy);
            // this.selectionOverlay.lineTo(x + tr[0] / sx, y + tr[1] / sy);
            // this.selectionOverlay.lineTo(x + br[0] / sx, y + br[1] / sy);
            // this.selectionOverlay.lineTo(x + bl[0] / sx, y + bl[1] / sy);
            // this.selectionOverlay.lineTo(x + tl[0] / sx, y + tl[1] / sy);
        }
    }
    /** Cleans the graphic overlay used to highlight selected copies. */
    clearSelectionOverlay(): void {
        this.selectionOverlay.clear();
        this.selectionOverlay.visible = false;
    }
    /**
     * Rounds up the values of current selection to fix rounding errors
     * that appear due to global-to-local transformations
     * coming from the Transformer class.
     */
    dropPrecision(): void {
        for (const elt of this.currentSelection) {
            elt.x = toPrecision(elt.x, 8);
            elt.y = toPrecision(elt.y, 8);
            elt.scale.x = toPrecision(elt.scale.x, 8);
            elt.scale.y = toPrecision(elt.scale.y, 8);
        }
    }
    repositionCoordLabel(): void {
        this.pointerCoords.y = this.screen.height - 30;
    }
    repositionMouseoverHint(): void {
        if (!this.mouseoverHint.visible) {
            return;
        }
        const {pointer} = this.renderer.plugins.interaction;
        this.mouseoverHint.x = pointer.global.x + 8;
        this.mouseoverHint.y = pointer.global.y;
    }

    updateMouseoverHint(text: string, newRef: unknown): void {
        this.mouseoverHint.text = text;
        this.mouseoverHintPrev = newRef;
        this.mouseoverHint.visible = true;
    }
    mouseoverOut(ref: unknown): void {
        if (this.mouseoverHintPrev === ref) {
            this.mouseoverHint.visible = false;
        }
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
                    child.recreate();
                }
            }
        }
    }
    cleanupTemplates(templateId: string): void {
        // eslint-disable-next-line no-console
        console.warn('cleanup for', templateId);
        let cleaned = false;
        for (const child of this.room.children) {
            if (child instanceof Copy) {
                if (child.templateId === templateId) {
                    cleaned = true;
                    child.destroy();
                }
            }
        }
        if (cleaned) {
            this.history.stack.length = 0; // invalidate history
            this.currentSelection.clear();
            this.riotEditor.update();
        }
    }
    updateTexturesHandle: (textureId: string) => void;
    updateCopiesHandle: (templateId: string) => void;
    cleanupTemplatesHandle: (templateId: string) => void;

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

    repositionUiCopies(newWidth: number, newHeight: number): void {
        // Skip reposisioning for non-UI rooms as gameplay rooms *probably* won't need it.
        if (!this.ctRoom.isUi) {
            return;
        }
        const oldWidth = this.ctRoom.width;
        const oldHeight = this.ctRoom.height;

        for (const copy of this.copies) {
            if (!copy.align) {
                continue;
            }
            // get the old reference frame
            const {padding, frame} = copy.align;
            const xref = oldWidth * frame.x1 / 100 + padding.left,
                  yref = oldHeight * frame.y1 / 100 + padding.top;
            const wref = oldWidth * (frame.x2 - frame.x1) / 100 - padding.left - padding.right,
                  href = oldHeight * (frame.y2 - frame.y1) / 100 - padding.top - padding.bottom;
            // get the new reference frame
            const xnew = newWidth * frame.x1 / 100 + padding.left,
                  ynew = newHeight * frame.y1 / 100 + padding.top;
            const wnew = newWidth * (frame.x2 - frame.x1) / 100 - padding.left - padding.right,
                  hnew = newHeight * (frame.y2 - frame.y1) / 100 - padding.top - padding.bottom;
            if (oldWidth !== newWidth) {
                switch (copy.align.alignX) {
                case 'start':
                    copy.x += xnew - xref;
                    break;
                case 'both':
                    copy.x += xnew - xref;
                    copy.width += wnew - wref;
                    break;
                case 'end':
                    copy.x += wnew - wref + xnew - xref;
                    break;
                case 'center':
                    copy.x += (wnew - wref) / 2 + xnew - xref;
                    break;
                case 'scale': {
                    const k = wnew / wref || 1;
                    copy.width *= k;
                    copy.x = (copy.x - xref) * k + xnew;
                } break;
                default:
                }
            }

            if (oldHeight !== newHeight) {
                switch (copy.align.alignY) {
                case 'start':
                    copy.y += ynew - yref;
                    break;
                case 'both':
                    copy.y += ynew - yref;
                    copy.height += hnew - href;
                    break;
                case 'end':
                    copy.y += hnew - href + ynew - yref;
                    break;
                case 'center':
                    copy.y += (hnew - href) / 2 + ynew - yref;
                    break;
                case 'scale': {
                    const k = hnew / href || 1;
                    copy.height *= k;
                    copy.y = (copy.y - yref) * k + ynew;
                } break;
                default:
                }
            }
            if (copy.nineSlicePlane) {
                copy.updateNinePatch();
            }
        }
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
    /**
     * @param {Number} zoom Zoom value, in percents
     */
    zoomTo(zoom: number): Easing {
        // @see https://github.com/ct-js/ct-js/issues/407
        zoom = Math.min(8_000, Math.max(zoom, 1)); // Clamp zoom to avoid flickering
        const scale = 1 / zoom * 100;
        return ease.add(this.camera, {
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
        return RoomEditor.getRoomPreview(this.ctRoom, big);
    }
    static getRoomPreview(room: IRoom, big: boolean): HTMLCanvasElement {
        const w = big ? 340 : 64,
              h = big ? 256 : 64;
        const renderTexture = PIXI.RenderTexture.create({
            width: w,
            height: h
        });
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const pixelart = Boolean(currentProject.settings.rendering.pixelatedrender);
        const scale = Math.min(w / room.width, h / room.height);
        const preview = new RoomEditorPreview({
            view: canvas
        }, room, pixelart, {
            x: (w - room.width * scale) / 2,
            y: (h - room.height * scale) / 2,
            scale
        });
        preview.renderer.render(preview.stage, {
            renderTexture
        });
        const out = preview.renderer.extract.canvas(renderTexture) as HTMLCanvasElement;
        preview.destroy(false, {
            children: true,
            texture: false,
            baseTexture: false
        });
        return out;
    }
}

const setup = (canvas: HTMLCanvasElement, editorTag: IRoomEditorRiotTag): RoomEditor => {
    resetTileLayerCounter();
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
