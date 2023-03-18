import {ExportedSkeleton} from './_exporterContracts';

const fs = require('fs-extra');
const basePath = './data/';

type skeletonExportData = {
    skeletonsDB: ExportedSkeleton[];
    requiresDB: boolean;
}

export const packSkeletons = async (
    proj: IProject,
    projdir: string,
    writeDir: string
): Promise<skeletonExportData> => {
    const writePromises = [];

    const exporterData: skeletonExportData = {
        skeletonsDB: [] as ExportedSkeleton[],
        requiresDB: false
    };
    for (const skeleton of proj.skeletons) {
        if (skeleton.from === 'dragonbones') {
            const slice = skeleton.origname.replace('_ske.json', '');
            writePromises.push(fs.copy(`${projdir}/img/${slice}_ske.json`, `${writeDir}/img/${slice}_ske.json`));
            writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.json`, `${writeDir}/img/${slice}_tex.json`));
            writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.png`, `${writeDir}/img/${slice}_tex.png`));
            exporterData.skeletonsDB.push([
                `./img/${slice}_ske.json`,
                `./img/${slice}_tex.json`,
                `./img/${slice}_tex.png`,
                skeleton.name
            ]);
            exporterData.requiresDB = true;
        } else {
            throw new Error(`Unsupported skeleton source of ${skeleton.name}: ${skeleton.from}.`);
        }
    }
    if (exporterData.requiresDB) {
        writePromises.push(fs.copyFile(basePath + 'ct.release/DragonBones.min.js', writeDir + '/DragonBones.min.js'));
    }
    await Promise.all(writePromises);
    return exporterData;
};

