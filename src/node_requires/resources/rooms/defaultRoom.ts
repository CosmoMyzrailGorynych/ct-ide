const generateGUID = require('./../../generateGUID');

const room = {
    type: 'room' as resourceType,
    oncreate: '',
    onstep: '',
    ondraw: '',
    onleave: '',
    gridX: 64,
    gridY: 64,
    diagonalGrid: false,
    simulate: true,
    width: 1280,
    height: 720,
    isUi: false
};

const get = function (): IRoom {
    const uid = generateGUID();
    const newRoom: IRoom = Object.assign({}, room, {
        name: 'Room_' + uid.slice(-6),
        backgroundColor: '#000000',
        restrictCamera: false,
        backgrounds: [],
        copies: [],
        tiles: [],
        extends: {},
        lastmod: Number(new Date()),
        events: [],
        uid
    });
    return newRoom;
};

export {get};
