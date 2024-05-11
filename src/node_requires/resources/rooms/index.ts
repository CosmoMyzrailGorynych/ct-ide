import {RoomPreviewer} from '../preview/room';
import {addAsset, getOfType, IAssetContextItem} from '..';
import {promptName} from '../promptName';
import generateGUID from './../../generateGUID';

const getDefaultRoom = require('./defaultRoom').get;
const fs = require('fs-extra');

const createNewRoom = async (name?: string): Promise<IRoom> => {
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
    if (window.currentProject.language === 'catnip') {
        room.properties = [];
    }
    await fs.copy('./data/img/notexture.png', RoomPreviewer.get(room, true));
    return room;
};

export const getStartingRoom = (): IRoom => {
    const rooms = getOfType('room');
    if (window.currentProject.startroom && window.currentProject.startroom !== -1) {
        const room = rooms.find(room => room.uid === window.currentProject.startroom);
        if (room) {
            return room;
        }
        window.currentProject.startroom = -1;
    }
    return rooms[0];
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'play',
    vocPath: 'rooms.makeStarting',
    action: (asset: IRoom): void => {
        window.currentProject.startroom = asset.uid;
    }
}, {
    icon: 'copy',
    vocPath: 'common.duplicate',
    action: async (asset: IRoom, collection, folder): Promise<void> => {
        const newRoom = structuredClone(asset) as IRoom & {uid: string};
        newRoom.uid = generateGUID();
        newRoom.name += `_${newRoom.uid.slice(0, 4)}`;
        await RoomPreviewer.save(newRoom, false);
        addAsset(newRoom, folder);
    }
}];

const getThumbnail = RoomPreviewer.getClassic;
export const areThumbnailsIcons = false;

export const removeAsset = (room: IRoom): void => {
    if (window.currentProject.startroom === room.uid) {
        window.currentProject.startroom = -1;
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
