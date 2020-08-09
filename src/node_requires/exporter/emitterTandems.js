const textures = require('../resources/textures');
const stringifyTandems = project => {
    const tandems = {};
    for (const tandem of project.emitterTandems) {
        tandems[tandem.name] = tandem.emitters.map(emitter => {
            if (emitter.texture === -1) {
                throw new Error(`The emitter tandem ${tandem.name} has an emitter without a texture, see Emitter ${emitter.uid.split('-').pop()}.`);
            }
            return {
                texture: textures.getTextureFromId(emitter.texture).name,
                settings: emitter.settings
            };
        });
    }
    return JSON.stringify(tandems, null, '    ');
};

module.exports = {
    stringifyTandems
};
