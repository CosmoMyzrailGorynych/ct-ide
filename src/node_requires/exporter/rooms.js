const glob = require('./../glob');
const {getUnwrappedExtends} = require('./utils');

const getStartingRoom = proj => {
    let [startroom] = proj.rooms; // picks the first room by default
    for (let i = 0; i < proj.rooms.length; i++) {
        if (proj.rooms[i].uid === proj.startroom) {
            startroom = proj.rooms[i];
            break;
        }
    }
    return startroom;
};
const getConstraints = r => {
    if (r.restrictCamera) {
        let x1 = r.restrictMinX || 0,
            y1 = r.restrictMinY || 0,
            x2 = r.restrictMaxX === void 0 ? r.width : r.restrictMaxX,
            y2 = r.restrictMaxX === void 0 ? r.height : r.restrictMaxY;
        if (x1 > x2) {
            [x1, x2] = [x2, x1];
        }
        if (y1 > y2) {
            [y1, y2] = [y2, y1];
        }
        return {
            x1,
            y1,
            x2,
            y2
        };
    }
    return false;
};

const stringifyRooms = proj => {
    let roomsCode = '';
    for (const k in proj.rooms) {
        const r = proj.rooms[k];

        const roomCopy = JSON.parse(JSON.stringify(r.copies));
        const objs = [];
        for (const copy of roomCopy) {
            copy.type = proj.types[glob.typemap[copy.uid]].name;
            delete copy.uid;
            objs.push(copy);
        }
        const bgsCopy = JSON.parse(JSON.stringify(r.backgrounds));
        for (const bg in bgsCopy) {
            bgsCopy[bg].texture = glob.texturemap[bgsCopy[bg].texture].g.name;
            bgsCopy[bg].depth = Number(bgsCopy[bg].depth);
        }

        const tileLayers = [];
        /* eslint {max-depth: off} */
        if (r.tiles) {
            for (const tileLayer of r.tiles) {
                const layer = {
                    depth: tileLayer.depth,
                    tiles: [],
                    extends: tileLayer.extends ? getUnwrappedExtends(tileLayer.extends) : {}
                };
                for (const tile of tileLayer.tiles) {
                    for (let x = 0; x < tile.grid[2]; x++) {
                        for (let y = 0; y < tile.grid[3]; y++) {
                            const texture = glob.texturemap[tile.texture].g;
                            layer.tiles.push({
                                texture: texture.name,
                                frame: tile.grid[0] + x + (y + tile.grid[1]) * texture.grid[0],
                                x: tile.x + x * (texture.width + texture.marginx),
                                y: tile.y + y * (texture.height + texture.marginy),
                                width: texture.width,
                                height: texture.height
                            });
                        }
                    }
                }
                tileLayers.push(layer);
            }
        }

        const constraints = getConstraints(r);

        roomsCode += `
ct.rooms.templates['${r.name}'] = {
    name: '${r.name}',
    width: ${r.width},
    height: ${r.height},
    /* JSON.parse allows for a much faster loading of big objects */
    objects: JSON.parse('${JSON.stringify(objs).replace(/\\/g, '\\\\')}'),
    bgs: JSON.parse('${JSON.stringify(bgsCopy).replace(/\\/g, '\\\\')}'),
    tiles: JSON.parse('${JSON.stringify(tileLayers).replace(/\\/g, '\\\\')}'),
    backgroundColor: '${r.backgroundColor || '#000000'}',
    ${constraints ? 'cameraConstraints: ' + JSON.stringify(constraints) + ',' : ''}
    onStep() {
        ${proj.rooms[k].onstep}
    },
    onDraw() {
        ${proj.rooms[k].ondraw}
    },
    onLeave() {
        ${proj.rooms[k].onleave}
    },
    onCreate() {
        ${proj.rooms[k].oncreate}
    },
    extends: ${proj.rooms[k].extends ? JSON.stringify(getUnwrappedExtends(proj.rooms[k].extends), null, 4) : '{}'}
}`;
    }
    return roomsCode;
};

module.exports = {
    stringifyRooms,
    getStartingRoom
};
