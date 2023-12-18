import * as PIXI from 'node_modules/pixi.js';

import {IRoomEditorInteraction} from '..';
import {Copy} from '../entityClasses/Copy';

const selectUi: IRoomEditorInteraction<never> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent) {
        if (e.button !== 0) {
            return false;
        }
        return this.riotEditor.currentTool === 'uiTools';
    },
    listeners: {
        pointerdown(e: PIXI.FederatedPointerEvent, riotTag, affixedData, callback) {
            if (e.target instanceof Copy) {
                this.currentUiSelection = e.target;
                this.drawSelection([this.currentUiSelection]);
                this.history.initiateUiChange();
            } else {
                this.clearSelectionOverlay();
                this.currentUiSelection = void 0;
            }
            this.riotEditor.refs.uiTools.update();
            callback();
        }
    }
};

export {selectUi};
