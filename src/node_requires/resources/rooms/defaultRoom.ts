const generateGUID = require('./../../generateGUID');

const room = {
    type: 'room' as resourceType,
    oncreate: '',
    onstep: '',
    ondraw: '',
    onleave: '',
    gridX: 64,
    gridY: 64,
    width: 1280,
    height: 720
};

const get = function (): IRoom {
    const uid = generateGUID();
    const newRoom = Object.assign({}, room, {
        name: 'Room_' + uid.slice(-6),
        backgrounds: [],
        copies: [],
        tiles: [],
        extends: {},
        lastmod: Number(new Date()),
        thumbnail: uid,
        uid
    });
    return newRoom;
};

export {get};
