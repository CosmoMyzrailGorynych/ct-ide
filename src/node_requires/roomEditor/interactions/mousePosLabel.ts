import {IRoomEditorInteraction} from '..';

const updateMousePosition: IRoomEditorInteraction<void> = {
    ifListener: 'pointermove',
    if() {
        const x = Math.round(this.snapTarget.x * 100) / 100,
              y = Math.round(this.snapTarget.y * 100) / 100;
        this.pointerCoords.text = `(${x}; ${y})`;
        // This interaction never actually marks itself as valid
        return false;
    },
    listeners: {}
};

export {updateMousePosition};
