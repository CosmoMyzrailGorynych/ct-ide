import * as textures from './textures';
import * as emitterTandems from './emitterTandems';
import * as fonts from './fonts';
import * as modules from './modules';
import * as projects from './projects';
import * as sounds from './sounds';
import * as rooms from './rooms';
import * as templates from './templates';
import * as styles from './styles';

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
