import {RoomPreviewer} from '../preview/room';
import {addAsset, getOfType, IAssetContextItem} from '..';
import {promptName} from '../promptName';
import generateGUID from './../../generateGUID';
import fs from '../../neutralino-fs-extra';
import {get as getDefaultRoom} from './defaultRoom';

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
    await fs.writeBinaryFile(RoomPreviewer.getFs(room), await fetch('/data/img/notexture.png').then(r => r.arrayBuffer()));
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
        if (window.currentProject.startroom !== asset.uid) {
            window.currentProject.startroom = asset.uid;
        } else {
            window.currentProject.startroom = -1;
        }
    },
    checked: (asset: IRoom): boolean => asset.uid === window.currentProject.startroom
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

const getThumbnail = RoomPreviewer.get;
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
