import {parseFile} from '../declarationExtractor';
import {convertFromDtsToBlocks} from '../blockUtils';

const filterPatchMenu = (
    menus: blockMenu[],
    blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[],
    filterPrefix: string,
    icon: string,
    name: string
): blockMenu => {
    const filtered = blocks.filter(block => block.code.startsWith(filterPrefix));
    filtered.forEach(b => {
        b.icon = icon;
        b.name = b.name.replace(/^index\./, 'replaceValue');
        b.i18nKey = `${name.toLowerCase()} ${b.name}`;
        if (b.displayName) {
            b.displayI18nKey = `${name.toLowerCase()} ${b.name}`;
        }
    });
    const menu: blockMenu = {
        name,
        items: filtered,
        opened: false,
        i18nKey: name.toLowerCase(),
        icon
    };
    menus.push(menu);
    return menu;
};

const sortHelper = {
    command: -1,
    computed: 1
};

import templatesBlocks from './templates';
import soundsBlocks from './sounds';
import roomsBlocks from './rooms';
import miscBlocks from './misc';
import settingsBlocks from './settings';

export const loadBlocks = async (): Promise<blockMenu[]> => {
    let parsed = await parseFile('/data/typedefs/ct.d.ts', true);
    parsed = parsed.filter(d => !/pixi/i.test(d.name));
    for (const useful of parsed) {
        useful.name = useful.name.replace(/^src\/ct.release\/(index\.)?/, '');
        useful.name = useful.name.replace(/([a-zA-Z]+).\1Lib/, '$1');
    }
    const allBlocks = convertFromDtsToBlocks(parsed, 'core');

    const menus: blockMenu[] = [];

    const templates = filterPatchMenu(menus, allBlocks, 'templates.', 'template', 'Templates');
    templates.items.unshift(...templatesBlocks);
    templates.items.sort((a, b) => sortHelper[a.type] - sortHelper[b.type]);

    const rooms = filterPatchMenu(menus, allBlocks, 'rooms.', 'room', 'Rooms');
    rooms.items.push(...roomsBlocks);
    rooms.items.sort((a, b) => sortHelper[a.type] - sortHelper[b.type]);

    filterPatchMenu(menus, allBlocks, 'behaviors.', 'behavior', 'Behaviors');
    const sounds = filterPatchMenu(menus, allBlocks, 'sounds.', 'music', 'Sounds');
    sounds.items.unshift(...soundsBlocks);

    const styles = filterPatchMenu(menus, allBlocks, 'styles.', 'droplet', 'Styles');
    miscBlocks.push(...styles.items);
    menus.splice(menus.indexOf(styles), 1);

    filterPatchMenu(menus, allBlocks, 'backgrounds.', 'image', 'Backgrounds');

    filterPatchMenu(menus, allBlocks, 'emitters.', 'sparkles', 'Emitter tandems');

    filterPatchMenu(menus, allBlocks, 'u.', 'tool', 'Utilities');

    const settings = filterPatchMenu(menus, allBlocks, 'settings.', 'settings', 'Settings');
    settings.items.unshift(...settingsBlocks);

    return menus;
};
