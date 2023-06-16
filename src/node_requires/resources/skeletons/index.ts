import * as PIXI from 'node_modules/pixi.js';
import {Spine} from 'node_modules/pixi-spine';

import generateGUID from './../../generateGUID';
import * as fs from 'fs-extra';
import * as path from 'path';

const getSkeletonData = (skeleton: ISkeleton, fs: boolean): string => {
    if (fs) {
        return path.join(global.projdir, 'skel', skeleton.origname);
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname}`;
};
const getSkeletonAtlas = (skeleton: ISkeleton, fs: boolean): string => {
    if (fs) {
        return path.join(global.projdir, 'skel', skeleton.origname.replace('.json', '.png'));
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname.replace('.json', '.png')}`;
};
const getSkeletonAtlasMeta = (skeleton: ISkeleton, fs: boolean): string => {
    if (fs) {
        return path.join(global.projdir, 'skel', skeleton.origname.replace('.json', '.atlas'));
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname.replace('.json', '.atlas')}`;
};

const getSkeletonPreview = function getSkeletonPreview(skeleton: ISkeleton, fs: boolean): string {
    if (fs) {
        return path.join(global.projdir, 'skel', `${skeleton.origname}_prev.png`);
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname}_prev.png`;
};

/**
 * Generates a square thumbnail of a given skeleton
 * @param {String} skeleton The skeleton object to generate a preview for.
 * @returns {Promise<void>} Resolves after creating a thumbnail.
 */
const skeletonGenPreview = async function (skeleton: ISkeleton): Promise<void> {
    const fs = require('fs-extra');

    const {spineData} = await PIXI.Assets.load(getSkeletonData(skeleton, false));
    const spine = new Spine(spineData);

    const app = new PIXI.Application();
    const rawSkelBase64 = await app.renderer.extract.base64(spine);
    const skelBase64 = rawSkelBase64.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(skelBase64, 'base64');

    await fs.writeFile(getSkeletonPreview(skeleton, true), buf);
};

const importSkeleton = async function importSkeleton(source: string, group?: string) {
    const uid = generateGUID();
    const savePath = path.join(global.projdir + '/skel', uid.slice(0, 6));

    const basename = path.basename(source, path.extname(source));
    const dirname = path.dirname(source);
    const origname = `${uid.slice(0, 6)}/${basename}.json`;

    const atlasPath = path.join(dirname, `${basename}.atlas`);
    const texturePath = path.join(dirname, `${basename}.png`);

    if (!(await fs.pathExists(atlasPath))) {
        throw new Error(`Could not find an atlas metadata at ${atlasPath}`);
    }
    if (!(await fs.pathExists(texturePath))) {
        throw new Error(`Could not find an atlas at ${texturePath}`);
    }

    await Promise.all([
        fs.copy(source, path.join(savePath, `${basename}.json`)),
        fs.copy(atlasPath, path.join(savePath, `${basename}.txt`)),
        fs.copy(texturePath, path.join(savePath, `${basename}.png`))
    ]);
    const skel = {
        name: basename,
        origname,
        from: 'spine',
        type: 'skeleton' as resourceType,
        lastmod: Number(Date.now()),
        group,
        uid
    };
    await skeletonGenPreview(skel);
    global.currentProject.skeletons.push(skel);
    window.signals.trigger('skeletonImported', skel);
};

export {
    getSkeletonData,
    getSkeletonAtlas,
    getSkeletonAtlasMeta,
    getSkeletonPreview,
    skeletonGenPreview,
    importSkeleton
};
