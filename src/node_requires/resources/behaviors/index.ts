import {get as getDefaultBehavior} from './defaultBehavior';
import {IAssetContextItem, getByTypes} from '..';
import {promptName} from '../promptName';
import {canBeDynamicBehavior, getEventByLib} from '../../events';

import {getByPath} from '../../i18n';

const YAML = require('js-yaml');
import {writeFile, readFile} from 'fs-extra';

export const getThumbnail = (): string => 'behavior';
export const areThumbnailsIcons = true;

export const createAsset = async (opts: {
    name?: string,
    behaviorType: BehaviorType
} | {
    src: string
}): Promise<IBehavior> => {
    // Importing from a file
    if ('src' in (opts)) {
        const source = YAML.safeLoad(await readFile(opts.src)) as Partial<IBehavior>;
        const keys: (keyof IBehavior)[] = [
            'name',
            'type',
            'behaviorType',
            'events',
            'specification'
        ];
        for (const key of keys) {
            if (!(key in source)) {
                const message = getByPath('createAsset.formatError') as string;
                alertify.error(message);
                throw new Error(message);
            }
        }
        const missingCatmods = source.events.filter(e => e.lib !== 'core' && e.lib)
            .map(e => e.lib);
        if (missingCatmods.length) {
            const message = getByPath('createAsset.behaviorMissingCatmods')
                .replace('$1', missingCatmods.join(', '));
            alertify.warn(message);
            throw new Error(message);
        }
        const behavior = getDefaultBehavior(source.behaviorType);
        Object.assign(behavior, source);
        return behavior;
    }
    const behavior = getDefaultBehavior(opts.behaviorType);
    if (opts.name) {
        behavior.name = opts.name;
        return behavior;
    }
    const name = await promptName('behavior', 'New Behavior');
    if (name) {
        behavior.name = name;
        return behavior;
    }
    // eslint-disable-next-line no-throw-literal
    throw 'cancelled';
};

export const removeAsset = (asset: IBehavior): void => {
    const {room: rooms, template: templates} = getByTypes();
    for (const room of rooms) {
        room.behaviors = room.behaviors.filter(b => b !== asset.uid);
    }
    for (const template of templates) {
        template.behaviors = template.behaviors.filter(b => b !== asset.uid);
    }
};

import {getIcons as getScriptableIcons} from '../scriptables';
export const getIcons = (asset: IBehavior): string[] => {
    if (!asset.events.every(e => canBeDynamicBehavior(getEventByLib(e.eventKey, e.lib)))) {
        return ['snowflake', ...getScriptableIcons(asset)];
    }
    return getScriptableIcons(asset);
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'upload',
    action: async (asset: IBehavior): Promise<void> => {
        const savePath = await window.showSaveDialog({
            defaultName: `${asset.name}.ctBehavior`,
            filter: '.ctBehavior'
        });
        if (!savePath) {
            return;
        }
        const copy = {
            ...asset
        };
        delete copy.uid;
        delete copy.lastmod;
        await writeFile(savePath, YAML.safeDump(copy));
        alertify.success(getByPath('common.done'));
    },
    vocPath: 'assetViewer.exportBehavior'
}];
