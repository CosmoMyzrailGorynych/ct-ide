import {RoomPreviewer} from '../preview/room';
import {getOfType, IAssetContextItem} from '..';

const getDefaultRoom = require('./defaultRoom').get;
const fs = require('fs-extra');
const path = require('path');

const createNewRoom = async function createNewRoom(name: string): Promise<IRoom> {
    const room = getDefaultRoom();
    await fs.copy('./data/img/notexture.png', path.join((global as any).projdir, '/img/r' + room.uid + '.png'));
    if (name) {
        room.name = String(name);
    }
    window.signals.trigger('roomsChanged');
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
    action: (asset: ISkeleton): void => {
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


export {
    createNewRoom,
    createNewRoom as createAsset,
    getThumbnail
};
