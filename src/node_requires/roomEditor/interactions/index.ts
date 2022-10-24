/* slint-disable no-use-before-define */
import {RoomEditor} from '..';
import {IRoomEditorRiotTag} from '../IRoomEditorRiotTag';

export enum EAllowedListeners {
    pointertap,
    pointerup,
    pointerupoutside,
    pointerdown,
    pointermove,
    pointerleave,

    // Custom events below
    wheel,

    home,

    delete,
    copy,
    paste,
    undo,
    redo,

    nudgeright,
    nudgeleft,
    nudgeup,
    nudgedown,

    tab,
}
export type AllowedListener = keyof typeof EAllowedListeners;
export const allowedListeners: AllowedListener[] =
    Object.keys(EAllowedListeners) as AllowedListener[];

export type InteractionListener<affixedInterface> = (
    this: RoomEditor,
    e: PIXI.InteractionEvent,
    roomTag: IRoomEditorRiotTag,
    affixedData: affixedInterface,
    finishCallback: () => void
) => void;
export interface IRoomEditorInteraction<affixedInterface> {
    ifListener: AllowedListener;
    /**
     * Checks if it is possible to run an interaction now.
     * If this method returns true, all the further interactions will be skipped
     * until the startingAction calls the provided finishCallback
     */
    if: (this: RoomEditor, e: PIXI.InteractionEvent, roomTag: IRoomEditorRiotTag) => boolean;
    listeners: Partial<Record<AllowedListener, InteractionListener<affixedInterface>>>;
}

import {updateMousePosition} from './mousePosLabel';
import {moveCameraOnWheelPress} from './camera/move';
import {goHome} from './camera/home';
import {zoomInteraction} from './camera/zoom';
import {placeCopy} from './copies/placeCopy';
import {deleteCopies} from './copies/deleteCopies';
import {placeTile} from './tiles/placeTile';
import {deleteTiles} from './tiles/deleteTiles';
import {select} from './transformer/select';
import {nudgeLeft, nudgeRight, nudgeUp, nudgeDown} from './transformer/nudge';
import {rotateSelection} from './transformer/rotate';
import {moveSelection} from './transformer/move';
import {scaleSelection} from './transformer/scale';
import {deleteSelected} from './transformer/delete';
import {copy, paste} from './copyPaste';
import {undo, redo} from './history';
import {tab} from './tab';

export const interactions = [
    updateMousePosition, // Ambient interaction — never blocks the queue

    nudgeLeft,
    nudgeRight,
    nudgeUp,
    nudgeDown,

    copy,
    paste,
    undo,
    redo,

    moveCameraOnWheelPress,

    rotateSelection,
    moveSelection,
    scaleSelection,
    deleteSelected,
    select,

    deleteCopies,
    placeCopy,

    deleteTiles,
    placeTile,

    zoomInteraction,
    goHome,

    tab
];
