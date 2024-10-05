import {IRoomEditorInteraction} from '..';

import * as PIXI from 'pixi.js';

const updateMousePosition: IRoomEditorInteraction<void> = {
    ifListener: 'pointermove',
    if(e: PIXI.FederatedPointerEvent) {
        this.cursor.update(e);
        const {x, y} = this.snapTarget.position;
        const rx = Math.round(x * 100) / 100,
              ry = Math.round(y * 100) / 100;
        this.pointerCoords.text = `(${rx}; ${ry})`;
        // This interaction never actually marks itself as valid
        // so it never blocks the interaction stack
        return false;
    },
    listeners: {}
};

export {updateMousePosition};
