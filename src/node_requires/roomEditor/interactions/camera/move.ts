import {IRoomEditorInteraction} from '..';

interface IMoveCameraAffixedData {
    cameraFromPos: {
        x: number,
        y: number
    },
    fromOffsetPos: {
        x: number,
        y: number
    }
}

const moveCameraOnWheelPress: IRoomEditorInteraction<IMoveCameraAffixedData> = {
    ifListener: 'pointerdown',
    if(e) {
        // Checks for a pressed mouse wheel
        return e.data.button === 1;
    },
    listeners: {
        pointerdown(e, roomTag, affixedData) {
            affixedData.cameraFromPos = {
                x: this.camera.x,
                y: this.camera.y
            };
            affixedData.fromOffsetPos = {
                x: e.data.global.x,
                y: e.data.global.y
            };
        },
        pointermove(e, roomTag, affixedData) {
            const cfp = affixedData.cameraFromPos,
                  op = affixedData.fromOffsetPos;
            this.camera.x = cfp.x + (op.x - e.data.global.x) * this.camera.scale.x;
            this.camera.y = cfp.y + (op.y - e.data.global.y) * this.camera.scale.y;
            this.camera.updateTransform();
            this.tickBackgrounds();
        },
        pointerup: (e, roomTag, affixedData, callback) => {
            callback();
        }
    }
};
moveCameraOnWheelPress.listeners.pointerupoutside = moveCameraOnWheelPress.listeners.pointerup;

export {moveCameraOnWheelPress};
