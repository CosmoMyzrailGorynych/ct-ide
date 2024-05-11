/*
 * This file returns versions for nw.js and pixi.js, as well as checks
 * that pixi.js versions used for game packaging are the same.
 */

const builderManifest = require('./package.json');

const unfixedRegex = /^[~^]|^[\d.]+-[\d.]+$/;

const versionMessage = 'versions.js has found an error in ct.js configuration!';
const makeTab = () => console.error(`╭─${'─'.repeat(versionMessage.length)}─╮
│ ${versionMessage} │
╰─${'─'.repeat(versionMessage.length)}─╯`);

const packagesToCheck = {
    pixi: 'pixi.js',
    pixiLegacy: 'pixi.js-legacy',
    pixiParticles: '@pixi/particle-emitter'
};
const packageVersions = {};
for (const packageKey in packagesToCheck) {
    packageVersions[packageKey] = builderManifest.dependencies[packagesToCheck[packageKey]];
    if (!packageVersions[packageKey] || unfixedRegex.test(packageVersions[packageKey])) {
        makeTab();
        throw new Error(`${packageKey} package used in the app folder is not set to a fixed version. This must be fixed. Current value is "${packageVersions[packageKey]}".`);
    }
}

if (packageVersions.pixi !== packageVersions.pixiLegacy) {
    makeTab();
    throw new Error(`pixi.js-legacy and pixi.js packages in the app folder are not equal. This must be fixed. Current values are "${packageVersions.pixiLegacy}" for pixi.js-legacy and "${packageVersions.pixi}" for pixi.js.`);
}

module.exports = {
    nwjs: '0.72.0',
    nwjsArm: '0.67.1',
    ...packageVersions
};
