import {IRoomEditorInteraction} from '../..';
import {Tile} from '../../entityClasses/Tile';

import * as PIXI from 'pixi.js';

export const deleteHover: IRoomEditorInteraction<void> = {
    ifListener: 'pointerover',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'addTiles' || !e.ctrlKey) {
            return false;
        }
        if (e.target instanceof Tile) {
            if (this.riotEditor.currentTileLayer.children.includes(e.target)) {
                this.setHoverSelection(e.target);
            }
        }
        // This interaction never actually marks itself as valid
        // so it never blocks the interaction stack
        return false;
    },
    listeners: {}
};

