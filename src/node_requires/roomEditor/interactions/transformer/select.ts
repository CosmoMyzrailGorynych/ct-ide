import {IRoomEditorInteraction} from '../..';
import {Copy} from '../../entityClasses/Copy';
import {Tile} from '../../entityClasses/Tile';

interface IAffixedData {
    startRoomPos: PIXI.IPoint;
    startClientPos: PIXI.IPoint;
    startSelected: PIXI.DisplayObject;
    mode: 'pick' | 'add' | 'remove' | 'toggle';
}

const modifySet = (
    set: Set<PIXI.DisplayObject>,
    delta: PIXI.DisplayObject[],
    mode: IAffixedData['mode']
) => {
    switch (mode) {
    case 'add':
        for (const elt of delta) {
            set.add(elt);
        }
        break;
    case 'remove':
        for (const elt of delta) {
            set.delete(elt);
        }
        break;
    case 'toggle':
        for (const elt of delta) {
            if (set.has(elt)) {
                set.delete(elt);
            } else {
                set.add(elt);
            }
        }
        break;
    default:
        set.clear();
        for (const elt of delta) {
            set.add(elt);
        }
        break;
    }
};

const getCenter = function (obj: PIXI.DisplayObject, room: PIXI.Container): PIXI.IPoint {
    const bounds = obj.getBounds();
    const centerGlobal = new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    return room.toLocal(centerGlobal);
};

/**
 * An interaction that selects individual objects on clicks
 * and multiple ones on click+drag, in a rectangular selection.
 * Manages RoomEditor.marqueeBox position.
 *
 * Depending on what keys were pressed on selection start (ctrl, shift, alt),
 * the operation shifts between three different modes (toggle, add, remove)
 */
const select: IRoomEditorInteraction<IAffixedData> = {
    ifListener: 'pointerdown',
    if(e) {
        if (e.data.button !== 0) {
            return false;
        }
        return this.riotEditor.currentTool === 'select';
    },
    listeners: {
        pointerdown(e, riotTag, affixedData) {
            if (e.data.originalEvent.shiftKey) {
                affixedData.mode = 'add';
            } else if (e.data.originalEvent.ctrlKey) {
                affixedData.mode = 'toggle';
            } else if (e.data.originalEvent.altKey) {
                affixedData.mode = 'remove';
            } else {
                affixedData.mode = 'pick';
            }
            affixedData.startClientPos = e.data.global.clone();
            affixedData.startRoomPos = this.room.toLocal(e.data.global);
            this.marqueeBox.redrawBox(affixedData.startRoomPos.x, affixedData.startRoomPos.y, 0, 0);
            affixedData.startSelected = e.target;
        },
        pointermove(e, riotTag, affixedData) {
            const roomPos = this.room.toLocal(e.data.global);
            this.marqueeBox.visible = true;
            this.marqueeBox.redrawBox(
                affixedData.startRoomPos.x,
                affixedData.startRoomPos.y,
                roomPos.x - affixedData.startRoomPos.x,
                roomPos.y - affixedData.startRoomPos.y
            );
        },
        pointerup(e, riotTag, affixedData, callback) {
            // Apply any possible property changes to the previous selectio set
            this.riotEditor.refs.propertiesPanel.applyChanges();

            const selectMap: [boolean, Iterable<PIXI.DisplayObject>][] = [
                [this.selectCopies, this.copies],
                [this.selectTiles, this.tiles]
            ];
            const roomPos = this.room.toLocal(e.data.global);
            const dxClient = e.data.global.x - affixedData.startClientPos.x,
                  dyClient = e.data.global.y - affixedData.startClientPos.y;
            const lClient = Math.sqrt(dxClient ** 2 + dyClient ** 2);
            // Too small selections on a client scale count as clicks
            if (lClient < 8) {
                let s = affixedData.startSelected,
                    currentSelection;
                // Pick a suitable entity under the cursor (try both from pointerdown and pointerup)
                if ((s instanceof Copy && this.selectCopies) ||
                    (s instanceof Tile && this.selectTiles && !s.parent.isHidden)
                ) {
                    currentSelection = s;
                } else {
                    s = e.target;
                    if ((s instanceof Copy && this.selectCopies) ||
                        (s instanceof Tile && this.selectTiles && !s.parent.isHidden)
                    ) {
                        currentSelection = s;
                    }
                }
                if (currentSelection) {
                    modifySet(this.currentSelection, [s], affixedData.mode);
                } else if (affixedData.mode === 'pick') {
                    // If no keyboard modifiers were active and a user clicked, clear the selection
                    this.currentSelection.clear();
                }
            } else {
                // Rectangular selection
                // Loop through all the selectable elements in the room and put into the selection
                // those which *visible* centers are inside the rectangle (ignore pivots).
                const delta = [];
                const rect = new PIXI.Rectangle(
                    Math.min(affixedData.startRoomPos.x, roomPos.x),
                    Math.min(affixedData.startRoomPos.y, roomPos.y),
                    Math.abs(roomPos.x - affixedData.startRoomPos.x),
                    Math.abs(roomPos.y - affixedData.startRoomPos.y)
                );
                for (const selectType of selectMap) {
                    if (selectType[0]) {
                        for (const object of selectType[1]) {
                            if (object instanceof Tile && object.parent.isHidden) {
                                continue;
                            }
                            const {x, y} = getCenter(object, this.room);
                            if (rect.contains(x, y)) {
                                delta.push(object);
                            }
                        }
                    }
                }
                modifySet(this.currentSelection, delta, affixedData.mode);
            }
            this.transformer.setup();
            this.marqueeBox.visible = false;
            this.riotEditor.refs.propertiesPanel.updatePropList();
            callback();
        }
    }
};

select.listeners.pointerupoutside = select.listeners.pointerup;

export {select};
