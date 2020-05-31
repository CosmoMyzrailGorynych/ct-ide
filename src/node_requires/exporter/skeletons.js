const fs = require('fs-extra');
const basePath = './data/';

const packSkeletons = async (proj, projdir, writeDir) => {
    const writePromises = [];

    const exporterData = {
        loaderScript: 'PIXI.Loader.shared',
        startScript: 'const dbf = dragonBones.PixiFactory.factory;',
        registry: {},
        requiresDB: false
    };
    if (!proj.skeletons.length) {
        exporterData.startScript = '';
        exporterData.loaderScript = '';
        exporterData.registry = JSON.stringify(exporterData.registry);
        return exporterData;
    }
    for (const skeleton of proj.skeletons) {
        const slice = skeleton.origname.replace('_ske.json', '');
        writePromises.push(fs.copy(`${projdir}/img/${slice}_ske.json`, `${writeDir}/img/${slice}_ske.json`));
        writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.json`, `${writeDir}/img/${slice}_tex.json`));
        writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.png`, `${writeDir}/img/${slice}_tex.png`));

        exporterData.loaderScript += `.add('${slice}_ske.json', './img/${slice}_ske.json')`;
        exporterData.loaderScript += `.add('${slice}_tex.json', './img/${slice}_tex.json')`;
        exporterData.loaderScript += `.add('${slice}_tex.png', './img/${slice}_tex.png')`;

        exporterData.startScript += `dbf.parseDragonBonesData(PIXI.Loader.shared.resources['${slice}_ske.json'].data);\n`;
        exporterData.startScript += `dbf.parseTextureAtlasData(PIXI.Loader.shared.resources['${slice}_tex.json'].data, PIXI.Loader.shared.resources['${slice}_tex.png'].texture);\n`;

        exporterData.registry[skeleton.name] = {
            origname: slice,
            type: skeleton.from
        };
        if (skeleton.from === 'dragonbones') {
            exporterData.requiresDB = true;
        }
    }
    exporterData.loaderScript += ';';
    if (exporterData.requiresDB) {
        writePromises.push(fs.copyFile(basePath + 'ct.release/DragonBones.min.js', writeDir + '/DragonBones.min.js'));
    }
    exporterData.registry = JSON.stringify(exporterData.registry);
    await Promise.all(writePromises);
    return exporterData;
};

module.exports = {
    packSkeletons
};
