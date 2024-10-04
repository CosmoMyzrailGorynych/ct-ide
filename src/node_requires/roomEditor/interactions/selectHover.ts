import {IRoomEditorInteraction} from '..';
import {Tile} from '../entityClasses/Tile';
import {Copy} from '../entityClasses/Copy';

import * as PIXI from 'pixi.js';

export const selectHover: IRoomEditorInteraction<void> = {
    ifListener: 'pointerover',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'select') {
            return false;
        }
        if (e.target instanceof Copy && this.selectCopies) {
            this.setHoverSelection(e.target);
            return false;
        }
        if (e.target instanceof Tile && this.selectTiles) {
            this.setHoverSelection(e.target);
            return false;
        }
        // This interaction never actually marks itself as valid
        // so it never blocks the interaction stack
        return false;
    },
    listeners: {}
};

