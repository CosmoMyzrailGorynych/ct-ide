import {RoomPreviewer} from '../preview/room';
import {getOfType, IAssetContextItem} from '..';
import {promptName} from '../promptName';

const getDefaultRoom = require('./defaultRoom').get;
const fs = require('fs-extra');

const createNewRoom = async (name?: string): Promise<IRoom | null> => {
    const room = getDefaultRoom();
    if (name) {
        room.name = String(name);
    } else {
        const name = await promptName('room', 'New Room');
        if (name) {
            room.name = name;
        } else {
            // eslint-disable-next-line no-throw-literal
            throw 'cancelled';
        }
    }
    await fs.copy('./data/img/notexture.png', RoomPreviewer.get(room, true));
    return room;
};

export const getStartingRoom = (): IRoom => {
    const rooms = getOfType('room');
    if (global.currentProject.startroom && global.currentProject.startroom !== -1) {
        return rooms.find(room => room.uid === global.currentProject.startroom);
    }
    return rooms[0];
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'play',
    vocPath: 'rooms.makeStarting',
    action: (asset: IRoom): void => {
        global.currentProject.startroom = asset.uid;
    }
}];

const getThumbnail = RoomPreviewer.getClassic;
export const areThumbnailsIcons = false;

export const removeAsset = (room: IRoom): void => {
    if (global.currentProject.startroom === room.uid) {
        global.currentProject.startroom = -1;
    }
};

import {getIcons as getScriptableIcons} from '../scriptables';
export const getIcons = (asset: IRoom): string[] => {
    if (asset.uid === window.currentProject.startroom) {
        return ['play', ...getScriptableIcons(asset)];
    }
    return getScriptableIcons(asset);
};

export const getDefaultAlign = (): IRoomCopy['align'] => ({
    frame: {
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100
    },
    alignX: 'start' as CopyAlignment,
    alignY: 'start' as CopyAlignment,
    padding: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
});


export {
    createNewRoom,
    createNewRoom as createAsset,
    getThumbnail
};
