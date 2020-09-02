const path = require('path');

const getSkeletonData = function getSkeletonData(skeleton, fs) {
    if (fs) {
        return path.join(global.projdir, 'img', skeleton.origname);
    }
    return `file://${global.projdir}/img/${skeleton.origname}`;
};
const getSkeletonTextureData = function getSkeletonTextureData(skeleton, fs) {
    const slice = skeleton.origname.replace('_ske.json', '');
    if (fs) {
        return path.join(global.projdir, 'img', `${slice}_tex.json`);
    }
    return `file://${global.projdir}/img/${slice}_tex.json`;
};
const getSkeletonTexture = function getSkeletonTexture(skeleton, fs) {
    const slice = skeleton.origname.replace('_ske.json', '');
    if (fs) {
        return path.join(global.projdir, 'img', `${slice}_tex.png`);
    }
    return `file://${global.projdir}/img/${slice}_tex.png`;
};

const getSkeletonPreview = function getSkeletonPreview(skeleton, fs) {
    if (fs) {
        return path.join(global.projdir, 'img', `${skeleton.origname}_prev.png`);
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/img/${skeleton.origname}_prev.png`;
};

/**
 * Generates a square thumbnail of a given skeleton
 * @param {String} skeleton The skeleton object to generate a preview for.
 * @returns {Promise<void>} Resolves after creating a thumbnail.
 */
const skeletonGenPreview = function (skeleton) {
    const loader = new PIXI.loaders.Loader(),
          dbf = dragonBones.PixiFactory.factory;
    const fs = require('fs-extra');
    return new Promise((resolve, reject) => {
        // Draw the armature on a canvas/in a Pixi.js app
        const skelData = getSkeletonData(skeleton),
              texData = getSkeletonTextureData(skeleton),
              tex = getSkeletonTexture(skeleton);
        loader.add(skelData, skelData)
              .add(texData, texData)
              .add(tex, tex);
        loader.load(() => {
            dbf.parseDragonBonesData(loader.resources[skelData].data);
            dbf.parseTextureAtlasData(
                loader.resources[texData].data,
                loader.resources[tex].texture
            );
            const skel = dbf.buildArmatureDisplay('Armature', loader.resources[skelData].data.name);

            const app = new PIXI.Application();

            const rawSkelBase64 = app.renderer.plugins.extract.base64(skel);
            const skelBase64 = rawSkelBase64.replace(/^data:image\/\w+;base64,/, '');
            const buf = new Buffer(skelBase64, 'base64');

            fs.writeFile(getSkeletonPreview(skeleton, true), buf)
            .then(() => {
                // Clean memory from DragonBones' armatures
                // eslint-disable-next-line no-underscore-dangle
                delete dbf._dragonBonesDataMap[loader.resources[skelData].data.name];
                // eslint-disable-next-line no-underscore-dangle
                delete dbf._textureAtlasDataMap[loader.resources[skelData].data.name];
            })
            .then(resolve)
            .catch(reject);
        });
    });
};

const importSkeleton = async function importSkeleton(source) {
    const generateGUID = require('./../generateGUID');
    const fs = require('fs-extra');

    const uid = generateGUID();
    const partialDest = path.join(global.projdir + '/img/skdb' + uid);

    await Promise.all([
        fs.copy(source, partialDest + '_ske.json'),
        fs.copy(source.replace('_ske.json', '_tex.json'), partialDest + '_tex.json'),
        fs.copy(source.replace('_ske.json', '_tex.png'), partialDest + '_tex.png')
    ]);
    const skel = {
        name: path.basename(source).replace('_ske.json', ''),
        origname: path.basename(partialDest + '_ske.json'),
        from: 'dragonbones',
        uid
    };
    await skeletonGenPreview(skel);
    global.currentProject.skeletons.push(skel);
    window.signals.trigger('skeletonImported', skel);
};

module.exports = {
    getSkeletonData,
    getSkeletonTextureData,
    getSkeletonTexture,
    getSkeletonPreview,
    skeletonGenPreview,
    importSkeleton
};
