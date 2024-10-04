import {IRoomEditorInteraction} from '..';

export const clearHover: IRoomEditorInteraction<void> = {
    ifListener: 'pointerout',
    if() {
        this.unhover();
        // This interaction never actually marks itself as valid
        // so it never blocks the interaction stack
        return false;
    },
    listeners: {}
};

