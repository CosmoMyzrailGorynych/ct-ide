const getDefaultRoom = require('./defaultRoom').get;
const fs = require('fs-extra');
const path = require('path');

const createNewRoom = async function createNewRoom(name: string): Promise<IRoom> {
    const room = getDefaultRoom();
    await fs.copy('./data/img/notexture.png', path.join((global as any).projdir, '/img/r' + room.uid + '.png'));
    if (name) {
        room.name = String(name);
    }
    window.currentProject.rooms.push(room);
    window.signals.trigger('roomsChanged');
    return room;
};

/**
 * Gets the ct.js room object by its id.
 * @param {string} id The id of the ct.js room
 * @returns {IRoom} The ct.js room object
 */
const getRoomFromId = function getRoomFromId(id: string): IRoom {
    const room = global.currentProject.rooms.find((r: IRoom) => r.uid === id);
    if (!room) {
        throw new Error(`Attempt to get a non-existent room with ID ${id}`);
    }
    return room;
};
const getById = getRoomFromId;

/**
 * Retrieves the full path to a thumbnail of a given room.
 * @param {string|IRoom} room Either the id of the room, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 340x256 image instead of 64x64.
 *                       (Not implemented, actually!)
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
const getRoomPreview = (room: assetRef | IRoom, x2: boolean, fs: boolean): string => {
    void x2;
    if (room === -1) {
        return 'data/img/notexture.png';
    }
    if (typeof room === 'string') {
        room = getRoomFromId(room);
    }
    if (fs) {
        return `${(global as any).projdir}/img/r${room.thumbnail}.png`;
    }
    return `file://${(global as any).projdir}/img/r${room.thumbnail}.png?${room.lastmod}`;
};
const getThumbnail = getRoomPreview;

export {
    createNewRoom,
    getRoomFromId,
    getById,
    getRoomPreview,
    getThumbnail
};
