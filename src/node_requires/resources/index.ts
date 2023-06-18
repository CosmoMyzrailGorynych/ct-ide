import * as textures from './textures';
import * as emitterTandems from './emitterTandems';
import * as fonts from './fonts';
import * as modules from './modules';
import * as projects from './projects';
import * as sounds from './sounds';
import * as rooms from './rooms';
import * as templates from './templates';
import * as styles from './styles';
import * as skeletons from './skeletons';

/**
 * A method that returns an up-to-date DOM image of a texture for the specified asset.
 * Relies on caches in the textures and skeletons submodules.
 * @async
 */
export const getDOMImage = (asset: ISkeleton | ITemplate | ITexture): HTMLImageElement => {
    if (asset.type === 'texture') {
        return textures.getDOMTexture(asset);
    } else if (asset.type === 'template') {
        return templates.getDOMTexture(asset);
    }
    return skeletons.getDOMSkeleton(asset);
};

export const resourceToIconMap = {
    texture: 'texture',
    tandem: 'sparkles',
    font: 'ui',
    sound: 'headphones',
    room: 'room',
    template: 'template',
    style: 'ui',
    project: 'sliders'
};

export {
    textures,
    emitterTandems as tandems,
    fonts,
    modules,
    projects,
    sounds,
    rooms,
    templates,
    styles
};
