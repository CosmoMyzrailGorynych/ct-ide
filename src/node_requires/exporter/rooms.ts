const glob = require('./../glob');
const {getUnwrappedExtends} = require('./utils');
import {getBaseScripts} from './scriptableProcessor';

const getStartingRoom = (proj: IProject): IRoom => {
    let [startroom] = proj.rooms; // picks the first room by default
    for (let i = 0; i < proj.rooms.length; i++) {
        if (proj.rooms[i].uid === proj.startroom) {
            startroom = proj.rooms[i];
            break;
        }
    }
    return startroom;
};
const getConstraints = (r: IRoom) => {
    if (r.restrictCamera) {
        let x1 = r.restrictMinX || 0,
            y1 = r.restrictMinY || 0,
            x2 = r.restrictMaxX === void 0 ? r.width : r.restrictMaxX,
            y2 = r.restrictMaxY === void 0 ? r.height : r.restrictMaxY;
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

interface IExportedTile {
    texture: string,
    frame: number,
    x: number,
    y: number,
    width: number,
    height: number,
    opacity: number,
    rotation: number,
    scale: {
        x: number,
        y: number
    },
    tint: number
}
type ExportedCopy = Omit<IRoomCopy, 'uid'> & {template: string};

// eslint-disable-next-line max-lines-per-function
const stringifyRooms = (proj: IProject): IScriptablesFragment => {
    let roomsCode = '';
    let rootRoomOnCreate = '';
    let rootRoomOnStep = '';
    let rootRoomOnDraw = '';
    let rootRoomOnLeave = '';

    for (const r of proj.rooms) {
        const objs: ExportedCopy[] = [];
        for (const copy of r.copies) {
            const exportableCopy = {
                ...copy,
                template: proj.templates[glob.templatemap[copy.uid]].name
            };
            delete exportableCopy.uid;
            objs.push(exportableCopy);
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
                    tiles: [] as IExportedTile[],
                    extends: tileLayer.extends ? getUnwrappedExtends(tileLayer.extends) : {}
                };
                for (const tile of tileLayer.tiles) {
                    const texture = glob.texturemap[tile.texture].g;
                    layer.tiles.push({
                        texture: texture.name,
                        frame: tile.frame,
                        x: tile.x,
                        y: tile.y,
                        width: texture.width,
                        height: texture.height,
                        opacity: tile.opacity,
                        rotation: tile.rotation,
                        scale: {
                            x: tile.scale.x,
                            y: tile.scale.y
                        },
                        tint: tile.tint
                    });
                }
                tileLayers.push(layer);
            }
        }

        const constraints = getConstraints(r);
        const scriptableCode = getBaseScripts(r);

        roomsCode += `
ct.rooms.templates['${r.name}'] = {
    name: '${r.name}',
    width: ${r.width},
    height: ${r.height},` +
    /* JSON.parse is faster at loading big objects */`
    objects: JSON.parse('${JSON.stringify(objs).replace(/\\/g, '\\\\')}'),
    bgs: JSON.parse('${JSON.stringify(bgsCopy).replace(/\\/g, '\\\\')}'),
    tiles: JSON.parse('${JSON.stringify(tileLayers).replace(/\\/g, '\\\\')}'),
    backgroundColor: '${r.backgroundColor || '#000000'}',
    ${constraints ? 'cameraConstraints: ' + JSON.stringify(constraints) + ',' : ''}
    onStep() {
        ${scriptableCode.thisOnStep}
    },
    onDraw() {
        ${scriptableCode.thisOnDraw}
    },
    onLeave() {
        ${scriptableCode.thisOnDestroy}
    },
    onCreate() {
        ${scriptableCode.thisOnCreate}
    },
    isUi: ${r.isUi},
    extends: ${r.extends ? JSON.stringify(getUnwrappedExtends(r.extends), null, 4) : '{}'}
}
        `;
        rootRoomOnCreate += scriptableCode.rootRoomOnCreate;
        rootRoomOnStep += scriptableCode.rootRoomOnStep;
        rootRoomOnDraw += scriptableCode.rootRoomOnDraw;
        rootRoomOnLeave += scriptableCode.rootRoomOnLeave;
    }
    return {
        libCode: roomsCode,
        rootRoomOnCreate,
        rootRoomOnStep,
        rootRoomOnDraw,
        rootRoomOnLeave
    };
};

export {
    stringifyRooms,
    getStartingRoom
};
