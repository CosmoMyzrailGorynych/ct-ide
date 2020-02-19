const fs = require('fs-extra');
const basePath = './data/';

const packSkeletons = async (proj, projdir, writeDir) => {
    const writePromises = [];

    const data = {
        loaderScript: 'PIXI.Loader.shared',
        startScript: 'const dbf = dragonBones.PixiFactory.factory;',
        registry: {},
        requiresDB: false
    };
    if (!proj.skeletons.length) {
        data.startScript = '';
        data.loaderScript = '';
        data.registry = JSON.stringify(data.registry);
        return data;
    }
    for (const skeleton of proj.skeletons) {
        const slice = skeleton.origname.replace('_ske.json', '');
        writePromises.push(fs.copy(`${projdir}/img/${slice}_ske.json`, `${writeDir}/img/${slice}_ske.json`));
        writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.json`, `${writeDir}/img/${slice}_tex.json`));
        writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.png`, `${writeDir}/img/${slice}_tex.png`));

        data.loaderScript += `.add('${slice}_ske.json', './img/${slice}_ske.json')`;
        data.loaderScript += `.add('${slice}_tex.json', './img/${slice}_tex.json')`;
        data.loaderScript += `.add('${slice}_tex.png', './img/${slice}_tex.png')`;

        data.startScript += `dbf.parseDragonBonesData(PIXI.Loader.shared.resources['${slice}_ske.json'].data);\n`;
        data.startScript += `dbf.parseTextureAtlasData(PIXI.Loader.shared.resources['${slice}_tex.json'].data, PIXI.Loader.shared.resources['${slice}_tex.png'].texture);\n`;

        data.registry[skeleton.name] = {
            origname: slice,
            type: skeleton.from
        };
        if (skeleton.from === 'dragonbones') {
            data.requiresDB = true;
        }
    }
    data.loaderScript += ';';
    if (data.requiresDB) {
        writePromises.push(fs.copyFile(basePath + 'ct.release/DragonBones.min.js', writeDir + '/DragonBones.min.js'));
    }
    data.registry = JSON.stringify(data.registry);
    await Promise.all(writePromises);
    return data;
};

module.exports = {packSkeletons};
