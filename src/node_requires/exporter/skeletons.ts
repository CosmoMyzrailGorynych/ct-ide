import {ExportedSkeleton} from './_exporterContracts';
import * as skels from '../resources/skeletons';

import * as path from 'path';
import * as fs from 'fs-extra';
const basePath = './data/';

type skeletonExportData = {
    skeletons: ExportedSkeleton[];
}

export const packSkeletons = async (
    input: ISkeleton[],
    writeDir: string
): Promise<skeletonExportData> => {
    const writePromises = [];

    const exporterData: skeletonExportData = {
        skeletons: [] as ExportedSkeleton[]
    };
    for (const skeleton of input) {
        if (skeleton.from !== 'spine') {
            throw new Error(`Skeleton ${skeleton.name} is from unsupported source "${skeleton.from}". You should probably contact support.`);
        }
        const dataPath = skels.getSkeletonData(skeleton, true),
              atlasPath = skels.getSkeletonAtlas(skeleton, true),
              atlasMetaPath = skels.getSkeletonAtlasMeta(skeleton, true);
        writePromises.push(fs.copy(dataPath, `${writeDir}/skel/${path.basename(dataPath)}`));
        writePromises.push(fs.copy(atlasPath, `${writeDir}/skel/${path.basename(atlasPath)}`));
        writePromises.push(fs.copy(atlasMetaPath, `${writeDir}/skel/${path.basename(atlasMetaPath)}`));
        exporterData.skeletons.push({
            name: skeleton.name,
            dataPath: `skel/${path.basename(dataPath)}`
        });
    }
    await Promise.all(writePromises);
    return exporterData;
};
