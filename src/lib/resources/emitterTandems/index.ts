import generateGUID from '../../generateGUID';
import {IAssetContextItem, addAsset} from '..';
import {promptName} from '../promptName';
import {getByPath} from '../../i18n';

const getThumbnail = function getThumbnail(): string {
    return 'sparkles';
};

import * as defaultEmitter from './defaultEmitter';

const YAML = require('js-yaml');
import {writeFile, readFile} from '../../neutralino-fs-extra';

const createNewTandem = async (opts: {src?: string}): Promise<ITandem> => {
    if (!opts || !('src' in opts)) {
        const name = await promptName('tandem', 'New Emitter Tandem');
        if (!name) {
            // eslint-disable-next-line no-throw-literal
            throw 'cancelled';
        }

        const emitter = defaultEmitter.get();
        const id = generateGUID();

        const tandem: ITandem = {
            name,
            uid: id,
            emitters: [emitter],
            lastmod: Number(new Date()),
            type: 'tandem'
        };

        return tandem;
    }
    // Importing from file
    const source = YAML.load(await readFile(opts.src!)) as Partial<ITandem>;
    const keys: (keyof ITandem)[] = [
        'name',
        'type',
        'emitters'
    ];
    // Check for missing fields — a user might select a wrong file
    for (const key of keys) {
        if (!(key in source)) {
            const message = getByPath('createAsset.formatError') as string;
            alertify.error(message);
            throw new Error(message);
        }
    }
    const id = generateGUID(),
          slice = id.slice(-6);
    const tandem = {
        name: 'Unnamed Tandem',
        uid: id,
        origname: 'pt' + slice,
        emitters: [],
        lastmod: Number(new Date()),
        type: 'tandem'
    } as ITandem;
    Object.assign(tandem, source);
    for (const emitter of tandem.emitters) {
        emitter.uid = generateGUID();
    }
    return tandem;
};

export const areThumbnailsIcons = true;

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'copy',
    vocPath: 'common.duplicate',
    action: (asset: ITandem, collection, folder): void => {
        const newTandem = structuredClone(asset) as ITandem & {uid: string};
        newTandem.uid = generateGUID();
        newTandem.name += `_${newTandem.uid.slice(0, 4)}`;
        addAsset(newTandem, folder);
    }
}, {
    icon: 'upload',
    action: async (asset: ITandem): Promise<void> => {
        const savePath = await window.showSaveDialog({
            defaultName: `${asset.name}.ctTandem`,
            filter: '.ctTandem'
        });
        if (!savePath) {
            return;
        }
        const copy = {
            ...asset
        } as {
            type: 'tandem';
            name: string;
            emitters: Partial<ITandemEmitter>[];
            uid?: string;
            lastmod?: number;
        };
        delete copy.uid;
        delete copy.lastmod;
        for (const emitter of copy.emitters) {
            delete emitter.uid;
            emitter.texture = -1;
        }
        await writeFile(savePath, YAML.dump(copy));
        alertify.success(getByPath('common.done') as string);
    },
    vocPath: 'assetViewer.exportTandem'
}];

export {
    getThumbnail,
    defaultEmitter,
    createNewTandem as createAsset
};
