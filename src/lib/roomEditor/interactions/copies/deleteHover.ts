import {IRoomEditorInteraction} from '../..';
import {Copy} from '../../entityClasses/Copy';

import * as PIXI from 'pixi.js';

export const deleteHover: IRoomEditorInteraction<void> = {
    ifListener: 'pointerover',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'addCopies' || !e.ctrlKey) {
            return false;
        }
        if (e.target instanceof Copy) {
            this.setHoverSelection(e.target);
        }
        // This interaction never actually marks itself as valid
        // so it never blocks the interaction stack
        return false;
    },
    listeners: {}
};

