import {IRoomEditorInteraction} from '..';
import {Copy} from '../entityClasses/Copy';
import {Tile} from '../entityClasses/Tile';
import {TileLayer} from '../entityClasses/TileLayer';

import {snapToDiagonalGrid, snapToRectangularGrid} from '../common';

import {getTemplateFromId} from '../../resources/templates';

export const copy: IRoomEditorInteraction<void> = {
    ifListener: 'copy',
    if() {
        return this.riotEditor.currentTool === 'select' && this.currentSelection.size > 0;
    },
    listeners: {
        copy(e, riotEditor, affixedData, callback) {
            this.clipboard.clear();
            for (const stuff of this.currentSelection) {
                if (stuff instanceof Copy) {
                    this.clipboard.add([
                        'copy',
                        stuff.serialize()
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
            callback();
        }
    }
};

export const paste: IRoomEditorInteraction<void> = {
    ifListener: 'paste',
    if() {
        return this.clipboard.size > 0;
    },
    listeners: {
        paste(e, riotEditor, affixedData, callback) {
            const createdSet = new Set<[Copy | Tile, TileLayer?]>();
            if (riotEditor.currentTool === 'select' &&
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
                        getTemplateFromId(template.uid);
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
            if (riotEditor.currentTool !== 'select') {
                riotEditor.setTool('select')();
                riotEditor.update();
            }
            this.transformer.setup(true);

            // place the stuff under mouse cursor but do take the grid into account
            const {mouse} = this.renderer.plugins.interaction;
            const mousePos = mouse.getLocalPosition(this.room);
            let dx = mousePos.x - this.transformer.transformPivotX,
                dy = mousePos.y - this.transformer.transformPivotY;
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
            riotEditor.refs.propertiesPanel.updatePropList();
            this.transformer.blink();
            callback();
        }
    }
};
